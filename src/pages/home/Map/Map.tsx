import { useState, useEffect, useRef, useCallback } from 'react'
import { GoogleMap, useLoadScript } from '@react-google-maps/api'
import { ref, get, set } from 'firebase/database'
import { database, auth } from '../../../config/firebase/firebaseConfig'
import { CountPanels, MapActions } from './common'
import { User } from 'firebase/auth'

const center = {
  lat: 32,
  lng: 16,
}

const mapId = import.meta.env.VITE_GOOGLE_MAP_ID as string

export const Map = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  })
  const [selectedFeatures, setSelectedFeatures] = useState<{
    ids: string[]
    continents: Set<string>
    countries: Set<string>
    states: Set<string>
  }>({
    ids: [],
    continents: new Set(),
    countries: new Set(),
    states: new Set(),
  })
  const mapRef = useRef<google.maps.Map | null>(null)
  const [user, setUser] = useState<User | null>(null)

  const onFeatureClick = (
    feature: google.maps.Data.Feature,
    map: google.maps.Map
  ) => {
    const featureId = feature.getId() as string
    const featureName = feature.getProperty('name') as string
    const featureType = feature.getProperty('type') as string
    const featureContinent = feature.getProperty('Continent') as string
    const featureCountry = feature.getProperty('Country') as string

    setSelectedFeatures((prevSelectedFeatures) => {
      const featureIndex = prevSelectedFeatures.ids.indexOf(featureId)
      const newContinents = new Set(prevSelectedFeatures.continents)
      const newCountries = new Set(prevSelectedFeatures.countries)
      const newStates = new Set(prevSelectedFeatures.states)

      if (featureIndex > -1) {
        map.data.revertStyle(feature)
        newStates.delete(featureName)

        const remainingStatesInCountry = prevSelectedFeatures.ids.some(
          (stateId) => {
            const stateFeature = map.data.getFeatureById(stateId)
            return (
              stateFeature &&
              stateFeature.getProperty('Country') === featureCountry &&
              stateFeature.getProperty('name') !== featureName
            )
          }
        )

        if (!remainingStatesInCountry) {
          newCountries.delete(featureCountry)
        }

        const remainingCountriesInContinent = prevSelectedFeatures.ids.some(
          (countryId) => {
            const countryFeature = map.data.getFeatureById(countryId)
            return (
              countryFeature &&
              countryFeature.getProperty('Continent') === featureContinent &&
              countryFeature.getProperty('Country') !== featureCountry
            )
          }
        )

        const remainingStatesInContinent = prevSelectedFeatures.ids.some(
          (stateId) => {
            const stateFeature = map.data.getFeatureById(stateId)
            return (
              stateFeature &&
              stateFeature.getProperty('Continent') === featureContinent &&
              stateFeature.getProperty('name') !== featureName
            )
          }
        )

        if (!remainingCountriesInContinent && !remainingStatesInContinent) {
          newContinents.delete(featureContinent)
        }

        return {
          ids: prevSelectedFeatures.ids.filter((id) => id !== featureId),
          continents: newContinents,
          countries: newCountries,
          states: newStates,
        }
      } else {
        if (featureContinent) newContinents.add(featureContinent)
        if (featureCountry) newCountries.add(featureCountry)
        if (featureType === 'State') newStates.add(featureName)
        return {
          ids: [...prevSelectedFeatures.ids, featureId],
          continents: newContinents,
          countries: newCountries,
          states: newStates,
        }
      }
    })
  }

  const onMapClear = () => {
    if (mapRef.current) {
      selectedFeatures.ids.forEach((featureId) => {
        const feature = mapRef.current?.data.getFeatureById(featureId)
        if (feature) {
          mapRef.current?.data.revertStyle(feature)
        }
      })
    }
    setSelectedFeatures({
      ids: [],
      continents: new Set(),
      countries: new Set(),
      states: new Set(),
    })
  }

  const onMapSave = async () => {
    const userId = auth.currentUser?.uid
    if (userId) {
      await set(ref(database, `users/${userId}`), {
        ...selectedFeatures,
        continents: Array.from(selectedFeatures.continents),
        countries: Array.from(selectedFeatures.countries),
        states: Array.from(selectedFeatures.states),
      })
      alert('Map saved!')
    }
  }

  const styleSelectedCountriesInitial = useCallback(
    (map: google.maps.Map) => {
      selectedFeatures.ids.forEach((featureId) => {
        const feature = map.data.getFeatureById(featureId)
        if (feature) {
          map.data.overrideStyle(feature, {
            fillColor: '#2E6F40',
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
          const data = snapshot.val()
          setSelectedFeatures({
            ids: data.ids,
            continents: new Set(data.continents),
            countries: new Set(data.countries),
            states: new Set(data.states),
          })
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

  // Auth useEffect
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [])

  if (!isLoaded) {
    return (
      <div className="bg-[#2e6f40] h-[100vh] flex flex-col items-center justify-center space-y-10 relative">
        <div>Loading Map...</div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4 px-2 lg:px-10">
      <GoogleMap
        center={center}
        mapContainerClassName="h-[60vh] w-[80vw] justify-self-center"
        zoom={2}
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
                onFeatureClick(event.feature, map)
              }
            }
          )
        }}
      />
      <MapActions onMapClear={onMapClear} onMapSave={onMapSave} user={user} />
      <CountPanels selectedFeatures={selectedFeatures} />
    </div>
  )
}
