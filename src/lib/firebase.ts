// src/lib/firebase.ts

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJlgdsnKGMIjqGbWJO7BIjTLsx0e21RJg",
  authDomain: "journal-app-69e64.firebaseapp.com",
  projectId: "journal-app-69e64",
  storageBucket: "journal-app-69e64.firebasestorage.app",
  messagingSenderId: "781900380516",
  appId: "1:781900380516:web:8eedc1493a08d6ace9e271",
  measurementId: "G-R81PQJJKSP",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Analytics only in the browser
if (typeof window !== 'undefined') {
  getAnalytics(app);
}

// Initialize and export services
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const signOutUser = () => signOut(auth);
export const googleProvider = new GoogleAuthProvider();
