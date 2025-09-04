import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Placeholder: in this simplified flow, join is auto-accepted on the creator side
export default function PendingRequestsScreen() {
  return (
    <View style={styles.container}>
      <Text>No manual pending requests in this simplified build.</Text>
      <Text>Creator auto-accepts when someone scans.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
});



