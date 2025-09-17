const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// Initialize Firebase (using same config as your app)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

async function debugRecipes() {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('Checking recipes collection...\n');
    
    const recipesRef = collection(db, 'recipes');
    const snapshot = await getDocs(recipesRef);
    
    console.log(`Found ${snapshot.docs.length} recipes in Firestore:\n`);
    
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      console.log(`ID: ${doc.id}`);
      console.log(`Title: ${data.title}`);
      console.log(`Slug: ${data.slug}`);
      console.log(`Featured: ${data.featured}`);
      console.log(`---`);
    });
    
    if (snapshot.docs.length === 0) {
      console.log('No recipes found. The bulk importer should be visible.');
    }
    
  } catch (error) {
    console.error('Error checking recipes:', error);
  }
}

debugRecipes();