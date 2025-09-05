import { v4 as uuidv4 } from 'uuid';
import { db } from './firebase';
import { doc, setDoc, updateDoc, getDoc, onSnapshot, collection, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

export async function createRoom(userA, userB) {
  // Sort IDs so order doesn't matter (A+B = B+A)
  const ids = [userA.userId, userB.userId].sort();
  const roomId = ids.join("_"); // e.g. "user1_user2"

  const ref = doc(db, "rooms", roomId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      roomId,
      users: ids,
      status: "active",
      createdAt: serverTimestamp(),
    });
  }

  return { roomId };
}


export async function requestJoin(roomId, invitee) {
  const ref = doc(db, 'rooms', roomId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Room not found');
  if (snap.data().status !== 'pending') throw new Error('Room not available');
  await updateDoc(ref, { invitee, status: 'requested' });
}

export function subscribeRoom(roomId, cb) {
  const ref = doc(db, 'rooms', roomId);
  return onSnapshot(ref, (docSnap) => cb(docSnap.exists() ? docSnap.data() : null));
}

export async function acceptJoin(roomId) {
  const ref = doc(db, 'rooms', roomId);
  await updateDoc(ref, { status: 'active' });
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



