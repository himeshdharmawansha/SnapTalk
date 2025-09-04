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
