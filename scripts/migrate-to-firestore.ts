#!/usr/bin/env tsx

// Migration script to move JSON data to Firestore
// Run with: npx tsx scripts/migrate-to-firestore.ts

import { readFileSync } from 'fs';
import { join } from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCuM8UIRP1vxvu5F2aEoG9GaPtWJ80xKi4",
  authDomain: "ove-foods.firebaseapp.com",
  projectId: "ove-foods",
  storageBucket: "ove-foods.firebasestorage.app",
  messagingSenderId: "402049052326",
  appId: "1:402049052326:web:81934fb0b78e522e7b0e67",
  measurementId: "G-PWYG73C90T"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateCollection(fileName: string, collectionName: string) {
  try {
    console.log(`Migrating ${fileName} to ${collectionName}...`);
    
    const filePath = join(process.cwd(), 'data', fileName);
    const fileContent = readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    const batch = writeBatch(db);
    const collectionRef = collection(db, collectionName);
    
    for (const item of data) {
      const docRef = doc(collectionRef, item.id || item.slug);
      batch.set(docRef, item);
    }
    
    await batch.commit();
    console.log(`✅ Successfully migrated ${data.length} items to ${collectionName}`);
    
  } catch (error) {
    console.error(`❌ Error migrating ${fileName}:`, error);
  }
}

async function main() {
  console.log('🚀 Starting migration to Firestore...\n');
  
  const migrations = [
    { file: 'categories.json', collection: 'categories' },
    { file: 'products.json', collection: 'products' },
    { file: 'recipes.json', collection: 'recipes' },
    { file: 'locations.json', collection: 'locations' },
    { file: 'story-posts.json', collection: 'story-posts' },
    { file: 'sustainability-posts.json', collection: 'sustainability-posts' },
    { file: 'sustainability-metrics.json', collection: 'sustainability-metrics' },
  ];
  
  for (const migration of migrations) {
    await migrateCollection(migration.file, migration.collection);
  }
  
  console.log('\n🎉 Migration completed!');
  process.exit(0);
}

main().catch(console.error);