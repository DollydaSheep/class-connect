import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB81bUA-k1Y9ZIkiI90kvWLEU6bZcrfA0c",
  authDomain: "class-connect-c97a6.firebaseapp.com",
  projectId: "class-connect-c97a6",
  storageBucket: "class-connect-c97a6.firebasestorage.app",
  messagingSenderId: "885394117047",
  appId: "1:885394117047:web:e3ce9b389abf257bb59832"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;