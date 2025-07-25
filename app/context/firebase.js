import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyBCS7sSwo2iuHdHTAnXg2levHjYGg4O6cI',
  authDomain: 'todolist-7055d.firebaseapp.com',
  projectId: 'todolist-7055d',
  storageBucket: 'todolist-7055d.appspot.com',
  messagingSenderId: '253096276680',
  appId: '1:253096276680:web:74bcdd2783b36b09e8abfd',
  measurementId: 'G-L18LRS1WBR',
};

// Initialize
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, GoogleAuthProvider, signInWithCredential };
