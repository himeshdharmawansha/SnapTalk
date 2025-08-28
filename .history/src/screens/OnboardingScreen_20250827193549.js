import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
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
      <View style={styles.card}>
        <Text style={styles.overline}>Instant Chat</Text>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Enter a username to get started</Text>

        <View style={styles.inputWrap}>
          <TextInput
            placeholder="Your username"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={onSubmit}
          />
        </View>

        <Pressable
          style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
          android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
          onPress={onSubmit}
        >
          <Text style={styles.primaryBtnText}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}

const CARD_BG = '#111827';
const ACCENT = '#6366F1';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#0B1220', alignItems: 'center', justifyContent: 'center' },

  card: {
    width: '100%',
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  overline: { color: '#A5B4FC', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  title: { color: '#F3F4F6', fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#9CA3AF', marginTop: 6, marginBottom: 20, fontSize: 14 },

  inputWrap: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 16,
    overflow: 'hidden',
  },
  input: {
    color: '#E5E7EB',
    padding: 14,
    fontSize: 16,
  },

  primaryBtn: {
    marginTop: 4,
    backgroundColor: ACCENT,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ACCENT,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  pressed: { opacity: 0.92, transform: [{ scale: 0.995 }] },
});

