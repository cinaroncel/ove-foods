// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Check if we're in a Vercel build environment
const isVercelBuild = process.env.VERCEL === '1' && process.env.NODE_ENV === 'production';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCuM8UIRP1vxvu5F2aEoG9GaPtWJ80xKi4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ove-foods.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ove-foods",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ove-foods.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "402049052326",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:402049052326:web:81934fb0b78e522e7b0e67",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-PWYG73C90T"
};

// Initialize Firebase only if not in Vercel build environment
const app = isVercelBuild ? null : initializeApp(firebaseConfig);

// Initialize Firebase services only if app is available
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
export const auth = app ? getAuth(app) : null;

// Initialize Analytics (only on client side)
let analytics: any = null;
if (typeof window !== 'undefined' && app) {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;