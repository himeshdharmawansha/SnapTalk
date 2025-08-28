import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { saveUsername } from '../services/identity';

export default function OnboardingScreen({ onDone }) {
  const [name, setName] = useState('');

  const onSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Username required', 'Please enter a username');
      return;
    }
    const identity = await saveUsername(name.trim());
    onDone(identity);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Instant Chat</Text>
      <Text style={styles.subtitle}>Enter a username to get started</Text>
      <TextInput
        placeholder="Your username"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <Button title="Continue" onPress={onSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#555', marginBottom: 24 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
});


