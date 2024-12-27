import { GoogleMap, useLoadScript } from '@react-google-maps/api'

const center = {
  lat: 39.8283,
  lng: -98.5795,
}

const mapId = import.meta.env.VITE_GOOGLE_MAP_ID as string

const mapContainerStyle = {
  width: '80%',
  height: '80%',
}

const combinedGeoJson = 'src/assets/combined.geojson'

export const Map = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  })

  if (!isLoaded) {
    return (
      <div className="bg-[#2e6f40] h-[100vh] flex flex-col items-center justify-center space-y-10 relative">
        <div>Loading Map...</div>
      </div>
    )
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={3}
      options={{
        clickableIcons: false,
        disableDefaultUI: true,
        mapId,
      }}
      onLoad={(map) => {
        map.data.loadGeoJson(combinedGeoJson)

        map.data.setStyle(() => ({
          strokeColor: '#000000',
          strokeWeight: 0.7,
          fillColor: 'transparent',
        }))
        map.data.addListener('click', (event: google.maps.Data.MouseEvent) => {
          if (event.feature) {
            console.log(event?.feature)
            map.data.revertStyle()
            map.data.overrideStyle(event?.feature, {
              fillColor: '#FF0000',
              fillOpacity: 0.6,
            })
          }
        })
      }}
    />
  )
}
