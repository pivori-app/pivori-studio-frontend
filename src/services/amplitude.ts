import * as amplitude from '@amplitude/analytics-browser'

/**
 * Amplitude Analytics Service
 * Using npm package instead of CDN for better CSP compliance
 */

interface AnalyticsConfig {
  apiKey: string
  userId?: string
  deviceId?: string
}

interface EventProperties {
  [key: string]: any
}

class AmplitudeService {
  private static instance: AmplitudeService
  private initialized = false

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): AmplitudeService {
    if (!AmplitudeService.instance) {
      AmplitudeService.instance = new AmplitudeService()
    }
    return AmplitudeService.instance
  }

  /**
   * Initialize Amplitude
   */
  async initialize(config: AnalyticsConfig): Promise<void> {
    try {
      if (this.initialized) {
        console.warn('⚠️ Amplitude already initialized')
        return
      }

      const { apiKey, userId, deviceId } = config

      if (!apiKey) {
        console.warn('⚠️ Amplitude API key not provided')
        return
      }

      // Initialize Amplitude
      await amplitude.init(apiKey, userId || undefined, {
        defaultTracking: {
          sessions: true,
          pageViews: true,
          formInteractions: true,
          fileDownloads: true
        },
        deviceId: deviceId || undefined,
        logLevel: process.env.NODE_ENV === 'development' ? 'Debug' : 'Warn'
      })

      this.initialized = true
      console.log('✅ Amplitude initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize Amplitude:', error)
    }
  }

  /**
   * Track event
   */
  trackEvent(eventName: string, properties?: EventProperties): void {
    try {
      if (!this.initialized) {
        console.warn('⚠️ Amplitude not initialized')
        return
      }

      amplitude.track(eventName, properties || {})
      console.log(`📊 Event tracked: ${eventName}`, properties)
    } catch (error) {
      console.error(`❌ Failed to track event ${eventName}:`, error)
    }
  }

  /**
   * Track page view
   */
  trackPageView(pageName: string, properties?: EventProperties): void {
    try {
      if (!this.initialized) {
        console.warn('⚠️ Amplitude not initialized')
        return
      }

      amplitude.track('Page View', {
        page_name: pageName,
        ...properties
      })
      console.log(`📄 Page view tracked: ${pageName}`)
    } catch (error) {
      console.error(`❌ Failed to track page view ${pageName}:`, error)
    }
  }

  /**
   * Track user action
   */
  trackUserAction(action: string, properties?: EventProperties): void {
    try {
      if (!this.initialized) {
        console.warn('⚠️ Amplitude not initialized')
        return
      }

      amplitude.track(`User ${action}`, properties || {})
      console.log(`👤 User action tracked: ${action}`, properties)
    } catch (error) {
      console.error(`❌ Failed to track user action ${action}:`, error)
    }
  }

  /**
   * Track error
   */
  trackError(errorData: { code: string; message: string; stack?: string }): void {
    try {
      if (!this.initialized) {
        console.warn('⚠️ Amplitude not initialized')
        return
      }

      amplitude.track('Error', {
        error_code: errorData.code,
        error_message: errorData.message,
        error_stack: errorData.stack
      })
      console.log('🚨 Error tracked:', errorData)
    } catch (error) {
      console.error('❌ Failed to track error:', error)
    }
  }

  /**
   * Set user ID
   */
  setUserId(userId: string): void {
    try {
      if (!this.initialized) {
        console.warn('⚠️ Amplitude not initialized')
        return
      }

      amplitude.setUserId(userId)
      console.log(`👤 User ID set: ${userId}`)
    } catch (error) {
      console.error('❌ Failed to set user ID:', error)
    }
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: EventProperties): void {
    try {
      if (!this.initialized) {
        console.warn('⚠️ Amplitude not initialized')
        return
      }

      // Track user properties as an event
      amplitude.track('User Properties', properties)
      console.log('🔧 User properties set:', properties)
    } catch (error) {
      console.error('❌ Failed to set user properties:', error)
    }
  }

  /**
   * Identify user
   */
  identify(userId: string, properties?: EventProperties): void {
    try {
      if (!this.initialized) {
        console.warn('⚠️ Amplitude not initialized')
        return
      }

      this.setUserId(userId)
      if (properties) {
        this.setUserProperties(properties)
      }
      console.log(`🔐 User identified: ${userId}`)
    } catch (error) {
      console.error('❌ Failed to identify user:', error)
    }
  }

  /**
   * Flush events
   */
  async flush(): Promise<void> {
    try {
      if (!this.initialized) {
        console.warn('⚠️ Amplitude not initialized')
        return
      }

      await amplitude.flush()
      console.log('✅ Events flushed')
    } catch (error) {
      console.error('❌ Failed to flush events:', error)
    }
  }

  /**
   * Get session ID
   */
  getSessionId(): number | null {
    try {
      if (!this.initialized) {
        return null
      }

      return amplitude.getSessionId()
    } catch (error) {
      console.error('❌ Failed to get session ID:', error)
      return null
    }
  }

  /**
   * Is initialized
   */
  isInitialized(): boolean {
    return this.initialized
  }
}

// Export singleton instance
export const amplitudeService = AmplitudeService.getInstance()

// Export initialize function
export const initAmplitude = async (config: AnalyticsConfig): Promise<void> => {
  await amplitudeService.initialize(config)
}

// Export tracking functions
export const trackEvent = (eventName: string, properties?: EventProperties): void => {
  amplitudeService.trackEvent(eventName, properties)
}

export const trackPageView = (pageName: string, properties?: EventProperties): void => {
  amplitudeService.trackPageView(pageName, properties)
}

export const trackUserAction = (action: string, properties?: EventProperties): void => {
  amplitudeService.trackUserAction(action, properties)
}

export const trackError = (errorData: { code: string; message: string; stack?: string }): void => {
  amplitudeService.trackError(errorData)
}

export const setUserId = (userId: string): void => {
  amplitudeService.setUserId(userId)
}

export const setUserProperties = (properties: EventProperties): void => {
  amplitudeService.setUserProperties(properties)
}

export const identifyUser = (userId: string, properties?: EventProperties): void => {
  amplitudeService.identify(userId, properties)
}

export const flushAmplitude = async (): Promise<void> => {
  await amplitudeService.flush()
}

export default amplitudeService

