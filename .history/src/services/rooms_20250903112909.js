// services/rooms.js
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
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase';

// ---------- helpers ----------
export function generateRoomId(userA, userB) {
  return [userA, userB].sort().join('_');
}

// ---------- core: create/reuse room on scan ----------
/**
 * Ensures a 1:1 room between inviter & joiner exists.
 * Always (re)writes a pointer so inviter's app can auto-open chat.
 */
export async function getOrCreateRoom({ inviter, joiner }) {
  if (!inviter?.userId || !joiner?.userId) {
    throw new Error('inviter/joiner must include { userId, username }');
  }

  const roomId = generateRoomId(inviter.userId, joiner.userId);
  const roomRef = doc(db, 'rooms', roomId);

  const snap = await getDoc(roomRef);
  if (!snap.exists()) {
    await setDoc(roomRef, {
      roomId,
      isExtended: 0,
      users: [inviter, joiner], // store full user objects (username + id) for convenience
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessage: null,
    });
  } else {
    // touch updatedAt so client listeners can react if needed
    await setDoc(roomRef, { updatedAt: serverTimestamp() }, { merge: true });
  }

  // ✅ write pointer so the inviter moves into Chat
  const pointerRef = doc(db, 'users', inviter.userId, 'activeRoom', 'current');
  await setDoc(
    pointerRef,
    {
      roomId,
      other: joiner,
      at: serverTimestamp(),
    },
    { merge: true }
  );

  return { roomId };
}

// ---------- inviter-side pointer subscription ----------
export function subscribeInviterActiveRoom(userId, cb) {
  const ref = doc(db, 'users', userId, 'activeRoom', 'current');
  return onSnapshot(ref, (snap) => {
    cb(snap.exists() ? snap.data() : null);
  });
}

// Optional: clear pointer (e.g., after navigating to Chat)
export async function clearInviterActiveRoom(userId) {
  const ref = doc(db, 'users', userId, 'activeRoom', 'current');
  await deleteDoc(ref).catch(() => {});
}

// ---------- messaging ----------
export async function sendMessage(roomId, message) {
  const msgs = collection(db, 'rooms', roomId, 'messages');
  await addDoc(msgs, {
    ...message, // { text, sender: { userId, username }, ... }
    createdAt: serverTimestamp(),
  });

  // Update room metadata (lastMessage, updatedAt)
  const roomRef = doc(db, 'rooms', roomId);
  await setDoc(
    roomRef,
    {
      updatedAt: serverTimestamp(),
      lastMessage: {
        text: message.text ?? '',
        senderId: message?.sender?.userId ?? null,
        at: serverTimestamp(),
      },
    },
    { merge: true }
  );
}

export function subscribeMessages(roomId, cb) {
  const msgs = collection(db, 'rooms', roomId, 'messages');
  const q = query(msgs, orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    cb(list);
  });
}
