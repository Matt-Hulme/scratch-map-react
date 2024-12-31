import { Map } from './Map'

export const Home = () => {
  return (
    <div className="bg-[#2e6f40] min-h-screen flex flex-col space-y-4 text-white px-2 text-center pt-2 pb-4 md:pt-5 md:pb-10">
      <h1 className="h2 lg:h1">Where Have You Been?</h1>
      <div className="flex-grow flex flex-col">
        <Map />
      </div>
    </div>
  )
}
