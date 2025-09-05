import { v4 as uuidv4 } from 'uuid';
import { db } from './firebase';
import { doc, setDoc, updateDoc, getDoc, onSnapshot, collection, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

let rooms = {}; // simple in-memory store (replace with DB in prod)

export async function createRoom(user) {
  const roomId = Math.random().toString(36).substring(2, 9); // random id

  rooms[roomId] = {
    roomId,
    inviter: user,   // userA
    invitee: null,   // userB (not yet joined)
    status: 'waiting'
  };

  return { roomId };
}

export function subscribeRoom(roomId, callback) {
  // Simulated subscription: poll/interval or socket in real life
  const interval = setInterval(() => {
    if (rooms[roomId]) {
      callback(rooms[roomId]);
    }
  }, 1000);

  return () => clearInterval(interval);
}

export function requestJoin(roomId, userB) {
  if (rooms[roomId]) {
    rooms[roomId].invitee = userB;
    rooms[roomId].status = 'requested';
  }
}

export function acceptJoin(roomId) {
  if (rooms[roomId]) {
    rooms[roomId].status = 'active';
  }
}

export async function sendMessage(roomId, message) {
  const msgs = collection(db, 'rooms', roomId, 'messages');
  await addDoc(msgs, {
    ...message,
    createdAt: serverTimestamp(),
  });
}

export function subscribeMessages(roomId, cb) {
  const msgs = collection(db, 'rooms', roomId, 'messages');
  const q = query(msgs, orderBy('createdAt', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    console.log('Fetched messages:', list);
    cb(list);
  });
}



