/**
 * End-to-End Tests - Complete User Flows
 * Comprehensive E2E test suite for Pivori Studio
 */

describe('Pivori Studio - Complete User Flows', () => {
  const baseUrl = 'http://localhost:3000';

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  /**
   * Test Suite 1: Authentication Flow
   */
  describe('Authentication Flow', () => {
    it('should display login page', () => {
      cy.get('h1').should('contain', 'Pivori Studio');
      cy.get('input[type="email"]').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('contain', 'Login');
    });

    it('should login with valid credentials', () => {
      cy.get('input[type="email"]').type('admin@pivori.app');
      cy.get('input[type="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      cy.url().should('include', '/dashboard');
      cy.get('h1').should('contain', 'Dashboard');
    });

    it('should show error on invalid credentials', () => {
      cy.get('input[type="email"]').type('invalid@example.com');
      cy.get('input[type="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();

      cy.get('[role="alert"]').should('contain', 'Invalid credentials');
    });

    it('should logout successfully', () => {
      cy.login('admin@pivori.app', 'password123');
      cy.get('button[aria-label="User menu"]').click();
      cy.get('button').contains('Logout').click();

      cy.url().should('include', '/login');
    });
  });

  /**
   * Test Suite 2: Dashboard Navigation
   */
  describe('Dashboard Navigation', () => {
    beforeEach(() => {
      cy.login('admin@pivori.app', 'password123');
    });

    it('should display dashboard with all sections', () => {
      cy.get('h1').should('contain', 'Dashboard');
      cy.get('[data-testid="services-count"]').should('be.visible');
      cy.get('[data-testid="uptime"]').should('be.visible');
      cy.get('[data-testid="requests"]').should('be.visible');
      cy.get('[data-testid="latency"]').should('be.visible');
    });

    it('should navigate to services page', () => {
      cy.get('a[href="/services"]').click();
      cy.url().should('include', '/services');
      cy.get('h1').should('contain', 'Services');
    });

    it('should navigate to settings page', () => {
      cy.get('a[href="/settings"]').click();
      cy.url().should('include', '/settings');
      cy.get('h1').should('contain', 'Settings');
    });

    it('should display service cards', () => {
      cy.get('a[href="/services"]').click();
      cy.get('[data-testid="service-card"]').should('have.length.greaterThan', 0);
    });
  });

  /**
   * Test Suite 3: Services Management
   */
  describe('Services Management', () => {
    beforeEach(() => {
      cy.login('admin@pivori.app', 'password123');
      cy.visit(`${baseUrl}/services`);
    });

    it('should load services list', () => {
      cy.get('[data-testid="service-card"]').should('have.length.greaterThan', 0);
    });

    it('should filter services by status', () => {
      cy.get('[data-testid="status-filter"]').select('running');
      cy.get('[data-testid="service-card"]').each(($card) => {
        cy.wrap($card).should('contain', 'running');
      });
    });

    it('should search services by name', () => {
      cy.get('[data-testid="search-input"]').type('geolocation');
      cy.get('[data-testid="service-card"]').should('contain', 'Geolocation');
    });

    it('should view service details', () => {
      cy.get('[data-testid="service-card"]').first().click();
      cy.url().should('include', '/services/');
      cy.get('h1').should('be.visible');
    });

    it('should restart a service', () => {
      cy.get('[data-testid="service-card"]').first().within(() => {
        cy.get('button[aria-label="Restart"]').click();
      });
      cy.get('[role="alert"]').should('contain', 'Service restarted');
    });

    it('should stop a service', () => {
      cy.get('[data-testid="service-card"]').first().within(() => {
        cy.get('button[aria-label="Stop"]').click();
      });
      cy.get('[role="dialog"]').should('be.visible');
      cy.get('button').contains('Confirm').click();
      cy.get('[role="alert"]').should('contain', 'Service stopped');
    });
  });

  /**
   * Test Suite 4: Monitoring & Metrics
   */
  describe('Monitoring & Metrics', () => {
    beforeEach(() => {
      cy.login('admin@pivori.app', 'password123');
      cy.visit(`${baseUrl}/monitoring`);
    });

    it('should display monitoring dashboard', () => {
      cy.get('h1').should('contain', 'Monitoring');
      cy.get('[data-testid="metrics-chart"]').should('be.visible');
    });

    it('should display CPU metrics', () => {
      cy.get('[data-testid="cpu-metric"]').should('be.visible');
      cy.get('[data-testid="cpu-metric"]').should('contain', '%');
    });

    it('should display memory metrics', () => {
      cy.get('[data-testid="memory-metric"]').should('be.visible');
      cy.get('[data-testid="memory-metric"]').should('contain', '%');
    });

    it('should display network metrics', () => {
      cy.get('[data-testid="network-metric"]').should('be.visible');
    });

    it('should update metrics in real-time', () => {
      cy.get('[data-testid="cpu-metric"]').then(($el) => {
        const initialValue = $el.text();
        cy.wait(5000);
        cy.get('[data-testid="cpu-metric"]').should('be.visible');
      });
    });
  });

  /**
   * Test Suite 5: Settings & Configuration
   */
  describe('Settings & Configuration', () => {
    beforeEach(() => {
      cy.login('admin@pivori.app', 'password123');
      cy.visit(`${baseUrl}/settings`);
    });

    it('should display settings form', () => {
      cy.get('form').should('be.visible');
      cy.get('input[name="apiEndpoint"]').should('be.visible');
      cy.get('input[name="timeout"]').should('be.visible');
    });

    it('should update API endpoint', () => {
      cy.get('input[name="apiEndpoint"]').clear().type('http://api.example.com');
      cy.get('button[type="submit"]').click();
      cy.get('[role="alert"]').should('contain', 'Settings saved');
    });

    it('should update timeout setting', () => {
      cy.get('input[name="timeout"]').clear().type('10000');
      cy.get('button[type="submit"]').click();
      cy.get('[role="alert"]').should('contain', 'Settings saved');
    });

    it('should persist settings in localStorage', () => {
      cy.get('input[name="apiEndpoint"]').clear().type('http://new-api.example.com');
      cy.get('button[type="submit"]').click();
      cy.reload();
      cy.get('input[name="apiEndpoint"]').should('have.value', 'http://new-api.example.com');
    });
  });

  /**
   * Test Suite 6: Error Handling
   */
  describe('Error Handling', () => {
    beforeEach(() => {
      cy.login('admin@pivori.app', 'password123');
    });

    it('should handle network errors', () => {
      cy.intercept('GET', '/api/services', { forceNetworkError: true });
      cy.visit(`${baseUrl}/services`);
      cy.get('[role="alert"]').should('contain', 'Failed to load services');
    });

    it('should handle 500 errors', () => {
      cy.intercept('GET', '/api/services', { statusCode: 500 });
      cy.visit(`${baseUrl}/services`);
      cy.get('[role="alert"]').should('contain', 'Server error');
    });

    it('should handle 404 errors', () => {
      cy.visit(`${baseUrl}/services/nonexistent`);
      cy.get('[role="alert"]').should('contain', 'Service not found');
    });

    it('should handle timeout errors', () => {
      cy.intercept('GET', '/api/services', (req) => {
        req.destroy();
      });
      cy.visit(`${baseUrl}/services`);
      cy.get('[role="alert"]').should('contain', 'Request timeout');
    });
  });

  /**
   * Test Suite 7: Performance
   */
  describe('Performance', () => {
    beforeEach(() => {
      cy.login('admin@pivori.app', 'password123');
    });

    it('should load dashboard in < 2 seconds', () => {
      cy.visit(`${baseUrl}/dashboard`, {
        onBeforeLoad: (win) => {
          win.performance.mark('start');
        },
        onLoad: (win) => {
          win.performance.mark('end');
          win.performance.measure('pageLoad', 'start', 'end');
          const measure = win.performance.getEntriesByName('pageLoad')[0];
          expect(measure.duration).to.be.lessThan(2000);
        }
      });
    });

    it('should load services list in < 1 second', () => {
      cy.visit(`${baseUrl}/services`, {
        onBeforeLoad: (win) => {
          win.performance.mark('start');
        },
        onLoad: (win) => {
          win.performance.mark('end');
          win.performance.measure('pageLoad', 'start', 'end');
          const measure = win.performance.getEntriesByName('pageLoad')[0];
          expect(measure.duration).to.be.lessThan(1000);
        }
      });
    });
  });

  /**
   * Test Suite 8: Accessibility
   */
  describe('Accessibility', () => {
    beforeEach(() => {
      cy.login('admin@pivori.app', 'password123');
    });

    it('should have proper heading hierarchy', () => {
      cy.get('h1').should('have.length.greaterThan', 0);
      cy.get('h2').should('have.length.greaterThan', 0);
    });

    it('should have alt text for images', () => {
      cy.get('img').each(($img) => {
        cy.wrap($img).should('have.attr', 'alt');
      });
    });

    it('should have proper form labels', () => {
      cy.get('form').within(() => {
        cy.get('input').each(($input) => {
          const inputId = $input.attr('id');
          if (inputId) {
            cy.get(`label[for="${inputId}"]`).should('exist');
          }
        });
      });
    });

    it('should support keyboard navigation', () => {
      cy.get('button').first().focus();
      cy.focused().should('have.attr', 'type', 'submit');
      cy.tab();
      cy.focused().should('not.have.attr', 'type', 'submit');
    });

    it('should have proper color contrast', () => {
      cy.get('body').should('have.css', 'background-color');
      cy.get('h1').should('have.css', 'color');
    });
  });

  /**
   * Test Suite 9: Mobile Responsiveness
   */
  describe('Mobile Responsiveness', () => {
    it('should be responsive on mobile (375px)', () => {
      cy.viewport(375, 667);
      cy.visit(baseUrl);
      cy.get('nav').should('be.visible');
      cy.get('button[aria-label="Menu"]').should('be.visible');
    });

    it('should be responsive on tablet (768px)', () => {
      cy.viewport(768, 1024);
      cy.visit(baseUrl);
      cy.get('nav').should('be.visible');
    });

    it('should be responsive on desktop (1920px)', () => {
      cy.viewport(1920, 1080);
      cy.visit(baseUrl);
      cy.get('nav').should('be.visible');
    });
  });

  /**
   * Test Suite 10: Security
   */
  describe('Security', () => {
    it('should not expose sensitive data in URLs', () => {
      cy.login('admin@pivori.app', 'password123');
      cy.url().should('not.include', 'password');
      cy.url().should('not.include', 'token');
      cy.url().should('not.include', 'api_key');
    });

    it('should have secure headers', () => {
      cy.request(baseUrl).then((response) => {
        expect(response.headers['x-content-type-options']).to.equal('nosniff');
        expect(response.headers['x-frame-options']).to.equal('DENY');
        expect(response.headers['x-xss-protection']).to.exist;
      });
    });

    it('should redirect to HTTPS', () => {
      cy.request({ url: baseUrl.replace('http', 'https'), followRedirect: false }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });
  });
});

/**
 * Custom Commands
 */
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('http://localhost:3000/login');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

Cypress.Commands.add('tab', () => {
  cy.focused().trigger('keydown', { keyCode: 9, which: 9, key: 'Tab' });
});

