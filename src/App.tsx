import { useEffect, useState } from 'react'
import { User } from 'firebase/auth'
import { auth } from './config/firebase/firebaseConfig'
import { Login } from './common/pages/login'
import { Home } from './common/pages/home/Home'

export const App = () => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [])

  if (user === null) return <Login />

  return <main>{user ? <Home /> : <Login />}</main>
}

export default App
