import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'instantchat.identity';

export async function loadOrCreateIdentity() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    return { username: null, userId: null };
  } catch (e) {
    return { username: null, userId: null };
  }
}

export async function saveUsername(username) {
  const identity = { username, userId: uuidv4() };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(identity));
  return identity;
}



