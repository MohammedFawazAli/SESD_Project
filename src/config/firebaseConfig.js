import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
// Note: storageBucket is optional - only needed if you use Firebase Storage for file uploads
// For real-time updates (technicians and bookings), you only need Firestore (projectId, apiKey, etc.)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB8vPBL3lO4zwWE-Z95Q-dffY9Dvykm2jo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "homeease-f7443.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "homeease-f7443",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "homeease-f7443.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "284216468156",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:284216468156:web:0a83b6ffbe20bd4724a6b9",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-YB7NRN178F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Enable offline persistence
try {
  enableIndexedDbPersistence(db);
} catch (err) {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support persistence.');
  }
}

export default app;
