import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Firebase configuration for MIET Treasure Hunt
const firebaseConfig = {
  apiKey: "AIzaSyA-de6AEP_4CorKN3C7rpIHentJ9z7rWYo",
  authDomain: "miet-treasure-hunt.firebaseapp.com",
  projectId: "miet-treasure-hunt",
  storageBucket: "miet-treasure-hunt.firebasestorage.app",
  messagingSenderId: "281960107019",
  appId: "1:281960107019:web:78ad869c628af126430b0e"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Export Firestore instance
export const db = getFirestore(app)
