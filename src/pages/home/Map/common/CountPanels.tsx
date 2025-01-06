import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { Divider, IconButton, List, ListItem } from '@chakra-ui/react'
import { Feature, FeatureCollection } from 'geojson'
import { useEffect, useState } from 'react'

interface CountPanelsProps {
  isPanelExpanded: boolean[]
  onPanelExpandChange: (index: number) => void
  selectedFeatures: {
    ids: string[]
    continents: Set<string>
    countries: Set<string>
    states: Set<string>
  }
}

export const CountPanels = ({
  isPanelExpanded,
  onPanelExpandChange,
  selectedFeatures,
}: CountPanelsProps) => {
  const [selectedContinentCount, setSelectedContinentCount] = useState(0)
  const [selectedCountryCount, setSelectedCountryCount] = useState(0)
  const [selectedStateCount, setSelectedStateCount] = useState(0)

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
          const featureType = properties?.type
          const name = properties?.name
          const continent = properties.Continent
          if (continent) {
            continents.add(continent)
          }
          const country = properties.Country
          if (country) {
            countries.add(country)
          }
          if (featureType === 'State') {
            states.add(name)
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
    <div className="md:w-[600px] lg:w-[700px] w-[200px] min-h-[90px] flex flex-col md:flex-row md:justify-between md:space-y-0 space-y-4 self-center md:space-x-4 text-black overflow-y-hidden md:self-center">
      <div
        className={`bg-white rounded-md flex-1 flex flex-col ${
          !isPanelExpanded[0] && 'h-fit'
        }`}
      >
        <span className="h2">{`Continents: ${selectedContinentCount}`}</span>
        {!!selectedContinentCount && (
          <>
            <Divider />
            <IconButton
              variant="unstyled"
              aria-label="See selected Continents list"
              className="lg:w-fit self-center"
              icon={
                isPanelExpanded[0] ? <ChevronUpIcon /> : <ChevronDownIcon />
              }
              onClick={() => onPanelExpandChange(0)}
            />
            {isPanelExpanded[0] && (
              <List className="max-h-[125px] md:h-[125px] overflow-y-auto">
                {Array.from(selectedFeatures.continents).map((name) => (
                  <ListItem key={name}>
                    <span className="line-clamp-1">{name}</span>
                  </ListItem>
                ))}
              </List>
            )}
          </>
        )}
      </div>
      <div
        className={`bg-white rounded-md flex-1 flex flex-col ${
          !isPanelExpanded[1] && 'h-fit'
        }`}
      >
        <span className="h2">{`Countries: ${selectedCountryCount}`}</span>
        {!!selectedCountryCount && (
          <>
            <Divider />
            <IconButton
              variant="unstyled"
              aria-label="See selected Countries list"
              className="lg:w-fit self-center"
              icon={
                isPanelExpanded[1] ? <ChevronUpIcon /> : <ChevronDownIcon />
              }
              onClick={() => onPanelExpandChange(1)}
            />
            {isPanelExpanded[1] && (
              <List className="max-h-[125px] md:h-[125px] overflow-y-auto">
                {Array.from(selectedFeatures.countries).map((name) => (
                  <ListItem key={name}>
                    <span className="line-clamp-1">{name}</span>
                  </ListItem>
                ))}
              </List>
            )}
          </>
        )}
      </div>
      <div
        className={`bg-white rounded-md flex-1 flex flex-col h-full ${
          !isPanelExpanded[2] && 'h-fit'
        }`}
      >
        <span className="h2">{`States: ${selectedStateCount}`}</span>
        {!!selectedStateCount && (
          <>
            <Divider />
            <IconButton
              variant="unstyled"
              aria-label="See selected States list"
              className="lg:w-fit self-center"
              icon={
                isPanelExpanded[2] ? <ChevronUpIcon /> : <ChevronDownIcon />
              }
              onClick={() => onPanelExpandChange(2)}
            />
            {isPanelExpanded[2] && (
              <List className="max-h-[125px] md:h-[125px] overflow-y-auto">
                {Array.from(selectedFeatures.states).map((name) => (
                  <ListItem key={name}>
                    <span className="line-clamp-1">{name}</span>
                  </ListItem>
                ))}
              </List>
            )}
          </>
        )}
      </div>
    </div>
  )
}
