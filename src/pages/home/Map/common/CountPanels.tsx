import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { Divider, IconButton, List, ListItem } from '@chakra-ui/react'
import { Feature, FeatureCollection } from 'geojson'
import { useEffect, useState } from 'react'

interface CountPanelsProps {
  selectedFeatures: {
    ids: string[]
    continents: Set<string>
    countries: Set<string>
    states: Set<string>
  }
}

export const CountPanels = ({ selectedFeatures }: CountPanelsProps) => {
  const [isPanelExpanded, setIsPanelExpanded] = useState([false, false, false])
  const [selectedContinentCount, setSelectedContinentCount] = useState(0)
  const [selectedCountryCount, setSelectedCountryCount] = useState(0)
  const [selectedStateCount, setSelectedStateCount] = useState(0)

  const onPanelExpand = (index: number) => {
    setIsPanelExpanded((prevIsPanelExpanded) => {
      const updatedIsPanelExpanded = [...prevIsPanelExpanded]
      updatedIsPanelExpanded[index] = !updatedIsPanelExpanded[index]
      return updatedIsPanelExpanded
    })
  }

  // Fetch and parse the GeoJSON data to determine counts
  useEffect(() => {
    const fetchGeoJsonData = async () => {
      const response = await fetch('assets/combined-final.geojson')
      const geoJson: FeatureCollection = await response.json()
      const continents = new Set<string>()
      const countries = new Set<string>()
      const states = new Set<string>()

      geoJson.features.forEach((feature: Feature) => {
        const featureId = feature.id as string
        if (selectedFeatures.ids.includes(featureId)) {
          const properties = feature?.properties ?? {}
          const type = properties?.type
          const name = properties?.name
          const continent = properties.Continent
          if (continent) {
            continents.add(continent)
          }
          const country = properties.Country
          if (country) {
            countries.add(country)
          }
          if (type === 'State') {
            states.add(name)
            console.log('type === State', name)
          } else {
            console.log('type !== State', name)
          }
        }
      })

      setSelectedContinentCount(continents.size)
      setSelectedCountryCount(countries.size)
      setSelectedStateCount(states.size)
    }
    fetchGeoJsonData()
  }, [selectedFeatures])

  return (
    <div className="md:min-w-[300px] lg:min-w-[700px] min-w-[200px] flex flex-col lg:flex-row lg:justify-between lg:space-y-0 space-y-4 justify-self-center lg:space-x-4 text-black">
      <div className="bg-white rounded-md p-2 flex-1 flex flex-col h-fit">
        <span className="h2">{`Continents: ${selectedContinentCount}`}</span>
        <Divider />
        <IconButton
          variant="unstyled"
          aria-label="See selected Continents list"
          className="lg:w-fit self-center"
          icon={isPanelExpanded[0] ? <ChevronDownIcon /> : <ChevronUpIcon />}
          onClick={() => onPanelExpand(0)}
        />
        <List>
          {isPanelExpanded[0] &&
            Array.from(selectedFeatures.continents).map((name) => (
              <ListItem key={name}>
                <span className="line-clamp-1">{name}</span>
              </ListItem>
            ))}
        </List>
      </div>
      <div className="bg-white rounded-md p-2 flex-1 flex flex-col h-fit">
        <span className="h2">{`Countries: ${selectedCountryCount}`}</span>
        <Divider />
        <IconButton
          variant="unstyled"
          aria-label="See selected Countries list"
          className="lg:w-fit self-center"
          icon={isPanelExpanded[1] ? <ChevronDownIcon /> : <ChevronUpIcon />}
          onClick={() => onPanelExpand(1)}
        />
        <List>
          {isPanelExpanded[1] &&
            Array.from(selectedFeatures.countries).map((name) => (
              <ListItem key={name}>
                <span className="line-clamp-1">{name}</span>
              </ListItem>
            ))}
        </List>
      </div>
      <div className="bg-white rounded-md p-2 flex-1 flex flex-col h-fit">
        <span className="h2">{`States: ${selectedStateCount}`}</span>
        <Divider />
        <IconButton
          variant="unstyled"
          aria-label="See selected States list"
          className="lg:w-fit self-center"
          icon={isPanelExpanded[2] ? <ChevronDownIcon /> : <ChevronUpIcon />}
          onClick={() => onPanelExpand(2)}
        />
        <List>
          {isPanelExpanded[2] &&
            Array.from(selectedFeatures.states).map((name) => (
              <ListItem key={name}>
                <span className="line-clamp-1">{name}</span>
              </ListItem>
            ))}
        </List>
      </div>
    </div>
  )
}
