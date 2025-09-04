import { db } from './firebase';
import {
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';

// Generate a stable roomId for 1-to-1 chat
function generateRoomId(userA, userB) {
  return [userA, userB].sort().join('_');
}

// Create or return existing room
export async function getOrCreateRoom({ inviter, joiner }) {
  try {
    const roomId = generateRoomId(inviter.userId, joiner.userId);
    const roomRef = doc(db, 'rooms', roomId);

    const docSnap = await getDoc(roomRef);

    if (!docSnap.exists()) {
      await setDoc(roomRef, {
        roomId,
        users: [inviter, joiner],
        createdAt: serverTimestamp(),
      });
    }

    return { roomId };
  } catch (error) {
    console.error('Error creating/getting room:', error);
    throw error;
  }
}

// Send message inside a room
export async function sendMessage(roomId, message) {
  const msgs = collection(db, 'rooms', roomId, 'messages');
  await addDoc(msgs, {
    ...message,
    createdAt: serverTimestamp(),
  });
}

// Subscribe to messages in a room
export function subscribeMessages(roomId, cb) {
  const msgs = collection(db, 'rooms', roomId, 'messages');
  const q = query(msgs, orderBy('createdAt', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    cb(list);
  });
}

