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

interface selectedFeatures {
  ids: string[]
  continents: Set<string>
  countries: Set<string>
  states: Set<string>
}

export const Map = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  })
  const [isPanelExpanded, setIsPanelExpanded] = useState([false, false, false])
  const [selectedFeatures, setSelectedFeatures] = useState<selectedFeatures>({
    ids: [],
    continents: new Set(),
    countries: new Set(),
    states: new Set(),
  })
  const mapRef = useRef<google.maps.Map | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [featuresLoaded, setFeaturesLoaded] = useState(false)

  const onFeatureClick = (
    feature: google.maps.Data.Feature,
    map: google.maps.Map
  ) => {
    const featureId = feature.getId() as string
    const featureName = feature.getProperty('name') as string
    const featureType = feature.getProperty('type') as string
    const featureContinent = feature.getProperty('continent') as string
    const featureCountry = feature.getProperty('country') as string

    setSelectedFeatures((prevSelectedFeatures: selectedFeatures) => {
      const featureIndex = prevSelectedFeatures.ids.indexOf(featureId)
      const newContinents = new Set(prevSelectedFeatures.continents)
      const newCountries = new Set(prevSelectedFeatures.countries)
      const newStates = new Set(prevSelectedFeatures.states)

      if (featureIndex > -1) {
        map.data.revertStyle(feature)
        newStates.delete(featureName)

        const remainingStatesInCountry = prevSelectedFeatures.ids.some(
          (stateId: string) => {
            const stateFeature = map.data.getFeatureById(stateId)
            return (
              stateFeature &&
              stateFeature.getProperty('country') === featureCountry &&
              stateFeature.getProperty('name') !== featureName
            )
          }
        )

        if (!remainingStatesInCountry) {
          newCountries.delete(featureCountry)
        }

        const remainingCountriesInContinent = prevSelectedFeatures.ids.some(
          (countryId: string) => {
            const countryFeature = map.data.getFeatureById(countryId)
            return (
              countryFeature &&
              countryFeature.getProperty('continent') === featureContinent &&
              countryFeature.getProperty('country') !== featureCountry
            )
          }
        )

        const remainingStatesInContinent = prevSelectedFeatures.ids.some(
          (stateId: string) => {
            const stateFeature = map.data.getFeatureById(stateId)
            return (
              stateFeature &&
              stateFeature.getProperty('continent') === featureContinent &&
              stateFeature.getProperty('name') !== featureName
            )
          }
        )

        if (!remainingCountriesInContinent && !remainingStatesInContinent) {
          newContinents.delete(featureContinent)
        }

        const updatedSelectedFeatures = {
          ids: prevSelectedFeatures.ids.filter(
            (id: string) => id !== featureId
          ),
          continents: newContinents,
          countries: newCountries,
          states: newStates,
        }

        onPanelEmptyClose(updatedSelectedFeatures)
        return updatedSelectedFeatures
      } else {
        if (featureContinent) newContinents.add(featureContinent)
        if (featureCountry) newCountries.add(featureCountry)
        if (featureType === 'state') newStates.add(featureName)

        map.data.overrideStyle(feature, {
          fillColor: '#2E6F40',
          fillOpacity: 0.6,
        })

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
      selectedFeatures.ids.forEach((featureId: string) => {
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
    setIsPanelExpanded([false, false, false])
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

  const onPanelEmptyClose = (updatedSelectedFeatures: selectedFeatures) => {
    if (updatedSelectedFeatures.continents.size === 0) {
      setIsPanelExpanded((prevIsPanelExpanded) => {
        const updatedIsPanelExpanded = [...prevIsPanelExpanded]
        updatedIsPanelExpanded[0] = false
        return updatedIsPanelExpanded
      })
    }
    if (updatedSelectedFeatures.countries.size === 0) {
      setIsPanelExpanded((prevIsPanelExpanded) => {
        const updatedIsPanelExpanded = [...prevIsPanelExpanded]
        updatedIsPanelExpanded[1] = false
        return updatedIsPanelExpanded
      })
    }
    if (updatedSelectedFeatures.states.size === 0) {
      setIsPanelExpanded((prevIsPanelExpanded) => {
        const updatedIsPanelExpanded = [...prevIsPanelExpanded]
        updatedIsPanelExpanded[2] = false
        return updatedIsPanelExpanded
      })
    }
  }

  const onPanelExpandChange = (index: number) => {
    setIsPanelExpanded((prevIsPanelExpanded) => {
      const updatedIsPanelExpanded = [...prevIsPanelExpanded]
      updatedIsPanelExpanded[index] = !updatedIsPanelExpanded[index]
      return updatedIsPanelExpanded
    })
  }

  const styleSelectedCountriesInitial = useCallback(
    (map: google.maps.Map) => {
      selectedFeatures.ids.forEach((featureId: string) => {
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

  useEffect(() => {
    if (!user) return

    const loadSelectedFeatures = async (userId: string) => {
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
        setFeaturesLoaded(true)
      }
    }

    loadSelectedFeatures(user.uid)
  }, [user])

  useEffect(() => {
    if (mapRef.current && featuresLoaded) {
      styleSelectedCountriesInitial(mapRef.current)
    }
  }, [styleSelectedCountriesInitial, featuresLoaded])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [])

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col space-y-4 px-2 lg:px-10 flex-grow">
      <GoogleMap
        center={center}
        mapContainerClassName="min-h-[70vh] md:min-h-[40vh] flex-grow w-full"
        zoom={2.5}
        options={{
          clickableIcons: false,
          disableDefaultUI: true,
          mapId,
        }}
        onLoad={(map) => {
          mapRef.current = map
          map.data.loadGeoJson('/assets/combined-final.geojson')

          map.data.setStyle(() => ({
            strokeColor: '#000000',
            strokeWeight: 0.7,
            fillColor: 'transparent',
          }))

          if (featuresLoaded) {
            styleSelectedCountriesInitial(map)
          }

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
      <CountPanels
        isPanelExpanded={isPanelExpanded}
        onPanelExpandChange={onPanelExpandChange}
        selectedFeatures={selectedFeatures}
      />
    </div>
  )
}
