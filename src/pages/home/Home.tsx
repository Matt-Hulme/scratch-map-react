import { Map } from './Map'

export const Home = () => {
  return (
    <div className="bg-[#2e6f40] h-[100vh] flex flex-col items-center justify-center space-y-10 relative py-4">
      <h1 className="text-white text-6xl">Scratch Map</h1>
      <Map />
    </div>
  )
}
