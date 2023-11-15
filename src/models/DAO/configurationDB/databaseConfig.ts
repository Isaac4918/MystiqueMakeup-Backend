import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC92Wrrd2fh4IeMLHGowcKItnnbiDwAbL8",
  authDomain: "mystique-makeup.firebaseapp.com",
  projectId: "mystique-makeup",
  storageBucket: "mystique-makeup.appspot.com",
  messagingSenderId: "265097079408",
  appId: "1:265097079408:web:7c65b98ec0f3a49cc9a2b5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get database from Firebase
const db = getFirestore(app);

export { db};
