const fs = require('fs');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');

// Firebase config (using environment variables with fallbacks)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCuM8UIRP1vxvu5F2aEoG9GaPtWJ80xKi4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ove-foods.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ove-foods",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ove-foods.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "402049052326",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:402049052326:web:81934fb0b78e522e7b0e67"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Read the recipes from JSON file
const recipesData = JSON.parse(fs.readFileSync('./data/recipes.json', 'utf8'));

// Get the new recipes (last 6 added)
const newRecipes = recipesData.slice(-6);

async function uploadNewRecipesToFirebase() {
  try {
    console.log('🍽️  Uploading 6 new recipes to Firebase...');
    
    for (let i = 0; i < newRecipes.length; i++) {
      const recipe = newRecipes[i];
      console.log(`📝 Adding recipe ${i + 1}/6: ${recipe.title}`);
      
      // Add to Firebase with the recipe ID as document ID
      await setDoc(doc(db, 'recipes', recipe.id), recipe);
      console.log(`✅ Added: ${recipe.title}`);
    }
    
    console.log('\n🎉 All 6 new recipes uploaded successfully!');
    console.log('\n📋 New recipes added:');
    newRecipes.forEach((recipe, index) => {
      console.log(`${index + 1}. ${recipe.title}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to upload recipes:', error);
    process.exit(1);
  }
}

// Run the upload
uploadNewRecipesToFirebase();