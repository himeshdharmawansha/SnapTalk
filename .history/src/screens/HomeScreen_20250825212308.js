import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation, identity }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, {identity.username}</Text>
      <View style={styles.row}>
        <Button title="Create Room (Show QR)" onPress={() => navigation.navigate('CreateRoom', { identity })} />
      </View>
      <View style={styles.row}>
        <Button title="Scan & Join" onPress={() => navigation.navigate('ScanJoin', { identity })} />
      </View>
      <View style={styles.row}>
        <Button title="Pending Requests" onPress={() => navigation.navigate('PendingRequests', { identity })} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 20, marginBottom: 24 },
  row: { width: '100%', marginBottom: 12 },
});


