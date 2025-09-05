import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function HomeScreen({ navigation, identity }) {
  const [activeRooms, setActiveRooms] = useState([]);

  useEffect(() => {
    if (!identity?.userId) return;

    const roomsRef = collection(db, 'rooms');
    const q = query(roomsRef, where('users', 'array-contains', identity));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rooms = snapshot.docs.map((doc) => ({
        roomId: doc.id,
        ...doc.data(),
        other: doc.data().users.find((user) => user.userId !== identity.userId),
      }));
      setActiveRooms(rooms);
    });

    return () => unsubscribe && unsubscribe();
  }, [identity]);

  const renderChatItem = ({ item }) => (
    <Pressable
      style={({ pressed }) => [styles.chatItem, pressed && styles.chatItemPressed]}
      onPress={() => navigation.navigate('Chat', { roomId: item.roomId, me: identity, other: item.other })}
      android_ripple={{ color: 'rgba(99, 102, 241, 0.1)' }}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{(item.other?.username || 'U').slice(0, 1).toUpperCase()}</Text>
      </View>
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{item.other?.username || 'Unknown'}</Text>
        <Text style={styles.chatStatus}>Tap to continue chat</Text>
      </View>
      <Icon name="chevron-right" size={20} color="#9CA3AF" />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={activeRooms}
        keyExtractor={(item) => item.roomId}
        renderItem={renderChatItem}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Your Chats</Text>
            <Text style={styles.headerSubtext}>Connect with your friends instantly</Text>
          </View>
        }
        contentContainerStyle={{ padding: 24, paddingBottom: 80 }}
      />
      <View style={styles.bottomActions}>
        <Pressable
          style={styles.bottomIcon}
          onPress={() => navigation.navigate('CreateRoom', { identity })}
        >
          <Icon name="qrcode-scan" size={28} color="#FFFFFF" />
        </Pressable>
        <Pressable
          style={styles.bottomIcon}
          onPress={() => navigation.navigate('ScanJoin', { identity })}
        >
          <Icon name="magnify" size={28} color="#FFFFFF" />
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
  
  headerContainer: {
    marginBottom: 20,
  },
  
  header: { 
    color: '#F3F4F6', 
    fontSize: 28, 
    fontWeight: '800', 
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  
  headerSubtext: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '400',
  },
  
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#111827',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  
  chatItemPressed: {
    backgroundColor: '#1F2937',
    transform: [{ scale: 0.98 }],
  },
  
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#6366F1',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  
  avatarText: { 
    color: '#FFFFFF', 
    fontSize: 18, 
    fontWeight: '700' 
  },
  
  chatInfo: {
    flex: 1,
  },
  
  chatName: { 
    color: '#F3F4F6', 
    fontSize: 18, 
    fontWeight: '600',
    marginBottom: 2,
  },
  
  chatStatus: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '400',
  },
  
  bottomActions: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    paddingBottom: 10,
  },
  
  bottomIcon: {
    backgroundColor: '#6366F1',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
});
