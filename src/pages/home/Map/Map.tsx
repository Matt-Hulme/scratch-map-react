import { useState, useEffect, useRef, useCallback } from 'react'
import { GoogleMap, useLoadScript } from '@react-google-maps/api'
import { ref, get, set } from 'firebase/database'
import { database, auth } from '../../../config/firebase/firebaseConfig'
import { FeatureCollection, Feature } from 'geojson'

const center = {
  lat: 39.8283,
  lng: -98.5795,
}

const mapId = import.meta.env.VITE_GOOGLE_MAP_ID as string

const mapContainerStyle = {
  width: '80%',
  height: '80%',
}

export const Map = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  })
  const [continentCount, setContinentCount] = useState(0)
  const [selectedFeatures, setSelectedFeatures] = useState<{
    ids: string[]
    names: string[]
  }>({ ids: [], names: [] })
  const mapRef = useRef<google.maps.Map | null>(null)

  const onClear = () => {
    if (mapRef.current) {
      selectedFeatures.ids.forEach((featureId) => {
        const feature = mapRef.current?.data.getFeatureById(featureId)
        if (feature) {
          mapRef.current?.data.revertStyle(feature)
        }
      })
    }
    setSelectedFeatures({ ids: [], names: [] })
  }

  const onSave = async () => {
    const userId = auth.currentUser?.uid
    if (userId) {
      await set(ref(database, `users/${userId}`), selectedFeatures)
      alert('Selections saved!')
    }
  }

  const styleSelectedCountriesInitial = useCallback(
    (map: google.maps.Map) => {
      selectedFeatures.ids.forEach((featureId) => {
        const feature = map.data.getFeatureById(featureId)
        if (feature) {
          map.data.overrideStyle(feature, {
            fillColor: '#FF0000',
            fillOpacity: 0.6,
          })
        }
      })
    },
    [selectedFeatures.ids]
  )

  // Load selected features from database
  useEffect(() => {
    const loadSelectedFeatures = async () => {
      const userId = auth?.currentUser?.uid
      if (userId) {
        const dbRef = ref(database, `users/${userId}`)
        const snapshot = await get(dbRef)
        if (snapshot.exists()) {
          setSelectedFeatures(snapshot.val())
        }
      }
    }
    loadSelectedFeatures()
  }, [])

  // Style selected countries on initial load
  useEffect(() => {
    if (mapRef.current) {
      styleSelectedCountriesInitial(mapRef.current)
    }
  }, [styleSelectedCountriesInitial])

  // Fetch and parse the GeoJSON data
  useEffect(() => {
    const fetchGeoJsonData = async () => {
      const response = await fetch('/src/assets/combined-final.geojson')
      const geoJson: FeatureCollection = await response.json()
      const continents = new Set<string>()

      geoJson.features.forEach((feature: Feature) => {
        const featureId = feature.id as string
        if (selectedFeatures.ids.includes(featureId)) {
          const properties = feature?.properties ?? {}
          const continent = properties.Continent
          if (continent) {
            continents.add(continent)
          }
        }
      })

      setContinentCount(continents.size)
    }
    fetchGeoJsonData()
  }, [selectedFeatures])

  if (!isLoaded) {
    return (
      <div className="bg-[#2e6f40] h-[100vh] flex flex-col items-center justify-center space-y-10 relative">
        <div>Loading Map...</div>
      </div>
    )
  }

  const onSelectCountry = (
    feature: google.maps.Data.Feature,
    map: google.maps.Map
  ) => {
    const featureId = feature.getId() as string
    const featureName = feature.getProperty('name') as string

    setSelectedFeatures((prevSelectedFeatures) => {
      const featureIndex = prevSelectedFeatures.ids.indexOf(featureId)
      if (featureIndex > -1) {
        map.data.revertStyle(feature)
        return {
          ids: prevSelectedFeatures.ids.filter((id) => id !== featureId),
          names: prevSelectedFeatures.names.filter(
            (name) => name !== featureName
          ),
        }
      } else {
        map.data.overrideStyle(feature, {
          fillColor: '#FF0000',
          fillOpacity: 0.6,
        })
        return {
          ids: [...prevSelectedFeatures.ids, featureId],
          names: [...prevSelectedFeatures.names, featureName],
        }
      }
    })
  }

  return (
    <>
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
          mapRef.current = map
          map.data.loadGeoJson('/src/assets/combined-final.geojson')

          map.data.setStyle(() => ({
            strokeColor: '#000000',
            strokeWeight: 0.7,
            fillColor: 'transparent',
          }))

          styleSelectedCountriesInitial(map)

          map.data.addListener(
            'click',
            (event: google.maps.Data.MouseEvent) => {
              if (event.feature) {
                onSelectCountry(event.feature, map)
              }
            }
          )
        }}
      />
      <div className="min-w-[25%] flex flex-row items-center justify-between">
        <div className="bg-white p-2 rounded-md">
          <h3 className="text-black">{`Continents: ${continentCount}`}</h3>
          <button
            className="bg-white rounded-md border-black border-[2px] border-solid w-[125px] py-1"
            onClick={() => {}}
          ></button>
        </div>
      </div>
      <div className="min-w-[25%] flex flex-row items-center justify-between">
        <button
          className="bg-red-300 rounded-md border-black border-[2px] border-solid w-[125px] py-1"
          onClick={onClear}
        >
          Clear
        </button>
        <button
          className="bg-green-400 rounded-md border-black border-[2px] border-solid w-[125px] py-1"
          onClick={onSave}
        >
          Save
        </button>
      </div>
    </>
  )
}
