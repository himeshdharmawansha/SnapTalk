import React, { useEffect, useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ToastAndroid, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import CreateRoomScreen from './src/screens/CreateRoomScreen';
import ScanJoinScreen from './src/screens/ScanJoinScreen';
import PendingRequestsScreen from './src/screens/PendingRequestsScreen';
import ChatScreen from './src/screens/ChatScreen';
import { loadOrCreateIdentity } from './src/services/identity';

const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [identity, setIdentity] = useState(null);

  useEffect(() => {
    (async () => {
      const ident = await loadOrCreateIdentity();
      setIdentity(ident);
      setIsReady(true);
    })();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.requestPermissionsAsync();
    }
  }, []);

  useEffect(() => {
    if (!identity) return;
    ToastAndroid.show(`Welcome ${identity.username}`, ToastAndroid.SHORT);
  }, [identity]);

  if (!isReady) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!identity?.username ? (
          <Stack.Screen name="Onboarding" options={{ headerShown: false }}>
            {(props) => (
              <OnboardingScreen
                {...props}
                onDone={(ident) => setIdentity(ident)}
              />
            )}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Home" options={{ title: 'Instant Chat' }}>
              {(props) => <HomeScreen {...props} identity={identity} />}
            </Stack.Screen>
            <Stack.Screen name="CreateRoom" options={{ title: 'Create Room' }} component={CreateRoomScreen} />
            <Stack.Screen name="ScanJoin" options={{ title: 'Scan & Join' }} component={ScanJoinScreen} />
            <Stack.Screen name="PendingRequests" options={{ title: 'Join Requests' }} component={PendingRequestsScreen} />
            <Stack.Screen name="Chat" options={{ title: 'Chat' }} component={ChatScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
