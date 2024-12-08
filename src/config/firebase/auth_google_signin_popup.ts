import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { provider } from './auth_google_provider_create'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from './firebaseConfig'

initializeApp(firebaseConfig)
const auth = getAuth()

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider)
    const credential = GoogleAuthProvider.credentialFromResult(result)
    // const token = credential?.accessToken
    // const user = result.user
  } catch (error) {
    // const errorCode = error.code
    // const errorMessage = error.message
    // const email = error.customData?.email
    // const credential = GoogleAuthProvider.credentialFromError(error)
  }
}
