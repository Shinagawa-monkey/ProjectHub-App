import { initializeApp } from 'firebase/app'
import { getFirestore, Timestamp } from 'firebase/firestore'
import { getAuth, fetchSignInMethodsForEmail } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyC_jD19-CvJyrei7isQoRMWELtomsdzZbI',
  authDomain: 'project-hub-site.firebaseapp.com',
  projectId: 'project-hub-site',
  storageBucket: 'project-hub-site.appspot.com',
  messagingSenderId: '493238572535',
  appId: '1:493238572535:web:92684d6b1018605ad98af2',
}

// initialize Firebase
const app = initializeApp(firebaseConfig)

// initialize Firestore services
const db = getFirestore()

// initialize Firebase Auth
const auth = getAuth(app)

const checkEmailAvailability = async (email) => {
  try {
    const userCredential = await fetchSignInMethodsForEmail(auth, email)
    // If length > 0, email is taken
    return userCredential.length > 0
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error checking email availability:', error)
    }
    return false
  }
}

// initialize Cloud Storage and get a reference to the service
const storage = getStorage(app)

// get server timestamp
const timestamp = Timestamp

export { db, auth, storage, timestamp, checkEmailAvailability }
