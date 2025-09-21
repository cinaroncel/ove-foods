const { initializeApp } = require('firebase/app');
const { getFirestore, listCollections } = require('firebase/firestore');

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

async function debugCollections() {
  try {
    console.log('🔍 Checking all collections in Firestore...\n');
    
    // List all collections at the root level
    const collections = await listCollections(db);
    
    if (collections.length === 0) {
      console.log('📁 No collections found in Firestore.');
      return;
    }
    
    console.log(`📊 Found ${collections.length} collections in Firestore:\n`);
    
    collections.forEach((collectionRef) => {
      console.log(`📂 Collection: ${collectionRef.id}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking collections:', error);
    console.log('\n🔧 Trying alternative method...');
    
    // Alternative: Check known collection names
    const knownCollections = ['categories', 'products', 'recipes', 'locations', 'settings', 'config', 'hero'];
    
    for (const collectionName of knownCollections) {
      try {
        const { collection, getDocs } = require('firebase/firestore');
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);
        
        if (!snapshot.empty) {
          console.log(`📂 Collection "${collectionName}" exists with ${snapshot.size} documents`);
        }
      } catch (err) {
        // Collection doesn't exist or no permission
      }
    }
  }
}

debugCollections();