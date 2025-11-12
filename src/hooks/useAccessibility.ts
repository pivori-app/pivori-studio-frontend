import { useEffect } from 'react'

/**
 * Hook for WCAG 2.1 AA accessibility improvements
 */
export const useAccessibility = (): void => {
  useEffect(() => {
    // 1. Add skip-to-content link
    addSkipToContentLink()

    // 2. Improve keyboard navigation
    improveKeyboardNavigation()

    // 3. Add ARIA labels
    addAriaLabels()

    // 4. Ensure focus management
    manageFocus()

    // 5. Add live regions for dynamic content
    setupLiveRegions()

    console.log('✅ Accessibility improvements applied')
  }, [])
}

/**
 * Add skip-to-content link for keyboard users
 */
function addSkipToContentLink(): void {
  const skipLink = document.createElement('a')
  skipLink.href = '#main-content'
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-blue-600 focus:text-white'
  skipLink.textContent = 'Aller au contenu principal'
  document.body.insertBefore(skipLink, document.body.firstChild)
}

/**
 * Improve keyboard navigation
 */
function improveKeyboardNavigation(): void {
  document.addEventListener('keydown', (event) => {
    // Tab key navigation
    if (event.key === 'Tab') {
      document.body.classList.add('keyboard-nav')
    }

    // Escape key to close modals
    if (event.key === 'Escape') {
      const modal = document.querySelector('[role="dialog"][open]')
      if (modal) {
        modal.dispatchEvent(new Event('close'))
      }
    }

    // Enter key on buttons
    if (event.key === 'Enter') {
      const target = event.target as HTMLElement
      if (target.getAttribute('role') === 'button' && !target.hasAttribute('href')) {
        target.click()
      }
    }
  })

  // Remove keyboard-nav class on mouse move
  document.addEventListener('mousemove', () => {
    document.body.classList.remove('keyboard-nav')
  })
}

/**
 * Add ARIA labels to improve screen reader support
 */
function addAriaLabels(): void {
  // Add labels to form inputs
  const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])')
  inputs.forEach((input) => {
    const label = input.previousElementSibling
    if (label && label.tagName === 'LABEL') {
      const labelText = label.textContent
      if (labelText) {
        input.setAttribute('aria-label', labelText)
      }
    }
  })

  // Add role and aria-label to buttons
  const buttons = document.querySelectorAll('button:not([aria-label])')
  buttons.forEach((button) => {
    if (!button.textContent?.trim()) {
      const icon = button.querySelector('svg')
      if (icon && icon.getAttribute('aria-label')) {
        button.setAttribute('aria-label', icon.getAttribute('aria-label') || '')
      }
    }
  })

  // Add role="main" to main content
  const main = document.querySelector('main')
  if (main) {
    main.setAttribute('id', 'main-content')
    main.setAttribute('role', 'main')
  }

  // Add role="navigation" to nav
  const nav = document.querySelector('nav')
  if (nav) {
    nav.setAttribute('role', 'navigation')
  }
}

/**
 * Ensure proper focus management
 */
function manageFocus(): void {
  // Track focus for keyboard users
  let lastFocusedElement: Element | null = null

  document.addEventListener('focus', (event) => {
    const target = event.target as HTMLElement
    lastFocusedElement = target

    // Add focus styles
    target.classList.add('focus-visible')
  }, true)

  document.addEventListener('blur', (event) => {
    const target = event.target as HTMLElement
    target.classList.remove('focus-visible')
  }, true)

  // Restore focus after modal closes
  document.addEventListener('close', () => {
    if (lastFocusedElement && lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus()
    }
  })
}

/**
 * Setup live regions for dynamic content
 */
function setupLiveRegions(): void {
  // Create live region for announcements
  const liveRegion = document.createElement('div')
  liveRegion.id = 'aria-live-region'
  liveRegion.setAttribute('aria-live', 'polite')
  liveRegion.setAttribute('aria-atomic', 'true')
  liveRegion.className = 'sr-only'
  document.body.appendChild(liveRegion)

  // Expose announce function globally
  (window as any).announceToScreenReader = (message: string): void => {
    const region = document.getElementById('aria-live-region')
    if (region) {
      region.textContent = message
    }
  }
}

/**
 * Announce message to screen readers
 */
export const announceToScreenReader = (message: string): void => {
  const region = document.getElementById('aria-live-region')
  if (region) {
    region.textContent = message
  }
}

/**
 * Add autocomplete attributes to form inputs
 */
export const addAutocompleteAttributes = (): void => {
  const emailInputs = document.querySelectorAll('input[type="email"]')
  emailInputs.forEach((input) => {
    input.setAttribute('autocomplete', 'email')
  })

  const passwordInputs = document.querySelectorAll('input[type="password"]')
  passwordInputs.forEach((input) => {
    input.setAttribute('autocomplete', 'current-password')
  })

  const usernameInputs = document.querySelectorAll('input[type="text"][name*="user"], input[type="text"][name*="login"]')
  usernameInputs.forEach((input) => {
    input.setAttribute('autocomplete', 'username')
  })
}

export default useAccessibility

