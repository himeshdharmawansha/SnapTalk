import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
      <View style={styles.logoContainer}>
        <View style={styles.logoIcon}>
          <Icon name="chat" size={40} color="#6366F1" />
        </View>
        <Text style={styles.logoText}>SnapTalk</Text>
        <Text style={styles.logoSubtext}>Connect instantly, chat freely</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to SnapTalk</Text>
        <Text style={styles.subtitle}>Enter your username to start connecting with friends</Text>

        <View style={styles.inputWrap}>
          <Icon name="account" size={20} color="#9CA3AF" style={styles.inputIcon} />
          <TextInput
            placeholder="Your username"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={onSubmit}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <Pressable
          style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
          android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
          onPress={onSubmit}
        >
          <Icon name="arrow-right" size={20} color="#FFFFFF" style={styles.btnIcon} />
          <Text style={styles.primaryBtnText}>Get Started</Text>
        </Pressable>
      </View>
    </View>
  );
}

const CARD_BG = '#111827';
const ACCENT = '#6366F1';

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 24, 
    backgroundColor: '#0B1220', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },

  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#6366F1',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  logoText: {
    color: '#F3F4F6',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },

  logoSubtext: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
  },

  card: {
    width: '100%',
    backgroundColor: CARD_BG,
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
  },

  title: { 
    color: '#F3F4F6', 
    fontSize: 26, 
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: { 
    color: '#9CA3AF', 
    marginBottom: 28, 
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },

  inputWrap: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  inputIcon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    color: '#E5E7EB',
    paddingVertical: 16,
    fontSize: 16,
  },

  primaryBtn: {
    backgroundColor: ACCENT,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ACCENT,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  btnIcon: {
    marginRight: 8,
  },

  primaryBtnText: { 
    color: '#FFFFFF', 
    fontSize: 18, 
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  pressed: { 
    opacity: 0.9, 
    transform: [{ scale: 0.98 }] 
  },
});


