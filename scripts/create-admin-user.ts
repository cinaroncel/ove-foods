import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCuM8UIRP1vxvu5F2aEoG9GaPtWJ80xKi4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ove-foods.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ove-foods",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ove-foods.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "402049052326",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:402049052326:web:81934fb0b78e522e7b0e67",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-PWYG73C90T"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const auth = getAuth(app)

async function createAdminUser() {
  try {
    const adminEmail = 'admin@ovefoods.com'
    const adminPassword = 'OveAdmin2024!' // Secure password

    console.log('Creating admin user...')
    
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword)
    const user = userCredential.user

    console.log('Successfully created admin user:', user.uid)
    console.log('Email:', adminEmail)
    console.log('Password:', adminPassword)
    console.log('\n✅ Admin user created successfully!')
    console.log('\n🔗 Access the admin panel at:')
    console.log('   • Local: http://localhost:3000/admin/login')
    console.log('   • Live:  https://ove-foods.vercel.app/admin/login')

  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      console.log('✅ Admin user already exists!')
      console.log('Email: admin@ovefoods.com')
      console.log('Password: OveAdmin2024!')
      console.log('\n🔗 Access the admin panel at:')
      console.log('   • Local: http://localhost:3000/admin/login')
      console.log('   • Live:  https://ove-foods.vercel.app/admin/login')
    } else {
      console.error('❌ Error creating admin user:', error)
      console.log('\nTip: You can also create the user manually in Firebase Console:')
      console.log('https://console.firebase.google.com/project/ove-foods/authentication/users')
    }
  }
}

createAdminUser()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })