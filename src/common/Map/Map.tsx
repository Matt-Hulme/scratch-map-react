import { GoogleMap, useLoadScript } from '@react-google-maps/api'

export const Map = () => {
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
    <GoogleMap
      mapContainerStyle={{ width: '80%', height: '400px' }}
      center={{ lat: 37.7749, lng: -122.4194 }}
      zoom={8}
    />
  )
}
