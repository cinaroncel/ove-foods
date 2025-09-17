const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

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

const oliveOilSubcategories = [
  {
    name: 'Organic Extra Virgin Olive Oil',
    slug: 'organic-extra-virgin-olive-oil',
    description: 'Certified organic extra virgin olive oils from sustainably grown olives',
    parentCategoryId: 'olive-oils',
    order: 1,
    heroImage: 'https://placehold.co/1200x600/22c55e/ffffff?text=Organic+Extra+Virgin'
  },
  {
    name: 'Extra Virgin Olive Oil',
    slug: 'extra-virgin-olive-oil',
    description: 'Premium extra virgin olive oils with exceptional flavor and quality',
    parentCategoryId: 'olive-oils',
    order: 2,
    heroImage: 'https://placehold.co/1200x600/16a34a/ffffff?text=Extra+Virgin'
  },
  {
    name: 'Pure Olive Oil',
    slug: 'pure-olive-oil',
    description: 'Classic pure olive oil perfect for cooking and everyday use',
    parentCategoryId: 'olive-oils',
    order: 3,
    heroImage: 'https://placehold.co/1200x600/15803d/ffffff?text=Pure+Olive+Oil'
  },
  {
    name: 'Infused Olive Oils',
    slug: 'infused-olive-oils',
    description: 'Flavorful olive oils infused with herbs, spices, and natural ingredients',
    parentCategoryId: 'olive-oils',
    order: 4,
    heroImage: 'https://placehold.co/1200x600/166534/ffffff?text=Infused+Olive+Oils'
  }
];

async function addSubcategories() {
  try {
    console.log('Adding olive oil subcategories...');
    
    for (const subcategory of oliveOilSubcategories) {
      const docData = {
        ...subcategory,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, 'categories'), docData);
      console.log(`✅ Added: ${subcategory.name} (ID: ${docRef.id})`);
    }
    
    console.log('\n🎉 All olive oil subcategories added successfully!');
    
  } catch (error) {
    console.error('Error adding subcategories:', error);
  }
}

addSubcategories();