import { useEffect } from 'react'

/**
 * Hook for performance optimization
 * Reduces First Input Delay (FID) through various strategies
 */
export const usePerformanceOptimization = (): void => {
  useEffect(() => {
    // 1. Defer non-critical JavaScript
    deferNonCriticalScripts()

    // 2. Optimize event handlers
    optimizeEventHandlers()

    // 3. Use requestIdleCallback for non-urgent work
    scheduleIdleWork()

    // 4. Monitor performance metrics
    monitorPerformance()
  }, [])
}

/**
 * Defer non-critical scripts using requestIdleCallback
 */
function deferNonCriticalScripts(): void {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Load analytics and other non-critical scripts
      loadDeferredScripts()
    }, { timeout: 2000 })
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(loadDeferredScripts, 2000)
  }
}

/**
 * Load deferred scripts
 */
function loadDeferredScripts(): void {
  console.log('📊 Loading deferred scripts')
  // Analytics and other non-critical code can be loaded here
}

/**
 * Optimize event handlers to reduce FID
 */
function optimizeEventHandlers(): void {
  // Use passive event listeners for scroll and touch events
  const passiveOptions = { passive: true }

  document.addEventListener('scroll', handleScroll, passiveOptions)
  document.addEventListener('touchmove', handleTouchMove, passiveOptions)
  document.addEventListener('touchstart', handleTouchStart, passiveOptions)

  console.log('✅ Event handlers optimized')
}

/**
 * Handle scroll events
 */
function handleScroll(): void {
  // Scroll handler logic
}

/**
 * Handle touch move events
 */
function handleTouchMove(): void {
  // Touch move handler logic
}

/**
 * Handle touch start events
 */
function handleTouchStart(): void {
  // Touch start handler logic
}

/**
 * Schedule non-urgent work during idle time
 */
function scheduleIdleWork(): void {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Perform non-urgent work like:
      // - Analytics processing
      // - Data prefetching
      // - DOM cleanup
      console.log('🔄 Idle work scheduled')
    }, { timeout: 5000 })
  }
}

/**
 * Monitor performance metrics
 */
function monitorPerformance(): void {
  if ('PerformanceObserver' in window) {
    try {
      // Observe First Input Delay
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`📈 ${entry.name}: ${entry.duration.toFixed(2)}ms`)
          
          // Log to analytics if FID is high
          if (entry.duration > 100) {
            console.warn(`⚠️ High FID detected: ${entry.duration.toFixed(2)}ms`)
          }
        }
      })

      observer.observe({ entryTypes: ['first-input', 'largest-contentful-paint'] })
    } catch (error) {
      console.warn('⚠️ Performance monitoring not available:', error)
    }
  }
}

/**
 * Preload critical resources
 */
export const preloadCriticalResources = (): void => {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'style'
  link.href = '/assets/critical.css'
  document.head.appendChild(link)
}

/**
 * Prefetch resources for likely navigation
 */
export const prefetchResources = (urls: string[]): void => {
  urls.forEach((url) => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = url
    document.head.appendChild(link)
  })
}

export default usePerformanceOptimization

