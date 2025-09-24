// Script to list all categories in Firebase
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function listAllCategories() {
  try {
    console.log('Fetching all categories...');
    
    const categoriesRef = collection(db, 'categories');
    const querySnapshot = await getDocs(categoriesRef);
    
    if (querySnapshot.empty) {
      console.log('No categories found in the database');
      return;
    }
    
    console.log(`Found ${querySnapshot.size} categories:`);
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log({
        id: doc.id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        parentCategoryId: data.parentCategoryId || 'none'
      });
    });
    
  } catch (error) {
    console.error('Error listing categories:', error);
  }
}

// Run the script
listAllCategories().then(() => {
  console.log('Script completed');
  process.exit(0);
}).catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});