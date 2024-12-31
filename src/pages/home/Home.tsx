import { Map } from './Map'

export const Home = () => {
  return (
    <div className="bg-[#2e6f40] h-screen overflow-y-auto space-y-4 relative text-white px-2 text-center pb-2 md:pt-5">
      <h1 className="h2 lg:h1">Where Have You Been?</h1>
      <Map />
    </div>
  )
}
