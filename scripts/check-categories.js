const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, orderBy } = require('firebase/firestore');

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

async function checkCategories() {
  try {
    const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
    console.log('Current categories:');
    querySnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`- ${data.name} (id: ${doc.id}, slug: ${data.slug})`);
    });
    
    // Find olive oils category specifically
    const oliveOilsCategory = querySnapshot.docs.find(doc => 
      doc.data().slug === 'olive-oils' || 
      doc.data().name.toLowerCase().includes('olive')
    );
    
    if (oliveOilsCategory) {
      console.log('\n🫒 Olive oils category found:');
      console.log('ID:', oliveOilsCategory.id);
      console.log('Data:', oliveOilsCategory.data());
    } else {
      console.log('\n❌ Olive oils category not found');
    }
    
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

checkCategories();