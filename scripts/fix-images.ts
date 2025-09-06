#!/usr/bin/env tsx

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, updateDoc, getDocs } from 'firebase/firestore';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCuM8UIRP1vxvu5F2aEoG9GaPtWJ80xKi4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ove-foods.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ove-foods",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ove-foods.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "402049052326",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:402049052326:web:81934fb0b78e522e7b0e67",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-PWYG73C90T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Placeholder image URLs using a reliable service
const createPlaceholderUrl = (width: number = 800, height: number = 600, text: string = 'Product') => {
  const encodedText = encodeURIComponent(text);
  return `https://placehold.co/${width}x${height}/e5e7eb/6b7280?text=${encodedText}`;
};

// Product-specific placeholder images
const getProductPlaceholder = (productTitle: string) => {
  return createPlaceholderUrl(800, 600, productTitle);
};

// Category placeholder images
const getCategoryPlaceholder = (categoryName: string) => {
  return createPlaceholderUrl(1200, 600, categoryName);
};

// Recipe placeholder images
const getRecipePlaceholder = (recipeTitle: string) => {
  return createPlaceholderUrl(800, 600, recipeTitle);
};

// Fix products
const fixProducts = async () => {
  console.log('🔧 Fixing product images...');
  
  const querySnapshot = await getDocs(collection(db, 'products'));
  
  for (const docSnap of querySnapshot.docs) {
    const product = docSnap.data();
    const placeholderImages = [
      getProductPlaceholder(product.title),
      getProductPlaceholder(`${product.title} - Detail`),
    ];
    
    await updateDoc(doc(db, 'products', docSnap.id), {
      images: placeholderImages,
      updatedAt: new Date().toISOString(),
    });
    
    console.log(`✅ Fixed images for product: ${product.title}`);
  }
};

// Fix categories
const fixCategories = async () => {
  console.log('🔧 Fixing category images...');
  
  const querySnapshot = await getDocs(collection(db, 'categories'));
  
  for (const docSnap of querySnapshot.docs) {
    const category = docSnap.data();
    const placeholderImage = getCategoryPlaceholder(category.name);
    
    await updateDoc(doc(db, 'categories', docSnap.id), {
      heroImage: placeholderImage,
      icon: null, // Remove undefined icon
      updatedAt: new Date().toISOString(),
    });
    
    console.log(`✅ Fixed images for category: ${category.name}`);
  }
};

// Fix recipes
const fixRecipes = async () => {
  console.log('🔧 Fixing recipe images...');
  
  const querySnapshot = await getDocs(collection(db, 'recipes'));
  
  for (const docSnap of querySnapshot.docs) {
    const recipe = docSnap.data();
    const placeholderImages = [
      getRecipePlaceholder(recipe.title),
    ];
    
    await updateDoc(doc(db, 'recipes', docSnap.id), {
      heroImage: getRecipePlaceholder(recipe.title),
      images: placeholderImages,
      updatedAt: new Date().toISOString(),
    });
    
    console.log(`✅ Fixed images for recipe: ${recipe.title}`);
  }
};

// Fix stories
const fixStories = async () => {
  console.log('🔧 Fixing story images...');
  
  try {
    const querySnapshot = await getDocs(collection(db, 'stories'));
    
    for (const docSnap of querySnapshot.docs) {
      const story = docSnap.data();
      const placeholderImages = [
        createPlaceholderUrl(800, 600, story.title),
      ];
      
      await updateDoc(doc(db, 'stories', docSnap.id), {
        images: placeholderImages,
        updatedAt: new Date().toISOString(),
      });
      
      console.log(`✅ Fixed images for story: ${story.title}`);
    }
  } catch (error) {
    console.log('⚠️ No stories collection found, skipping...');
  }
};

// Fix sustainability posts
const fixSustainability = async () => {
  console.log('🔧 Fixing sustainability post images...');
  
  try {
    const querySnapshot = await getDocs(collection(db, 'sustainability'));
    
    for (const docSnap of querySnapshot.docs) {
      const post = docSnap.data();
      const placeholderImages = [
        createPlaceholderUrl(800, 600, post.title),
      ];
      
      await updateDoc(doc(db, 'sustainability', docSnap.id), {
        images: placeholderImages,
        updatedAt: new Date().toISOString(),
      });
      
      console.log(`✅ Fixed images for sustainability post: ${post.title}`);
    }
  } catch (error) {
    console.log('⚠️ No sustainability collection found, skipping...');
  }
};

// Main function
const fixAllImages = async () => {
  try {
    console.log('🎯 Starting image placeholder replacement...');
    console.log(`📊 Project: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);
    
    await fixProducts();
    await fixCategories();
    await fixRecipes();
    await fixStories();
    await fixSustainability();
    
    console.log('🎉 All image placeholders updated successfully!');
  } catch (error) {
    console.error('💥 Image fix failed:', error);
    process.exit(1);
  }
};

// Run if this script is executed directly
if (require.main === module) {
  fixAllImages();
}

export { fixAllImages };