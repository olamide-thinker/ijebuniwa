import { getApp, getApps, initializeApp } from 'firebase/app'
import { getFirestore, persistentLocalCache } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// // Initialize Firestore with cache settings
// const db = getFirestore(app, {
//   localCache: new persistentLocalCache({
//     size: 5 * 1024 * 1024, // 5MB (in bytes)
//     ttl: 7 * 24 * 60 * 60 * 1000 // 1 week (in milliseconds)
//   })
// });

// ... rest of your code

export const auth = getAuth(app)
export const storage = getStorage(app)
export const db = getFirestore(
	app,
	// , { localCache: persistentLocalCache()}
)
