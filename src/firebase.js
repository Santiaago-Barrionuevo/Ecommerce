import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            "AIzaSyDDD61MdxQyuV4nKpMCFkxa_ybHjn8PJPA",
  authDomain:        "kova-89b83.firebaseapp.com",
  projectId:         "kova-89b83",
  storageBucket:     "kova-89b83.firebasestorage.app",
  messagingSenderId: "813581021032",
  appId:             "1:813581021032:web:ff16a9a7b111e2ba8c30dd"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db   = getFirestore(app)