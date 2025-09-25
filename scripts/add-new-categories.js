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

const newCategories = [
  {
    id: "honey",
    slug: "honey",
    name: "Honey",
    description: "Pure and natural honey varieties with distinct flavors and textures",
    heroImage: "https://placehold.co/1200x600/e5e7eb/6b7280?text=Honey",
    order: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "seasoning",
    slug: "seasoning",
    name: "Seasoning",
    description: "Premium spices, herbs, and seasoning blends to enhance your culinary creations",
    heroImage: "https://placehold.co/1200x600/e5e7eb/6b7280?text=Seasoning",
    order: 60,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "gourmet-products",
    slug: "gourmet-products",
    name: "Gourmet Products",
    description: "Carefully curated selection of artisanal and gourmet food products",
    heroImage: "https://placehold.co/1200x600/e5e7eb/6b7280?text=Gourmet+Products",
    order: 70,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

async function addNewCategories() {
  try {
    console.log('Adding new categories to Firebase...');
    
    for (const category of newCategories) {
      console.log(`Adding category: ${category.name}`);
      
      const docRef = await addDoc(collection(db, 'categories'), category);
      console.log(`✅ Added ${category.name} with ID: ${docRef.id}`);
    }
    
    console.log('✅ All categories added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding categories:', error);
  }
}

addNewCategories();