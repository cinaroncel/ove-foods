const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where } = require('firebase/firestore');

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

async function debugProduct() {
  try {
    console.log('🔍 Searching for "Organic extra virgin olive oil 2"...\n');
    
    // Search for the product
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('title', '==', 'Organic extra virgin olive oil 2'));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('❌ Product not found with exact title match');
      console.log('Let me search for products containing "Organic"...\n');
      
      // Get all products and filter by title containing "Organic"
      const allProductsSnapshot = await getDocs(productsRef);
      const organicProducts = [];
      
      allProductsSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.title && data.title.toLowerCase().includes('organic')) {
          organicProducts.push({
            id: doc.id,
            title: data.title,
            categoryId: data.categoryId,
            slug: data.slug
          });
        }
      });
      
      if (organicProducts.length > 0) {
        console.log('🫒 Found products with "Organic" in the title:');
        organicProducts.forEach(product => {
          console.log(`- ID: ${product.id}`);
          console.log(`  Title: ${product.title}`);
          console.log(`  Category ID: ${product.categoryId}`);
          console.log(`  Slug: ${product.slug}\n`);
        });
      } else {
        console.log('❌ No products found containing "Organic"');
      }
    } else {
      querySnapshot.forEach(doc => {
        const data = doc.data();
        console.log('✅ Found the product!');
        console.log(`ID: ${doc.id}`);
        console.log(`Title: ${data.title}`);
        console.log(`Category ID: ${data.categoryId}`);
        console.log(`Slug: ${data.slug}`);
        console.log(`Created: ${data.createdAt}`);
        console.log(`Full data:`, JSON.stringify(data, null, 2));
        
        // Check what category this refers to
        checkCategory(data.categoryId);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

async function checkCategory(categoryId) {
  try {
    console.log(`\n🏷️  Checking category: ${categoryId}`);
    
    const categoriesRef = collection(db, 'categories');
    const categoryQuery = query(categoriesRef, where('__name__', '==', categoryId));
    const categorySnapshot = await getDocs(categoryQuery);
    
    if (!categorySnapshot.empty) {
      const categoryData = categorySnapshot.docs[0].data();
      console.log(`Category Name: ${categoryData.name}`);
      console.log(`Category Slug: ${categoryData.slug}`);
      console.log(`Parent Category: ${categoryData.parentCategoryId || 'None (main category)'}`);
    } else {
      console.log(`❌ Category ${categoryId} not found`);
    }
  } catch (error) {
    console.error('Error checking category:', error);
  }
}

debugProduct();