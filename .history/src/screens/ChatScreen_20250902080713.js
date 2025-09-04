import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TextInput, 
  Pressable, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sendMessage, subscribeMessages } from '../services/rooms';
import * as Notifications from 'expo-notifications';

export default function ChatScreen({ route }) {
  const { roomId, me, other } = route.params || {};
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const listRef = useRef(null);

  useEffect(() => {
    const unsub = subscribeMessages(roomId, async (list) => {
      const latest = list[list.length - 1];
      const isIncoming = latest && latest.sender?.userId !== me.userId;
      setMessages(list);
      if (isIncoming) {
        await Notifications.scheduleNotificationAsync({
          content: { title: other?.username || 'New message', body: latest.text || '' },
          trigger: null,
        });
      }
    });
    return () => unsub && unsub();
  }, [roomId]);

  const onSend = async () => {
    if (!text.trim()) return;
    await sendMessage(roomId, { text: text.trim(), sender: me });
    setText('');
    setTimeout(() => listRef.current?.scrollToEnd?.({ animated: true }), 50);
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
        behavior={Platform.OS === "ios" ? "padding" : "height"} // important
        keyboardVerticalOffset={80} // tweak if input still hides under nav bar
      >
        <View style={styles.container}>
          <Text style={styles.header}>Chat with {other?.username}</Text>
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(it) => it.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 12 }}
            onContentSizeChange={() => listRef.current?.scrollToEnd?.({ animated: false })}
          />
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder="Type a message"
              placeholderTextColor="#9CA3AF"
              returnKeyType="send"
              onSubmitEditing={onSend}
            />
            <Pressable
              style={({ pressed }) => [styles.sendBtn, pressed && styles.pressed]}
              android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
              onPress={onSend}
            >
              <Text style={styles.sendText}>Send</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  header: { textAlign: 'center', paddingVertical: 10, fontWeight: '700', color: TEXT_PRIMARY, backgroundColor: CARD_BG, borderBottomWidth: 1, borderColor: BORDER },
  inputRow: { flexDirection: 'row', padding: 10, gap: 8, borderTopWidth: 1, borderColor: BORDER, backgroundColor: CARD_BG },
  input: { flex: 1, borderWidth: 1, borderColor: BORDER, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, color: TEXT_PRIMARY, backgroundColor: '#0F172A' },
  sendBtn: { backgroundColor: ACCENT, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, alignItems: 'center', justifyContent: 'center', elevation: 4 },
  sendText: { color: '#FFFFFF', fontWeight: '700' },
  pressed: { opacity: 0.92, transform: [{ scale: 0.995 }] },
  bubble: { maxWidth: '82%', padding: 12, borderRadius: 14, marginBottom: 10 },
  mine: { backgroundColor: BUBBLE_MINE, alignSelf: 'flex-end', shadowColor: ACCENT, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  theirs: { backgroundColor: BUBBLE_THEIRS, alignSelf: 'flex-start', borderWidth: 1, borderColor: BORDER },
  sender: { fontSize: 10, color: TEXT_SECONDARY, marginBottom: 4 },
  messageText: { color: '#FFFFFF' },
});