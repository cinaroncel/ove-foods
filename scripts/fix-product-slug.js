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

async function fixProductSlug() {
  try {
    console.log('🔧 Fixing product slug...');
    
    const productId = 'idWT1gDqjQZV3Ro3j4mX';
    const correctSlug = 'organic-extra-virgin-olive-oil-2';
    
    const productRef = doc(db, 'products', productId);
    
    await updateDoc(productRef, {
      slug: correctSlug,
      updatedAt: new Date().toISOString()
    });
    
    console.log('✅ Product slug fixed!');
    console.log(`Product ID: ${productId}`);
    console.log(`New Slug: ${correctSlug}`);
    console.log(`Product URL will be: /products/${correctSlug}`);
    
  } catch (error) {
    console.error('❌ Error fixing product slug:', error);
  }
}

fixProductSlug();