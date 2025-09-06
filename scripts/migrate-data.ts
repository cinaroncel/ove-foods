#!/usr/bin/env tsx

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
import { config } from 'dotenv';
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
const storage = getStorage(app);

// Load JSON data
const loadJSON = (filePath: string) => {
  const fullPath = path.join(process.cwd(), filePath);
  const fileContent = fs.readFileSync(fullPath, 'utf8');
  return JSON.parse(fileContent);
};

// Upload image to Firebase Storage
const uploadImage = async (imagePath: string, storagePath: string): Promise<string> => {
  try {
    const fullImagePath = path.join(process.cwd(), 'assets', imagePath);
    
    if (!fs.existsSync(fullImagePath)) {
      console.warn(`Warning: Image not found at ${fullImagePath}`);
      return imagePath; // Return original path if file doesn't exist
    }

    const imageBuffer = fs.readFileSync(fullImagePath);
    const imageRef = ref(storage, storagePath);
    
    const snapshot = await uploadBytes(imageRef, imageBuffer);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log(`✅ Uploaded ${imagePath} -> ${downloadURL}`);
    return downloadURL;
  } catch (error) {
    console.error(`❌ Error uploading ${imagePath}:`, error);
    return imagePath; // Return original path on error
  }
};

// Migrate products
const migrateProducts = async () => {
  console.log('🚀 Starting products migration...');
  
  const products = loadJSON('data/products.json');
  const batch = writeBatch(db);
  
  for (const product of products) {
    try {
      // Upload product images
      const uploadedImages: string[] = [];
      for (const image of product.images || []) {
        try {
          const uploadedUrl = await uploadImage(`products/${image}`, `products/${image}`);
          uploadedImages.push(uploadedUrl);
        } catch (error) {
          console.warn(`Warning: Could not upload image ${image} for product ${product.title}`);
          // Keep original image path as fallback
          uploadedImages.push(image);
        }
      }
      
      // Update product with uploaded image URLs and clean undefined values
      const productData = cleanObject({
        ...product,
        images: uploadedImages,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      const productRef = doc(collection(db, 'products'), product.id);
      batch.set(productRef, productData);
      
      console.log(`📦 Prepared product: ${product.title}`);
    } catch (error) {
      console.error(`❌ Error preparing product ${product.id}:`, error);
    }
  }
  
  await batch.commit();
  console.log('✅ Products migration completed!');
};

// Helper function to clean undefined values from objects
const cleanObject = (obj: any): any => {
  const cleaned: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        const cleanedValue = cleanObject(value);
        if (Object.keys(cleanedValue).length > 0) {
          cleaned[key] = cleanedValue;
        }
      } else {
        cleaned[key] = value;
      }
    }
  }
  return cleaned;
};

