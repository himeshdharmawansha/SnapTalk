// screens/ScanJoinScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { getOrCreateRoom } from '../services/rooms';

export default function ScanJoinScreen({ route, navigation }) {
  const { identity } = route.params || {}; // joiner’s identity
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned) return;
    setScanned(true);

    try {
      const payload = JSON.parse(data);
      if (payload?.type !== 'joinRoom' || !payload?.inviter) {
        throw new Error('Invalid QR');
      }

      const inviter = payload.inviter;
      const joiner = identity;

      const { roomId } = await getOrCreateRoom({ inviter, joiner });

      // Joiner navigates immediately
      navigation.replace('Chat', {
        roomId,
        me: joiner,
        other: inviter,
      });
    } catch (e) {
      Alert.alert('Scan failed', e?.message || 'Unknown error');
      setScanned(false);
    }
  };

  if (!permission) return <Text>Requesting camera permission...</Text>;
  if (!permission.granted) return <Text>No access to camera</Text>;

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      {!scanned ? (
        <Text style={styles.overlay}>Scan the QR code</Text>
      ) : (
        <Text style={styles.overlay}>Connecting...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
});


