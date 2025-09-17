const { initializeApp } = require('firebase/app');
const { getFirestore, doc, deleteDoc, collection, query, where, getDocs } = require('firebase/firestore');

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

async function removeCookingSpraysCategory() {
  try {
    console.log('🔍 Searching for cooking-sprays category in Firestore...');
    
    // Check if cooking-sprays category exists
    const categoriesRef = collection(db, 'categories');
    const cookingSpraysQuery = query(categoriesRef, where('id', '==', 'cooking-sprays'));
    const cookingSpraysSnapshot = await getDocs(cookingSpraysQuery);
    
    if (cookingSpraysSnapshot.empty) {
      console.log('✅ No cooking-sprays category found in Firestore. It may have already been removed.');
      return;
    }
    
    // Delete the cooking-sprays category
    cookingSpraysSnapshot.forEach(async (doc) => {
      console.log(`🗑️ Deleting cooking-sprays category document: ${doc.id}`);
      await deleteDoc(doc.ref);
      console.log('✅ Cooking-sprays category deleted successfully!');
    });
    
    // Also check for any documents with slug 'cooking-sprays'
    const cookingSpraysSlugQuery = query(categoriesRef, where('slug', '==', 'cooking-sprays'));
    const cookingSpraysSlugSnapshot = await getDocs(cookingSpraysSlugQuery);
    
    if (!cookingSpraysSlugSnapshot.empty) {
      cookingSpraysSlugSnapshot.forEach(async (doc) => {
        console.log(`🗑️ Deleting cooking-sprays category by slug: ${doc.id}`);
        await deleteDoc(doc.ref);
        console.log('✅ Cooking-sprays category (by slug) deleted successfully!');
      });
    }
    
    console.log('🎉 All cooking-sprays category references have been removed from Firestore!');
    
  } catch (error) {
    console.error('❌ Error removing cooking-sprays category:', error);
  }
}

removeCookingSpraysCategory();