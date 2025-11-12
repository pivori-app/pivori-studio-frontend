import axios, { AxiosInstance, AxiosError } from 'axios'
import { supabase, authService } from './supabaseClient'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

class ApiClient {
  private client: AxiosInstance
  private token: string | null = null

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          await authService.signOut()
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  private async getToken(): Promise<string | null> {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error || !session) {
      return null
    }
    return session.access_token
  }

  // Applications
  async getApplications(limit = 50, offset = 0) {
    const response = await this.client.get('/api/applications', {
      params: { limit, offset },
    })
    return response.data
  }

  async getApplication(id: string) {
    const response = await this.client.get(`/api/applications/${id}`)
    return response.data
  }

  async createApplication(data: any) {
    const response = await this.client.post('/api/applications', data)
    return response.data
  }

  async updateApplication(id: string, data: any) {
    const response = await this.client.put(`/api/applications/${id}`, data)
    return response.data
  }

  async deleteApplication(id: string) {
    const response = await this.client.delete(`/api/applications/${id}`)
    return response.data
  }

  // Transactions
  async getTransactions(applicationId: string, limit = 50, offset = 0) {
    const response = await this.client.get(
      `/api/applications/${applicationId}/transactions`,
      {
        params: { limit, offset },
      }
    )
    return response.data
  }

  async createTransaction(applicationId: string, data: any) {
    const response = await this.client.post(
      `/api/applications/${applicationId}/transactions`,
      data
    )
    return response.data
  }

  // API Keys
  async getApiKeys(applicationId: string) {
    const response = await this.client.get(
      `/api/applications/${applicationId}/keys`
    )
    return response.data
  }

  async createApiKey(applicationId: string, data: any) {
    const response = await this.client.post(
      `/api/applications/${applicationId}/keys`,
      data
    )
    return response.data
  }

  async deleteApiKey(applicationId: string, keyId: string) {
    const response = await this.client.delete(
      `/api/applications/${applicationId}/keys/${keyId}`
    )
    return response.data
  }

  // Connectors
  async getConnectors(applicationId: string) {
    const response = await this.client.get(
      `/api/applications/${applicationId}/connectors`
    )
    return response.data
  }

  async createConnector(applicationId: string, data: any) {
    const response = await this.client.post(
      `/api/applications/${applicationId}/connectors`,
      data
    )
    return response.data
  }

  async updateConnector(applicationId: string, connectorId: string, data: any) {
    const response = await this.client.put(
      `/api/applications/${applicationId}/connectors/${connectorId}`,
      data
    )
    return response.data
  }

  async deleteConnector(applicationId: string, connectorId: string) {
    const response = await this.client.delete(
      `/api/applications/${applicationId}/connectors/${connectorId}`
    )
    return response.data
  }

  // Analytics
  async getAnalytics(applicationId: string) {
    const response = await this.client.get(
      `/api/applications/${applicationId}/analytics`
    )
    return response.data
  }

  // Health check
  async healthCheck() {
    const response = await this.client.get('/health')
    return response.data
  }
}

export const apiClient = new ApiClient()
export default apiClient

