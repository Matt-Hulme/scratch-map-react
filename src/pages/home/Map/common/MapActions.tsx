import { Button } from '@chakra-ui/react'
import { User } from 'firebase/auth'
import { firebaseGoogleSignIn } from '../../../../config/firebase/firebaseConfig'

interface MapActions {
  onMapClear: VoidFunction
  onMapSave: VoidFunction
  user: User | null
}

export const MapActions = ({ onMapClear, onMapSave, user }: MapActions) => (
  <div className="lg:w-[350px] w-[200px] mx-auto flex flex-row items-center justify-between min-h-[48px]">
    <Button colorScheme="red" size="lg" onClick={onMapClear}>
      Clear
    </Button>
    <Button
      colorScheme="green"
      size="lg"
      onClick={user ? onMapSave : firebaseGoogleSignIn}
    >
      Save
    </Button>
  </div>
)
