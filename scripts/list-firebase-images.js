const { initializeApp } = require('firebase/app');
const { getStorage, ref, listAll, getDownloadURL } = require('firebase/storage');

// Initialize Firebase (using same config as your app)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

async function listFirebaseImages() {
  try {
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    
    console.log('Listing images in Firebase Storage...\n');
    
    // List products folder
    const productsRef = ref(storage, 'products');
    const productsList = await listAll(productsRef);
    
    console.log('=== PRODUCTS FOLDER ===');
    for (const item of productsList.items) {
      const downloadURL = await getDownloadURL(item);
      console.log(`Name: ${item.name}`);
      console.log(`URL: ${downloadURL}`);
      console.log('---');
    }
    
    // List recipes folder
    const recipesRef = ref(storage, 'recipes');
    const recipesList = await listAll(recipesRef);
    
    console.log('\n=== RECIPES FOLDER ===');
    for (const item of recipesList.items) {
      const downloadURL = await getDownloadURL(item);
      console.log(`Name: ${item.name}`);
      console.log(`URL: ${downloadURL}`);
      console.log('---');
    }
    
    // List categories folder if it exists
    try {
      const categoriesRef = ref(storage, 'categories');
      const categoriesList = await listAll(categoriesRef);
      
      console.log('\n=== CATEGORIES FOLDER ===');
      for (const item of categoriesList.items) {
        const downloadURL = await getDownloadURL(item);
        console.log(`Name: ${item.name}`);
        console.log(`URL: ${downloadURL}`);
        console.log('---');
      }
    } catch (error) {
      console.log('\nNo categories folder found.');
    }
    
  } catch (error) {
    console.error('Error listing Firebase Storage contents:', error);
  }
}

listFirebaseImages();