import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleSettingsClick = () => {
    navigate('/settings')
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">✦</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pivori Studio
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex gap-8 items-center">
            <li>
              <Link 
                to="/" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Tableau de bord
              </Link>
            </li>
            <li>
              <Link 
                to="/applications" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Applications
              </Link>
            </li>
            <li>
              <Link 
                to="/connecteurs" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Connecteurs
              </Link>
            </li>
            <li>
              <Link 
                to="/connaissances" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Connaissances
              </Link>
            </li>
            <li>
              <Link 
                to="/services" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Services
              </Link>
            </li>
            <li>
              <Link 
                to="/settings" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Paramètres
              </Link>
            </li>
          </ul>

          {/* Settings Icon */}
          <button
            onClick={handleSettingsClick}
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Paramètres"
            title="Paramètres"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex flex-col gap-1.5 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Menu mobile"
            aria-expanded={isMobileMenuOpen}
          >
            <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <ul className="md:hidden flex flex-col gap-4 mt-4 pt-4 border-t border-gray-200">
            <li>
              <Link 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 block py-2"
              >
                Tableau de bord
              </Link>
            </li>
            <li>
              <Link 
                to="/applications" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 block py-2"
              >
                Applications
              </Link>
            </li>
            <li>
              <Link 
                to="/connecteurs" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 block py-2"
              >
                Connecteurs
              </Link>
            </li>
            <li>
              <Link 
                to="/connaissances" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 block py-2"
              >
                Connaissances
              </Link>
            </li>
            <li>
              <Link 
                to="/services" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 block py-2"
              >
                Services
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  handleSettingsClick()
                  setIsMobileMenuOpen(false)
                }}
                className="w-full text-left text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 block py-2"
              >
                Paramètres
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  )
}

