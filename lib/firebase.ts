import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ''
}

// Initialize Firebase only if config is available.
// Note: only Firebase Auth is used on the client — all data access goes through
// the backend Express API (Firebase Admin SDK). There is intentionally no
// Firestore client (`db`) here; the security rules deny all direct client access.
let app: any = null
let auth: any = null
let googleProvider: any = null

try {
  // Check if Firebase is configured (at least apiKey and projectId are required)
  if (firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.apiKey !== '' && firebaseConfig.projectId !== '') {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    googleProvider = new GoogleAuthProvider()
  } else {
    console.warn('Firebase configuration missing - auth features disabled')
    // Set to null to prevent errors
    auth = null
    googleProvider = null
  }
} catch (error: any) {
  console.error('Firebase initialization error:', error?.message || error)
  // If initialization fails, set to null to prevent further errors
  auth = null
  googleProvider = null
  app = null
}

export { auth, googleProvider }
export default app
