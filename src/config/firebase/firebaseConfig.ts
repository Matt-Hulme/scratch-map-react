import { FirebaseError, initializeApp } from 'firebase/app'
// Import necessary Firebase modules for authentication and app initialization.
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'

// Define the Firebase configuration object with your project's credentials.
export const firebaseConfig = {
  apiKey: 'AIzaSyCUVu52kQTtFTOLzuZh0a2W_sIdXVze6sc',
  authDomain: 'scratch-map-7d0bf.firebaseapp.com',
  projectId: 'scratch-map-7d0bf',
  storageBucket: 'scratch-map-7d0bf.firebasestorage.app',
  messagingSenderId: '224895130364',
  appId: '1:224895130364:web:3209f225470f7986805579',
  measurementId: 'G-YL6F96MYTV',
}

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)

const firebaseGoogleSignIn = async () => {
  try {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({
      prompt: 'select_account',
    })
    const response = await signInWithPopup(auth, provider)

    if (!auth?.currentUser) return

    await updateProfile(auth.currentUser, {
      displayName: auth?.currentUser?.providerData?.[0]?.displayName,
      photoURL: auth?.currentUser?.providerData?.[0]?.photoURL,
    })

    return {
      createdNewAccount: true,
      user: response?.user,
    }
  } catch (error) {
    const credential = GoogleAuthProvider.credentialFromError(
      error as FirebaseError
    )

    if (!credential) return

    const response = await signInWithCredential(auth, credential)

    if (!response) return { error }

    return { createdNewAccount: false }
  }
}

const firebaseSignOut = async () => {
  const response = await signOut(auth)
  return response
}

export { auth, firebaseGoogleSignIn, firebaseSignOut }
