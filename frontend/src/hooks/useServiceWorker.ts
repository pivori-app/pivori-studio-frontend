import { useEffect } from 'react'

/**
 * Hook for Service Worker registration
 * Enables offline support and caching
 */
export const useServiceWorker = (): void => {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      console.warn('⚠️ Service Workers not supported')
      return
    }

    const registerServiceWorker = async (): Promise<void> => {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js', {
          scope: '/'
        })
        
        console.log('✅ Service Worker registered:', registration)

        // Check for updates periodically
        setInterval(() => {
          registration.update()
        }, 60000) // Check every minute

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (!newWorker) return

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('✅ New Service Worker available')
              // Notify user about update
              notifyUpdate()
            }
          })
        })
      } catch (error) {
        console.error('❌ Service Worker registration failed:', error)
      }
    }

    // Register on component mount
    registerServiceWorker()
  }, [])
}

/**
 * Notify user about Service Worker update
 */
function notifyUpdate(): void {
  const message = document.createElement('div')
  message.className = 'fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded shadow-lg z-50'
  message.innerHTML = `
    <p class="mb-2">Une nouvelle version est disponible</p>
    <button onclick="window.location.reload()" class="bg-white text-blue-600 px-4 py-1 rounded font-semibold">
      Recharger
    </button>
  `
  document.body.appendChild(message)

  // Auto-remove after 10 seconds
  setTimeout(() => {
    message.remove()
  }, 10000)
}

export default useServiceWorker

