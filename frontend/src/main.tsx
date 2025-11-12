import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
import './styles/app.css'
import { initAmplitude } from './services/amplitude'
import { usePerformanceOptimization, preloadCriticalResources } from './hooks/usePerformanceOptimization'
import { useAccessibility, addAutocompleteAttributes } from './hooks/useAccessibility'

// Initialiser Amplitude (npm package)
try {
  const amplitudeKey = (import.meta.env as Record<string, unknown>).VITE_AMPLITUDE_KEY as string
  if (amplitudeKey) {
    initAmplitude({
      apiKey: amplitudeKey
    }).then(() => {
      console.log('✅ Amplitude initialized (npm package)')
    }).catch((error) => {
      console.error('❌ Failed to initialize Amplitude:', error)
    })
  } else {
    console.warn('⚠️ Amplitude API key not found in environment')
  }
} catch (error) {
  console.error('❌ Failed to initialize Amplitude:', error)
}

// Optimiser les performances
try {
  preloadCriticalResources()
  console.log('✅ Performance optimization initialized')
} catch (error) {
  console.error('❌ Failed to initialize performance optimization:', error)
}

// Améliorer l'accessibilité
try {
  addAutocompleteAttributes()
  console.log('✅ Accessibility improvements applied')
} catch (error) {
  console.error('❌ Failed to apply accessibility improvements:', error)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

