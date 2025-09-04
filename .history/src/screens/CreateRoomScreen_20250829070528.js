import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { createRoom, subscribeRoom, acceptJoin } from '../services/rooms';

export default function CreateRoomScreen({ route, navigation }) {
  const { identity } = route.params || {};
  const [roomId, setRoomId] = useState(null);
  const [room, setRoom] = useState(null);
  console.log(identity.userId);

  useEffect(() => {
    (async () => {
      const { roomId: id } = await createRoom({ username: identity.username, userId: identity.userId });
      setRoomId(id);
      const unsub = subscribeRoom(id, setRoom);
      return () => unsub && unsub();
    })();
  }, []);

  useEffect(() => {
    if (room && room.status === 'requested') {
      // Auto-accept for simplicity; could add manual accept screen instead
      acceptJoin(room.roomId);
      navigation.replace('Chat', { roomId: room.roomId, me: identity, other: room.invitee });
    }
  }, [room]);

  if (!roomId) return null;

  const payload = JSON.stringify({ type: 'joinRoom', roomId, inviter: identity });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Show this QR to your friend</Text>
      <QRCode value={payload} size={220} />
      <Text style={styles.code}>Room: {roomId}</Text>
      <Text>Waiting for join request...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  title: { fontSize: 18, marginBottom: 12 },
  code: { marginTop: 12, color: '#555' },
});


