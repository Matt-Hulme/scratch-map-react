import { Map } from './Map'
import { auth } from '../../config/firebase/firebaseConfig'

export const Home = () => {
  return (
    <div className="bg-[#2e6f40] h-[100vh] flex flex-col items-center justify-center space-y-10 relative py-4">
      <h1 className="text-white text-6xl">Scratch Map</h1>
      <Map />
      <div className="gap-4 flex flex-col items-center w-full">
        <h3 className="text-white">{auth?.currentUser?.displayName}</h3>
        <button
          className="bg-white rounded-md border-black border-[2px] border-solid w-[150px]"
          onClick={() => {}}
        >
          Save
        </button>
      </div>
    </div>
  )
}
