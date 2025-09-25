const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCuM8UIRP1vxvu5F2aEoG9GaPtWJ80xKi4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ove-foods.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ove-foods",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ove-foods.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "402049052326",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:402049052326:web:81934fb0b78e522e7b0e67",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-PWYG73C90T"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function updateOliveOilText() {
  try {
    console.log('Updating olive oil category text in Firebase...');
    
    // Update the category document directly by ID
    const categoryRef = doc(db, 'categories', 'olive-oils');
    
    await updateDoc(categoryRef, {
      name: 'Olive Oil',
      description: 'Premium extra virgin and classic olive oil crafted from the finest Mediterranean olives',
      updatedAt: new Date().toISOString()
    });
    
    console.log('✅ Successfully updated category name from "Olive Oils" to "Olive Oil"');
    console.log('✅ Updated description to use singular "olive oil"');
    
  } catch (error) {
    console.error('❌ Error updating category:', error);
  }
}

updateOliveOilText();