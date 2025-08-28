import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation, identity }) {
  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{(identity?.username || 'U').slice(0, 1).toUpperCase()}</Text>
        </View>
        <View style={styles.headerTextWrap}>
          <Text style={styles.overline}>Welcome back</Text>
          <Text style={styles.title}>Hello, {identity.username}</Text>
          <Text style={styles.subtitle}>What would you like to do today?</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.actionBtn, styles.primaryBtn, pressed && styles.pressed]}
          android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
          onPress={() => navigation.navigate('CreateRoom', { identity })}
        >
          <Text style={styles.actionEmoji}>📷</Text>
          <View style={styles.actionTextWrap}>
            <Text style={styles.actionTitle}>Create Room</Text>
            <Text style={styles.actionSubtitle}>Show QR to share</Text>
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.actionBtn, styles.secondaryBtn, pressed && styles.pressed]}
          android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
          onPress={() => navigation.navigate('ScanJoin', { identity })}
        >
          <Text style={styles.actionEmoji}>🔍</Text>
          <View style={styles.actionTextWrap}>
            <Text style={styles.actionTitleAlt}>Scan & Join</Text>
            <Text style={styles.actionSubtitleAlt}>Join using QR code</Text>
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.actionBtn, styles.secondaryBtn, pressed && styles.pressed]}
          android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
          onPress={() => navigation.navigate('PendingRequests', { identity })}
        >
          <Text style={styles.actionEmoji}>⏳</Text>
          <View style={styles.actionTextWrap}>
            <Text style={styles.actionTitleAlt}>Pending Requests</Text>
            <Text style={styles.actionSubtitleAlt}>Review and approve</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const CARD_BG = '#111827';
const ACCENT = '#6366F1';
const ACCENT_DARK = '#4F46E5';
const SURFACE = '#FFFFFF';
const TEXT_PRIMARY = '#0F172A';
const TEXT_SECONDARY = '#475569';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#0B1220' },

  headerCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: { color: '#E5E7EB', fontSize: 22, fontWeight: '700' },
  headerTextWrap: { flex: 1 },
  overline: { color: '#A5B4FC', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  title: { color: '#F3F4F6', fontSize: 22, fontWeight: '700' },
  subtitle: { color: '#9CA3AF', marginTop: 6, fontSize: 14 },

  actions: { gap: 14 },

  actionBtn: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  primaryBtn: {
    backgroundColor: ACCENT,
    shadowColor: ACCENT,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  secondaryBtn: {
    backgroundColor: SURFACE,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  pressed: { opacity: 0.92, transform: [{ scale: 0.995 }] },

  actionEmoji: { fontSize: 24, marginRight: 12 },
  actionTextWrap: { flex: 1 },
  actionTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  actionSubtitle: { color: 'rgba(255,255,255,0.85)', marginTop: 2, fontSize: 13 },
  actionTitleAlt: { color: TEXT_PRIMARY, fontSize: 16, fontWeight: '700' },
  actionSubtitleAlt: { color: TEXT_SECONDARY, marginTop: 2, fontSize: 13 },
});

