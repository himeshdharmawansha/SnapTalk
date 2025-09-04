import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function CreateRoomScreen({ route }) {
  const { identity } = route.params || {};

  // Only encode inviter identity (no room yet)
  const payload = JSON.stringify({
    type: 'joinRoom',
    inviter: identity,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Show this QR to your friend</Text>
      <QRCode value={payload} size={220} />
      <Text style={styles.code}>User: {identity.username}</Text>
      <Text>Waiting for someone to scan...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  title: { fontSize: 18, marginBottom: 12 },
  code: { marginTop: 12, color: '#555' },
});

