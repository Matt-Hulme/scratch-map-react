import { firebaseGoogleSignIn } from '../../config/firebase/firebaseConfig'

export const Login = () => (
  <div className="bg-[#2e6f40] h-[100vh] flex flex-col items-center justify-center space-y-10 relative">
    <h1 className="text-white font-bold absolute top-10">Scratch-Map</h1>
    <button
      className="bg-white h-10 w-80 rounded-md hover:bg-gray-400"
      onClick={firebaseGoogleSignIn}
    >
      Sign-In
    </button>
  </div>
)