// Migrate categories
const migrateCategories = async () => {
  console.log('🚀 Starting categories migration...');
  
  const categories = loadJSON('data/categories.json');
  const batch = writeBatch(db);
  
  for (const category of categories) {
    try {
      // Upload category icon if exists
      let iconUrl = null;
      if (category.icon && !category.icon.startsWith('http')) {
        try {
          iconUrl = await uploadImage(`categories/${category.icon}`, `categories/${category.icon}`);
        } catch (error) {
          console.warn(`Warning: Could not upload icon for ${category.name}`);
        }
      } else if (category.icon && category.icon.startsWith('http')) {
        iconUrl = category.icon;
      }
      
      const categoryData = cleanObject({
        ...category,
        icon: iconUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      const categoryRef = doc(collection(db, 'categories'), category.id);
      batch.set(categoryRef, categoryData);
      
      console.log(`📂 Prepared category: ${category.name}`);
    } catch (error) {
      console.error(`❌ Error preparing category ${category.id}:`, error);
    }
  }
  
  await batch.commit();
  console.log('✅ Categories migration completed!');
};

// Migrate recipes
const migrateRecipes = async () => {
  console.log('🚀 Starting recipes migration...');
  
  const recipes = loadJSON('data/recipes.json');
  const batch = writeBatch(db);
  
  for (const recipe of recipes) {
    try {
      // Upload recipe images
      const uploadedImages: string[] = [];
      for (const image of recipe.images || []) {
        try {
          const uploadedUrl = await uploadImage(`recipes/${image}`, `recipes/${image}`);
          uploadedImages.push(uploadedUrl);
        } catch (error) {
          console.warn(`Warning: Could not upload image ${image} for recipe ${recipe.title}`);
          uploadedImages.push(image);
        }
      }
      
      const recipeData = cleanObject({
        ...recipe,
        images: uploadedImages,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      const recipeRef = doc(collection(db, 'recipes'), recipe.id);
      batch.set(recipeRef, recipeData);
      
      console.log(`🍳 Prepared recipe: ${recipe.title}`);
    } catch (error) {
      console.error(`❌ Error preparing recipe ${recipe.id}:`, error);
    }
  }
  
  await batch.commit();
  console.log('✅ Recipes migration completed!');
};

// Migrate locations
const migrateLocations = async () => {
  console.log('🚀 Starting locations migration...');
  
  const locations = loadJSON('data/locations.json');
  const batch = writeBatch(db);
  
  for (const location of locations) {
    try {
      const locationData = cleanObject({
        ...location,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      const locationRef = doc(collection(db, 'locations'), location.id);
      batch.set(locationRef, locationData);
      
      console.log(`📍 Prepared location: ${location.name}`);
    } catch (error) {
      console.error(`❌ Error preparing location ${location.id}:`, error);
    }
  }
  
  await batch.commit();
  console.log('✅ Locations migration completed!');
};

// Migrate story posts
const migrateStoryPosts = async () => {
  console.log('🚀 Starting story posts migration...');
  
  try {
    const storyPosts = loadJSON('data/story-posts.json');
    const batch = writeBatch(db);
    
    for (const post of storyPosts) {
      try {
        // Upload story images
        const uploadedImages: string[] = [];
        for (const image of post.images || []) {
          try {
            const uploadedUrl = await uploadImage(`stories/${image}`, `stories/${image}`);
            uploadedImages.push(uploadedUrl);
          } catch (error) {
            console.warn(`Warning: Could not upload image ${image} for story ${post.title}`);
            uploadedImages.push(image);
          }
        }
        
        const postData = cleanObject({
          ...post,
          images: uploadedImages,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        
        const postRef = doc(collection(db, 'stories'), post.id);
        batch.set(postRef, postData);
        
        console.log(`📖 Prepared story: ${post.title}`);
      } catch (error) {
        console.error(`❌ Error preparing story ${post.id}:`, error);
      }
    }
    
    await batch.commit();
    console.log('✅ Story posts migration completed!');
  } catch (error) {
    console.log('⚠️ Story posts file not found or error reading it, skipping...');
  }
};

// Migrate sustainability posts
const migrateSustainabilityPosts = async () => {
  console.log('🚀 Starting sustainability posts migration...');
  
  try {
    const sustainabilityPosts = loadJSON('data/sustainability-posts.json');
    const batch = writeBatch(db);
    
    for (const post of sustainabilityPosts) {
      try {
        // Upload sustainability images
        const uploadedImages: string[] = [];
        for (const image of post.images || []) {
          try {
            const uploadedUrl = await uploadImage(`sustainability/${image}`, `sustainability/${image}`);
            uploadedImages.push(uploadedUrl);
          } catch (error) {
            console.warn(`Warning: Could not upload image ${image} for sustainability post ${post.title}`);
            uploadedImages.push(image);
          }
        }
        
        const postData = cleanObject({
          ...post,
          images: uploadedImages,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        
        const postRef = doc(collection(db, 'sustainability'), post.id);
        batch.set(postRef, postData);
        
        console.log(`🌱 Prepared sustainability post: ${post.title}`);
      } catch (error) {
        console.error(`❌ Error preparing sustainability post ${post.id}:`, error);
      }
    }
    
    await batch.commit();
    console.log('✅ Sustainability posts migration completed!');
  } catch (error) {
    console.log('⚠️ Sustainability posts file not found or error reading it, skipping...');
  }
};

// Main migration function
const runMigration = async () => {
  try {
    console.log('🎯 Starting Firebase data migration...');
    console.log(`📊 Project: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);
    
    await migrateCategories();
    await migrateProducts();
    await migrateRecipes();
    await migrateLocations();
    await migrateStoryPosts();
    await migrateSustainabilityPosts();
    
    console.log('🎉 All migrations completed successfully!');
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
};

// Run if this script is executed directly
if (require.main === module) {
  runMigration();
}

export { runMigration };