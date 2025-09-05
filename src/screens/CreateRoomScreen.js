// screens/CreateRoomScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { subscribeInviterActiveRoom, clearInviterActiveRoom } from '../services/rooms';

export default function CreateRoomScreen({ route, navigation }) {
  const { identity } = route.params || {};

  // QR contains ONLY inviter info (no room created yet)
  const payload = JSON.stringify({
    type: 'joinRoom',
    inviter: identity,
  });

  useEffect(() => {
    // listen for the pointer doc: users/{inviterId}/activeRoom/current
    const unsub = subscribeInviterActiveRoom(identity.userId, (pointer) => {
      if (!pointer?.roomId || !pointer?.other) return;
      // Navigate once someone scanned and room was created/reused
      navigation.replace('Chat', {
        roomId: pointer.roomId,
        me: identity,
        other: pointer.other,
      });
      // Optional: clear pointer; comment this out if you want to keep it
      clearInviterActiveRoom(identity.userId);
    });

    return () => unsub && unsub();
  }, [identity?.userId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Show this QR to your friend</Text>
      <QRCode value={payload} size={220} />
      <Text style={styles.code}>User: {identity?.username}</Text>
      <Text>Waiting for someone to scan...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  title: { fontSize: 18, marginBottom: 12 },
  code: { marginTop: 12, color: '#555' },
});

