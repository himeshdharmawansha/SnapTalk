import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { db } from '../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function CreateRoomScreen({ route, navigation }) {
  const { identity } = route.params || {};

  // QR payload contains inviter info
  const payload = JSON.stringify({
    type: 'joinRoom',
    inviter: identity,
  });

  useEffect(() => {
    // Listen for pointer update (when joiner creates the room)
    const pointerRef = doc(db, 'users', identity.userId, 'activeRoom', 'current');
    const unsubscribe = onSnapshot(pointerRef, (snap) => {
      if (snap.exists()) {
        const { roomId, other } = snap.data();
        navigation.replace('Chat', {
          roomId,
          me: identity,
          other,
        });
      }
    });

    return () => unsubscribe();
  }, []);

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
