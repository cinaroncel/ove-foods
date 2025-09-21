const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');

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

async function setupHeroVideo() {
  try {
    console.log('🎬 Setting up hero video in Firestore settings...');
    
    // Create settings collection with hero video configuration
    const settingsRef = doc(db, 'settings', 'hero');
    
    const heroSettings = {
      videoSrc: '/assets/herovideo.mp4',
      headline: 'Authentic Mediterranean Flavors',
      subcopy: 'Premium olive oils, aged vinegars, and gourmet products crafted with three generations of Turkish expertise. From our family business to your kitchen.',
      primaryCta: {
        label: 'Explore Products',
        href: '/products'
      },
      secondaryCta: {
        label: 'Find Recipes',
        href: '/recipes'
      },
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    await setDoc(settingsRef, heroSettings);
    
    console.log('✅ Hero video settings saved to Firestore!');
    console.log('📍 Collection: settings');
    console.log('📍 Document: hero');
    console.log('🎬 Video Source:', heroSettings.videoSrc);
    
  } catch (error) {
    console.error('❌ Error setting up hero video:', error);
  }
}

setupHeroVideo();