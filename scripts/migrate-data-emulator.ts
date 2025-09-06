#!/usr/bin/env tsx

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, connectStorageEmulator } from 'firebase/storage';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Firebase configuration for emulators
const firebaseConfig = {
  apiKey: "demo-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456789"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Connect to emulators
connectFirestoreEmulator(db, 'localhost', 8080);
connectStorageEmulator(storage, 'localhost', 9199);

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

// Migrate categories
const migrateCategories = async () => {
  console.log('🚀 Starting categories migration...');
  
  const categories = loadJSON('data/categories.json');
  const batch = writeBatch(db);
  
  for (const category of categories) {
    try {
      const categoryData = cleanObject({
        ...category,
        icon: category.heroImage || null, // Use heroImage as icon if available
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

// Migrate products
const migrateProducts = async () => {
  console.log('🚀 Starting products migration...');
  
  const products = loadJSON('data/products.json');
  const batch = writeBatch(db);
  
  for (const product of products) {
    try {
      // For emulator, just keep original image paths - no actual upload needed
      const productData = cleanObject({
        ...product,
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

// Migrate recipes
const migrateRecipes = async () => {
  console.log('🚀 Starting recipes migration...');
  
  const recipes = loadJSON('data/recipes.json');
  const batch = writeBatch(db);
  
  for (const recipe of recipes) {
    try {
      const recipeData = cleanObject({
        ...recipe,
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

// Main migration function
const runMigration = async () => {
  try {
    console.log('🎯 Starting Firebase emulator data migration...');
    console.log('📊 Using Firebase emulators for safe testing');
    
    await migrateCategories();
    await migrateProducts();
    await migrateRecipes();
    await migrateLocations();
    
    console.log('🎉 All migrations completed successfully!');
    console.log('👀 View your data at: http://localhost:4000');
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