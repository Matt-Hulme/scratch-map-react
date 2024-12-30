import { auth } from '../../config/firebase/firebaseConfig'
import { Map } from './Map'

export const Home = () => {
  return (
    <div className="bg-[#2e6f40] h-[100vh] flex flex-col items-center space-y-4 relative py-2 text-white">
      <h1 className="h1">Where Have You Been?</h1>
      <h2 className="h2">{auth?.currentUser?.displayName}</h2>
      <Map />
    </div>
  )
}
