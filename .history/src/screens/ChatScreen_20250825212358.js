import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
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
        <Text>{item.text}</Text>
      </View>
    );
  };

  return (
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
        <TextInput style={styles.input} value={text} onChangeText={setText} placeholder="Type a message" />
        <Button title="Send" onPress={onSend} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { textAlign: 'center', paddingVertical: 8, fontWeight: '600' },
  inputRow: { flexDirection: 'row', padding: 8, gap: 8, borderTopWidth: 1, borderColor: '#eee' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 },
  bubble: { maxWidth: '80%', padding: 10, borderRadius: 12, marginBottom: 8 },
  mine: { backgroundColor: '#DCF8C6', alignSelf: 'flex-end' },
  theirs: { backgroundColor: '#eee', alignSelf: 'flex-start' },
  sender: { fontSize: 10, color: '#555', marginBottom: 2 },
});


