const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');

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
const storage = getStorage(app);

async function uploadCertificationImage() {
  try {
    // Read the image file
    const imagePath = path.join(__dirname, '../public/assets/certifications/all-certifications.png');
    const imageBuffer = fs.readFileSync(imagePath);
    
    // Create a reference to the Firebase Storage location
    const storageRef = ref(storage, 'certifications/all-certifications.png');
    
    // Convert buffer to array buffer for upload
    const arrayBuffer = new ArrayBuffer(imageBuffer.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < imageBuffer.length; ++i) {
      view[i] = imageBuffer[i];
    }
    
    console.log('Uploading certification image to Firebase Storage...');
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, arrayBuffer);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('✅ Upload successful!');
    console.log('📸 Image URL:', downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  }
}

// Run the upload
uploadCertificationImage()
  .then((url) => {
    console.log('\n🎉 Certification image uploaded successfully!');
    console.log('🔗 Firebase Storage URL:', url);
    console.log('\nNext step: Update the certifications page to use this URL');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Failed to upload certification image:', error);
    process.exit(1);
  });