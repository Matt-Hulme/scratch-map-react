import { auth } from '../../../config/firebase/firebaseConfig'

export const Home = () => {
  return (
    <div className="bg-[#2e6f40] h-[100vh] flex flex-col items-center justify-center space-y-10 relative">
      <h1 className="text-white font-bold absolute top-10">Scratch-Map</h1>
      <h3 className="text-white">{auth?.currentUser?.displayName}</h3>
    </div>
  )
}
