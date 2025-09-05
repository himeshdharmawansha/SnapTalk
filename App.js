import React, { useEffect, useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ToastAndroid, Platform, StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { safeNotifications } from './src/utils/notifications';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import CreateRoomScreen from './src/screens/CreateRoomScreen';
import ScanJoinScreen from './src/screens/ScanJoinScreen';
import PendingRequestsScreen from './src/screens/PendingRequestsScreen';
import ChatScreen from './src/screens/ChatScreen';
import LoadingScreen from './src/components/LoadingScreen';
import { loadOrCreateIdentity } from './src/services/identity';

const Stack = createNativeStackNavigator();

// Custom header component for Home screen
const SnapTalkHeader = () => (
  <View style={headerStyles.container}>
    <View style={headerStyles.logoContainer}>
      <View style={headerStyles.logoIcon}>
        <Icon name="chat" size={24} color="#6366F1" />
      </View>
      <Text style={headerStyles.logoText}>SnapTalk</Text>
    </View>
  </View>
);

safeNotifications.setNotificationHandler({
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
      safeNotifications.requestPermissionsAsync();
    }
  }, []);

  useEffect(() => {
    if (!identity) return;
    ToastAndroid.show(`Welcome ${identity.username}`, ToastAndroid.SHORT);
  }, [identity]);

  if (!isReady) return <LoadingScreen />;

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
            <Stack.Screen 
              name="Home" 
              options={{ 
                headerTitle: () => <SnapTalkHeader />,
                headerStyle: {
                  backgroundColor: '#0B1220',
                },
                headerTintColor: '#F3F4F6',
              }}
            >
              {(props) => <HomeScreen {...props} identity={identity} />}
            </Stack.Screen>
            <Stack.Screen 
              name="CreateRoom" 
              options={{ 
                title: 'Create Room',
                headerStyle: {
                  backgroundColor: '#0B1220',
                },
                headerTintColor: '#F3F4F6',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 18,
                },
              }} 
              component={CreateRoomScreen} 
            />
            <Stack.Screen 
              name="ScanJoin" 
              options={{ 
                title: 'Scan & Join',
                headerStyle: {
                  backgroundColor: '#0B1220',
                },
                headerTintColor: '#F3F4F6',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 18,
                },
              }} 
              component={ScanJoinScreen} 
            />
            <Stack.Screen 
              name="PendingRequests" 
              options={{ 
                title: 'Join Requests',
                headerStyle: {
                  backgroundColor: '#0B1220',
                },
                headerTintColor: '#F3F4F6',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 18,
                },
              }} 
              component={PendingRequestsScreen} 
            />
            <Stack.Screen 
              name="Chat" 
              options={{ 
                title: 'Chat',
                headerStyle: {
                  backgroundColor: '#0B1220',
                },
                headerTintColor: '#F3F4F6',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 18,
                },
              }} 
              component={ChatScreen} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#6366F1',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  
  logoText: {
    color: '#F3F4F6',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(99, 102, 241, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
