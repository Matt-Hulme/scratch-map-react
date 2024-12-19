import { GoogleMap, useLoadScript } from '@react-google-maps/api'
import { useCallback, useState } from 'react'
import { mapStyle } from './mapStyle'

const mapContainerStyle = {
  width: '80%',
  height: '500px',
}

const center = {
  lat: 39.8283,
  lng: -98.5795,
}

const usStatesGeoJson = 'src/assets/us-states.geojson' // Replace with the actual path to your GeoJSON file

export const Map = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  })

  const [selectedStates, setSelectedStates] = useState<Set<string>>(new Set())
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(
    new Set()
  )

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      // Load US states GeoJSON
      map.data.loadGeoJson(usStatesGeoJson)
      map.data.setStyle((feature: google.maps.Data.Feature) => {
        const stateName = feature.getProperty('name') as string
        const isSelected = selectedStates.has(stateName)
        return {
          fillColor: isSelected ? 'blue' : 'white',
          strokeWeight: 0.8,
          strokeColor: 'black',
          title: stateName as string | undefined,
        }
      })

      // Add click listener for US states
      map.data.addListener('click', (event: google.maps.Data.MouseEvent) => {
        const feature = event.feature
        const name = feature.getProperty('name')
        setSelectedStates((prevSelectedStates) => {
          const newSelectedStates = new Set(prevSelectedStates)
          if (newSelectedStates.has(name as string)) {
            newSelectedStates.delete(name as string)
          } else {
            newSelectedStates.add(name as string)
          }
          map.data.revertStyle()
          map.data.setStyle((feature: google.maps.Data.Feature) => {
            const stateName = feature.getProperty('name')
            const isSelected = newSelectedStates.has(stateName as string)
            return {
              fillColor: isSelected ? 'blue' : 'white',
              strokeWeight: 0.8,
              strokeColor: 'black',
              title: stateName as string | undefined,
            }
          })
          return newSelectedStates
        })
      })

      // Add click listener for countries
      map.addListener('click', (event: google.maps.MapMouseEvent) => {
        const latLng = event.latLng
        if (!latLng) return
        const countryName = `Country at (${latLng.lat()}, ${latLng.lng()})` // Placeholder for country name

        setSelectedCountries((prevSelectedCountries) => {
          const newSelectedCountries = new Set(prevSelectedCountries)
          if (newSelectedCountries.has(countryName)) {
            newSelectedCountries.delete(countryName)
          } else {
            newSelectedCountries.add(countryName)
          }
          map.data.revertStyle()
          map.data.setStyle((feature: google.maps.Data.Feature) => {
            const featureCountryName = feature.getProperty('name') as string
            const isSelected = newSelectedCountries.has(featureCountryName)
            return {
              fillColor: isSelected ? 'green' : 'white',
              strokeWeight: 0.8,
              strokeColor: 'black',
              title: featureCountryName as string | undefined,
            }
          })
          return newSelectedCountries
        })
      })
    },
    [selectedStates, selectedCountries]
  )

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
        styles: mapStyle,
        disableDefaultUI: true,
      }}
      onLoad={onLoad}
    />
  )
}
