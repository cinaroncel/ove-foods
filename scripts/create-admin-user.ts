import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

// Initialize Firebase Admin SDK
if (!getApps().length) {
  // For development, we can use emulators or service account
  // Since this is for development, let's use the project ID directly
  initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  })
}

const auth = getAuth()

async function createAdminUser() {
  try {
    const adminEmail = 'admin@ovefoods.com'
    const adminPassword = 'admin123' // You should change this to something secure

    console.log('Creating admin user...')
    
    const userRecord = await auth.createUser({
      email: adminEmail,
      password: adminPassword,
      emailVerified: true,
      displayName: 'OVE Foods Admin',
    })

    console.log('Successfully created admin user:', userRecord.uid)
    console.log('Email:', adminEmail)
    console.log('Password:', adminPassword)
    console.log('\nYou can now log in to the admin panel with these credentials.')

  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      console.log('Admin user already exists!')
      console.log('Email: admin@ovefoods.com')
      console.log('Password: admin123')
    } else {
      console.error('Error creating admin user:', error)
    }
  }
}

createAdminUser()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })