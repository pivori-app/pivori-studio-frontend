import React, { ReactNode, ReactElement } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Error Boundary Component
 * Captures React errors and displays fallback UI
 */
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('❌ Error caught by boundary:', error, errorInfo)
    
    // Log to error tracking service
    try {
      const { getAnalytics } = require('@/services/analytics')
      const analytics = getAnalytics()
      analytics.trackError({
        code: 'REACT_ERROR',
        message: error.message
      })
    } catch (e) {
      console.error('Failed to log error:', e)
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): ReactElement {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">
                ⚠️ Oups! Une erreur s'est produite
              </h1>
              <p className="text-gray-600 mb-6">
                L'application a rencontré une erreur inattendue. Veuillez réessayer.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-6 text-left bg-gray-100 p-4 rounded">
                  <summary className="cursor-pointer font-mono text-sm text-red-600">
                    Détails de l'erreur (développement)
                  </summary>
                  <pre className="mt-2 text-xs overflow-auto max-h-40 text-gray-700">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
              
              <button
                onClick={this.handleReset}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
              >
                Réessayer
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children as ReactElement
  }
}

export default ErrorBoundary

