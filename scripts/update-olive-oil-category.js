// Script to update the olive oil category in Firebase
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc, collection, query, where, getDocs } = require('firebase/firestore');

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

async function updateOliveOilCategory() {
  try {
    console.log('Searching for olive oil category...');
    
    // Find the category by slug
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, where('slug', '==', 'olive-oils'));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('No category found with slug "olive-oils"');
      return;
    }
    
    const categoryDoc = querySnapshot.docs[0];
    const categoryData = categoryDoc.data();
    
    console.log('Found category:', {
      id: categoryDoc.id,
      name: categoryData.name,
      description: categoryData.description
    });
    
    // Update the category
    const updateData = {
      name: 'Olive Oil',
      description: 'Premium extra virgin and classic olive oil crafted from the finest Mediterranean olives'
    };
    
    console.log('Updating category with:', updateData);
    
    await updateDoc(doc(db, 'categories', categoryDoc.id), updateData);
    
    console.log('Category updated successfully!');
    
  } catch (error) {
    console.error('Error updating category:', error);
  }
}

// Run the script
updateOliveOilCategory().then(() => {
  console.log('Script completed');
  process.exit(0);
}).catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});