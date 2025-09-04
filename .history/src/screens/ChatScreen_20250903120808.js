import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sendMessage, subscribeMessages } from '../services/rooms';
import { db } from '../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';

export default function ChatScreen({ route, navigation }) {
  const { roomId, me, other } = route.params || {};
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState(null);
  const [locked, setLocked] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showLockedModal, setShowLockedModal] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    const fetchRoom = async () => {
      const snap = await getDoc(doc(db, 'rooms', roomId));
      if (snap.exists()) {
        const roomData = snap.data();
        setRoom(roomData);
        checkRoomStatus(roomData);
      }
    };
    fetchRoom();
  }, [roomId]);

  const checkRoomStatus = (roomData) => {
    if (!roomData?.createdAt) return;

    const createdAt = roomData.createdAt.toDate
      ? roomData.createdAt.toDate()
      : new Date(roomData.createdAt);
    const now = new Date();
    const diffHrs = (now - createdAt) / (1000 * 60 * 60);

    const user0 = roomData.users[0];
    const user1 = roomData.users[1];

    if (diffHrs >= 24 && roomData.isExtended === 0) {
      if (me.userId === user0.userId) {
        setShowExtendModal(true);
      } else if (me.userId === user1.userId) {
        setShowLockedModal(true);
        setLocked(true);
      }
    }
  };

  useEffect(() => {
    if (!roomId) return;
    const unsub = subscribeMessages(roomId, async (list) => {
      const latest = list[list.length - 1];
      const isIncoming = latest && latest.sender?.userId !== me.userId;
      setMessages(list);
      if (isIncoming) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: other?.username || 'New message',
            body: latest.text || '',
          },
          trigger: null,
        });
      }
    });
    return () => unsub && unsub();
  }, [roomId]);

  const onSend = async () => {
    if (!text.trim() || locked) return;
    await sendMessage(roomId, { text: text.trim(), sender: me });
    setText('');
    setTimeout(() => listRef.current?.scrollToEnd?.({ animated: true }), 50);
  };

  const handleExtendChat = async () => {
    await updateDoc(doc(db, 'rooms', roomId), { isExtended: 1 });
    setRoom({ ...room, isExtended: 1 });
    setLocked(false);
    setShowExtendModal(false);
  };

  const handleDeclineExtend = () => {
    setLocked(true);
    setShowExtendModal(false);
  };

  const handleLockedModalClose = () => {
    setShowLockedModal(false);
    navigation.goBack();
  };

  const renderItem = ({ item }) => {
    const mine = item.sender?.userId === me.userId;
    return (
      <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
        {!mine && <Text style={styles.sender}>{item.sender?.username}</Text>}
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B1220' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <View style={styles.container}>
          <Text style={styles.header}>Chat with {other?.username}</Text>
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(it) => it.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 12 }}
            onContentSizeChange={() =>
              listRef.current?.scrollToEnd?.({ animated: false })
            }
          />
          <View style={styles.inputRow}>
            <TextInput
              style={[
                styles.input,
                locked && { backgroundColor: '#1F2937', color: '#6B7280' },
              ]}
              value={text}
              onChangeText={setText}
              placeholder={locked ? 'Chat locked' : 'Type a message'}
              placeholderTextColor="#9CA3AF"
              editable={!locked}
              returnKeyType="send"
              onSubmitEditing={onSend}
            />
            <Pressable
              style={[
                styles.sendBtn,
                locked && { backgroundColor: '#374151' },
              ]}
              android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
              onPress={onSend}
              disabled={locked}
              accessibilityRole="button"
              accessibilityLabel={locked ? 'Locked' : 'Send message'}
            >
              <Text style={styles.sendText}>
                {locked ? 'Locked' : 'Send'}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Extend Chat Modal */}
      <Modal
        visible={showExtendModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowExtendModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIcon}>
              <Text style={styles.modalIconText}>⏰</Text>
            </View>
            <Text style={styles.modalTitle}>Extend Chat?</Text>
            <Text style={styles.modalSubtitle}>
              This chat expired after 24 hours. Do you want to extend it?
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalBtn, styles.modalBtnSecondary]}
                onPress={handleDeclineExtend}
                android_ripple={{ color: 'rgba(255,255,255,0.08)' }}
                accessibilityRole="button"
                accessibilityLabel="Do not extend"
              >
                <Text style={styles.modalBtnTextSecondary}>No, Lock It</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, styles.modalBtnPrimary]}
                onPress={handleExtendChat}
                android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
                accessibilityRole="button"
                accessibilityLabel="Yes, extend chat"
              >
                <Text style={styles.modalBtnTextPrimary}>Yes, Extend</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Chat Locked Modal (User1) */}
      <Modal
        visible={showLockedModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleLockedModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={[styles.modalIcon, { backgroundColor: '#1E293B' }]}>
              <Text style={styles.modalIconText}>🔒</Text>
            </View>
            <Text style={styles.modalTitle}>Chat Locked</Text>
            <Text style={styles.modalSubtitle}>
              You can't continue this chat until {room?.users?.[0]?.username} extends it.
            </Text>
            <Pressable
              style={[styles.modalBtn, styles.modalBtnPrimary, { width: '50%' }]}
              onPress={handleLockedModalClose}
              android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Text style={styles.modalBtnTextPrimary}>Go Back</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const CARD_BG = '#111827';
const ACCENT = '#6366F1';
const BUBBLE_MINE = ACCENT;
const BUBBLE_THEIRS = '#0F172A';
const BORDER = '#1F2937';
const TEXT_PRIMARY = '#F3F4F6';
const TEXT_SECONDARY = '#9CA3AF';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1220' },
  header: {
    textAlign: 'center',
    paddingVertical: 10,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    backgroundColor: CARD_BG,
    borderBottomWidth: 1,
    borderColor: BORDER,
  },
  inputRow: {
    flexDirection: 'row',
    padding: 10,
    gap: 8,
    borderTopWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD_BG,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: TEXT_PRIMARY,
    backgroundColor: '#0F172A',
  },
  sendBtn: {
    backgroundColor: ACCENT,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    minWidth: 72,
  },
  sendText: { color: '#FFFFFF', fontWeight: '700' },
  pressed: { opacity: 0.92, transform: [{ scale: 0.995 }] },
  bubble: { maxWidth: '82%', padding: 12, borderRadius: 14, marginBottom: 10 },
  mine: {
    backgroundColor: BUBBLE_MINE,
    alignSelf: 'flex-end',
    shadowColor: ACCENT,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  theirs: {
    backgroundColor: BUBBLE_THEIRS,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: BORDER,
  },
  sender: { fontSize: 10, color: TEXT_SECONDARY, marginBottom: 4 },
  messageText: { color: '#FFFFFF' },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalIconText: { fontSize: 28, color: '#E5E7EB' },
  modalTitle: {
    color: TEXT_PRIMARY,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    color: TEXT_SECONDARY,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnPrimary: {
    backgroundColor: ACCENT,
    shadowColor: ACCENT,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  modalBtnSecondary: {
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  modalBtnTextPrimary: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.2,
  },
  modalBtnTextSecondary: {
    color: '#E5E7EB',
    fontWeight: '600',
    fontSize: 14,
  },
});