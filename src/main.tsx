import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ChakraProvider, theme } from '@chakra-ui/react'

createRoot(document.getElementById('root')!).render(
  <>
    <meta httpEquiv="Cross-Origin-Opener-Policy" content="same-origin" />
    <StrictMode>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </StrictMode>
  </>
)
