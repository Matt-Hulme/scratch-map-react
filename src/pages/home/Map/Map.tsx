import { useState } from 'react'
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

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])

  if (!isLoaded) {
    return (
      <div className="bg-[#2e6f40] h-[100vh] flex flex-col items-center justify-center space-y-10 relative">
        <div>Loading Map...</div>
      </div>
    )
  }

  const handleFeatureClick = (
    feature: google.maps.Data.Feature,
    map: google.maps.Map
  ) => {
    const featureId = feature.getId() as string

    setSelectedFeatures((prevSelectedFeatures) => {
      const featureIndex = prevSelectedFeatures.indexOf(featureId)
      if (featureIndex > -1) {
        console.log('Feature is already selected, remove it')
        map.data.revertStyle(feature)
        return prevSelectedFeatures.filter((id) => id !== featureId)
      } else {
        console.log('Feature is not selected, add it')
        map.data.overrideStyle(feature, {
          fillColor: '#FF0000',
          fillOpacity: 0.6,
        })
        return [...prevSelectedFeatures, featureId]
      }
    })
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
            handleFeatureClick(event.feature, map)
          }
        })
      }}
    />
  )
}
