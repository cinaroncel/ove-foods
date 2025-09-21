const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

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

async function debugCategories() {
  try {
    console.log('🔍 Checking all categories in Firestore...\n');
    
    const categoriesRef = collection(db, 'categories');
    const snapshot = await getDocs(categoriesRef);
    
    if (snapshot.empty) {
      console.log('📁 No categories found in Firestore.');
      return;
    }
    
    console.log(`📊 Found ${snapshot.size} categories in Firestore:\n`);
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`📂 Document ID: ${doc.id}`);
      console.log(`   Category ID: ${data.id || 'N/A'}`);
      console.log(`   Name: ${data.name || 'N/A'}`);
      console.log(`   Slug: ${data.slug || 'N/A'}`);
      console.log(`   Order: ${data.order || 'N/A'}`);
      console.log('   ---');
    });
    
    // Check specifically for cooking sprays
    const cookingSprayCategories = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.id === 'cooking-sprays' || data.slug === 'cooking-sprays' || 
          (data.name && data.name.toLowerCase().includes('cooking')) ||
          (data.name && data.name.toLowerCase().includes('spray'))) {
        cookingSprayCategories.push({
          docId: doc.id,
          data: data
        });
      }
    });
    
    if (cookingSprayCategories.length > 0) {
      console.log('\n❌ FOUND COOKING SPRAY CATEGORIES:');
      cookingSprayCategories.forEach(cat => {
        console.log(`   Document ID: ${cat.docId}`);
        console.log(`   Data:`, cat.data);
      });
    } else {
      console.log('\n✅ No cooking spray categories found!');
    }
    
  } catch (error) {
    console.error('❌ Error checking categories:', error);
  }
}

debugCategories();