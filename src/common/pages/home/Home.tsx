import { GoogleMap, useLoadScript } from '@react-google-maps/api'
import { auth } from '../../../config/firebase/firebaseConfig'

export const Home = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  })

  if (!isLoaded)
    return (
      <div className="bg-[#2e6f40] h-[100vh] flex flex-col items-center justify-center space-y-10 relative">
        <div>Loading Map...</div>
      </div>
    )

  return (
    <div className="bg-[#2e6f40] h-[100vh] flex flex-col items-center justify-center space-y-10 relative">
      <GoogleMap
        mapContainerStyle={{ width: '80%', height: '400px' }}
        center={{ lat: 37.7749, lng: -122.4194 }}
        zoom={8}
      />
      <h3 className="text-white">{auth?.currentUser?.displayName}</h3>
    </div>
  )
}
