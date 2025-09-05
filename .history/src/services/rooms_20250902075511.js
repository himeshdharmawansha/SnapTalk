import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Get or create a room between inviter and joiner.
 * RoomId = sorted userIds joined by "_"
 */
export async function getOrCreateRoom({ inviter, joiner }) {
  const roomId = [inviter.userId, joiner.userId].sort().join('_');
  const roomRef = doc(db, 'rooms', roomId);

  const roomSnap = await getDoc(roomRef);
  if (!roomSnap.exists()) {
    await setDoc(roomRef, {
      roomId,
      users: [inviter, joiner],
      createdAt: new Date(),
    });
  }

  // Write a pointer so inviter’s app knows when someone joined
  const inviterRoomRef = doc(db, 'users', inviter.userId, 'activeRoom', 'current');
  await setDoc(inviterRoomRef, {
    roomId,
    other: joiner,
  });

  return { roomId };
}
