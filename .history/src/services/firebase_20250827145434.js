import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Fill with your own Firebase config (see README.firebase.md)
const firebaseConfig = {
  apiKey: "AIzaSyBjeiZZDX_NaEeRgVIw7b30FYAlGC8jQlg",
  authDomain: "chatapp-fc307.firebaseapp.com",
  projectId: "chatapp-fc307",
  storageBucket: "chatapp-fc307.appspot.com",
  messagingSenderId: "932567252654",
  appId: "1:932567252654:web:7bce70e90ba2ed917bb73f",
  measurementId: "G-4Q97F7ZS2Q"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);


