import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../server.js'

describe('API Endpoints', () => {
  let token = null
  let applicationId = null

  // Mock JWT token for testing
  beforeAll(() => {
    // In real tests, generate valid JWT token
    token = 'mock-jwt-token'
  })

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health')
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('status', 'ok')
      expect(response.body).toHaveProperty('timestamp')
    })
  })

  describe('Applications', () => {
    it('should require authentication', async () => {
      const response = await request(app).get('/api/applications')
      expect(response.status).toBe(401)
    })

    it('should create an application', async () => {
      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test App',
          description: 'Test Description',
          category: 'productivity',
          currency: 'EUR',
        })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('id')
      expect(response.body.name).toBe('Test App')
      applicationId = response.body.id
    })

    it('should list applications', async () => {
      const response = await request(app)
        .get('/api/applications')
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
    })

    it('should update an application', async () => {
      const response = await request(app)
        .put(`/api/applications/${applicationId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated App',
          currency: 'USD',
        })

      expect(response.status).toBe(200)
      expect(response.body.name).toBe('Updated App')
      expect(response.body.currency).toBe('USD')
    })

    it('should delete an application', async () => {
      const response = await request(app)
        .delete(`/api/applications/${applicationId}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
    })
  })

  describe('Transactions', () => {
    let testAppId = null

    beforeEach(async () => {
      // Create test application
      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Transaction Test App',
          description: 'Test',
          category: 'productivity',
        })
      testAppId = response.body.id
    })

    it('should create a transaction', async () => {
      const response = await request(app)
        .post(`/api/applications/${testAppId}/transactions`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 99.99,
          currency: 'EUR',
          type: 'payment',
        })

      expect(response.status).toBe(201)
      expect(response.body.amount).toBe(99.99)
    })

    it('should list transactions', async () => {
      const response = await request(app)
        .get(`/api/applications/${testAppId}/transactions`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('should return 404 for non-existent endpoint', async () => {
      const response = await request(app).get('/api/non-existent')
      expect(response.status).toBe(404)
    })

    it('should return 400 for invalid input', async () => {
      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${token}`)
        .send({
          // Missing required fields
        })

      expect(response.status).toBe(400)
    })
  })
})

