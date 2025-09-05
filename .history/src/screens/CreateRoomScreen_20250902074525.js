import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { subscribeRoom } from '../services/rooms';

export default function CreateRoomScreen({ route, navigation }) {
  const { identity } = route.params || {};

  // Encode inviter only
  const payload = JSON.stringify({
    type: 'joinRoom',
    inviter: identity,
  });

  useEffect(() => {
    // Subscribe to all possible rooms with this inviter
    // (in real app, you’d pass scanner’s ID from QR scan, but we detect room creation dynamically)
    const unsub = subscribeRoomListener();
    return () => unsub && unsub();
  }, []);

  const subscribeRoomListener = () => {
    // This works after someone scans (room is created with inviter+joiner)
    // We check every new room that contains inviter
    const roomIdPattern = identity.userId; // inviter must be in roomId
    return subscribeRoom(roomIdPattern, (room) => {
      if (room) {
        const otherUser = room.users.find((u) => u.userId !== identity.userId);
        navigation.replace('Chat', {
          roomId: room.roomId,
          me: identity,
          other: otherUser,
        });
      }
    });
  };

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
