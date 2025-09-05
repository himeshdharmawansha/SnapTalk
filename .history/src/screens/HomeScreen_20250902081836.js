import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { subscribeInviterActiveRoom } from '../services/rooms';

export default function HomeScreen({ navigation, identity }) {
  const [activeRooms, setActiveRooms] = useState([]);

  useEffect(() => {
    if (!identity?.userId) return;

    const unsubscribe = subscribeInviterActiveRoom(identity.userId, (roomData) => {
      if (roomData) {
        setActiveRooms((prev) => {
          const roomExists = prev.some((r) => r.roomId === roomData.roomId);
          return roomExists ? prev : [...prev, roomData];
        });
      } else {
        setActiveRooms([]); // Clear if no active room
      }
    });

    return () => unsubscribe && unsubscribe();
  }, [identity?.userId]);

  const renderChatItem = ({ item }) => (
    <Pressable
      style={styles.chatItem}
      onPress={() => navigation.navigate('Chat', { roomId: item.roomId, me: identity, other: item.other })}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{(item.other?.username || 'U').slice(0, 1).toUpperCase()}</Text>
      </View>
      <Text style={styles.chatName}>{item.other?.username || 'Unknown'}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={activeRooms}
        keyExtractor={(item) => item.roomId}
        renderItem={renderChatItem}
        ListHeaderComponent={<Text style={styles.header}>Your Chats</Text>}
        contentContainerStyle={{ padding: 24, paddingBottom: 80 }} // Extra padding for bottom actions
      />
      <View style={styles.bottomActions}>
        <Pressable
          style={styles.bottomIcon}
          onPress={() => navigation.navigate('CreateRoom', { identity })}
        >
          <Icon name="qrcode-scan" size={30} color="#6366F1" />
        </Pressable>
        <Pressable
          style={styles.bottomIcon}
          onPress={() => navigation.navigate('ScanJoin', { identity })}
        >
          <Icon name="qrcode" size={30} color="#6366F1" />
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
  container: { flex: 1, backgroundColor: '#0B1220' },
  header: { color: '#F3F4F6', fontSize: 22, fontWeight: '700', paddingBottom: 12 },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { color: '#E5E7EB', fontSize: 16, fontWeight: '700' },
  chatName: { color: '#F3F4F6', fontSize: 16, fontWeight: '600' },
  bottomActions: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    paddingBottom: 10,
  },
  bottomIcon: {
    backgroundColor: '#111827',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
});