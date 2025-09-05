import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getUserRooms } from '../services/rooms'; // you’ll need this service

export default function HomeScreen({ navigation, identity }) {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getUserRooms(identity.id);
        setRooms(data || []);
      } catch (err) {
        console.error('Failed to load rooms:', err);
      }
    };

    fetchRooms();
  }, [identity]);

  const renderRoom = ({ item }) => {
    const otherUser =
      item.inviter.id === identity.id ? item.joiner : item.inviter;

    return (
      <Pressable
        style={({ pressed }) => [styles.roomCard, pressed && styles.pressed]}
        onPress={() =>
          navigation.navigate('Chat', {
            roomId: item.id,
            me: identity,
            other: otherUser,
          })
        }
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(otherUser?.username || 'U').slice(0, 1).toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.roomName}>{otherUser?.username}</Text>
          <Text style={styles.roomSub}>Tap to open chat</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(identity?.username || 'U').slice(0, 1).toUpperCase()}
          </Text>
        </View>
        <View style={styles.headerTextWrap}>
          <Text style={styles.overline}>Welcome back</Text>
          <Text style={styles.title}>Hello, {identity.username}</Text>
          <Text style={styles.subtitle}>Make your instant chat</Text>
        </View>
      </View>

      {/* Rooms List */}
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={renderRoom}
        ListEmptyComponent={
          <Text style={styles.empty}>No chats yet. Start one below!</Text>
        }
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {/* Actions at bottom */}
      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.actionBtn,
            styles.primaryBtn,
            pressed && styles.pressed,
          ]}
          android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
          onPress={() => navigation.navigate('CreateRoom', { identity })}
        >
          <Icon name="qrcode" size={24} color="#000" style={{ marginRight: 12 }} />
          <View style={styles.actionTextWrap}>
            <Text style={styles.actionTitle}>Create Room</Text>
            <Text style={styles.actionSubtitle}>Show QR to share</Text>
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionBtn,
            styles.secondaryBtn,
            pressed && styles.pressed,
          ]}
          android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
          onPress={() => navigation.navigate('ScanJoin', { identity })}
        >
          <Icon name="qrcode-scan" size={24} color="#000" style={{ marginRight: 12 }} />
          <View style={styles.actionTextWrap}>
            <Text style={styles.actionTitleAlt}>Scan & Join</Text>
            <Text style={styles.actionSubtitleAlt}>Join using QR code</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const CARD_BG = '#111827';
const ACCENT = '#6366F1';
const SURFACE = '#FFFFFF';
const TEXT_PRIMARY = '#0F172A';
const TEXT_SECONDARY = '#475569';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#0B1220' },

  headerCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { color: '#E5E7EB', fontSize: 18, fontWeight: '700' },
  headerTextWrap: { flex: 1 },
  overline: { color: '#A5B4FC', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  title: { color: '#F3F4F6', fontSize: 20, fontWeight: '700' },
  subtitle: { color: '#9CA3AF', marginTop: 4, fontSize: 14 },

  roomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: SURFACE,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  roomName: { fontSize: 16, fontWeight: '600', color: TEXT_PRIMARY },
  roomSub: { fontSize: 13, color: TEXT_SECONDARY },

  empty: { color: '#9CA3AF', textAlign: 'center', marginTop: 20 },

  actions: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    gap: 12,
  },

  actionBtn: {
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  primaryBtn: {
    backgroundColor: ACCENT,
  },
  secondaryBtn: {
    backgroundColor: SURFACE,
  },
  pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },

  actionTextWrap: { flex: 1 },
  actionTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  actionSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 13 },
  actionTitleAlt: { color: TEXT_PRIMARY, fontSize: 15, fontWeight: '700' },
  actionSubtitleAlt: { color: TEXT_SECONDARY, fontSize: 13 },
});
