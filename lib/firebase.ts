import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, 
        //@ts-ignore
        getReactNativePersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB81bUA-k1Y9ZIkiI90kvWLEU6bZcrfA0c",
  authDomain: "class-connect-c97a6.firebaseapp.com",
  projectId: "class-connect-c97a6",
  storageBucket: "class-connect-c97a6.firebasestorage.app",
  messagingSenderId: "885394117047",
  appId: "1:885394117047:web:e3ce9b389abf257bb59832"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth with React Native persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export default app;