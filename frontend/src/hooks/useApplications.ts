import { useState, useEffect, useCallback } from 'react'
import { applicationsService } from '../services/supabaseClient'
import { apiClient } from '../services/api'

interface Application {
  id: string
  name: string
  description: string
  category: string
  icon: string
  template: string
  currency: string
  users_count: number
  revenue: number
  health: number
  status: string
  created_at: string
  updated_at: string
}

interface UseApplicationsReturn {
  applications: Application[]
  loading: boolean
  error: Error | null
  createApplication: (data: any) => Promise<Application>
  updateApplication: (id: string, data: any) => Promise<Application>
  deleteApplication: (id: string) => Promise<void>
  refreshApplications: () => Promise<void>
}

export function useApplications(): UseApplicationsReturn {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await applicationsService.getAll()
      setApplications(data || [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch applications'))
      setApplications([])
    } finally {
      setLoading(false)
    }
  }, [])

  const createApplication = useCallback(
    async (data: any): Promise<Application> => {
      try {
        const newApp = await apiClient.createApplication(data)
        setApplications((prev) => [newApp, ...prev])
        return newApp
      } catch (err) {
        throw err instanceof Error ? err : new Error('Failed to create application')
      }
    },
    []
  )

  const updateApplication = useCallback(
    async (id: string, data: any): Promise<Application> => {
      try {
        const updated = await apiClient.updateApplication(id, data)
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? updated : app))
        )
        return updated
      } catch (err) {
        throw err instanceof Error ? err : new Error('Failed to update application')
      }
    },
    []
  )

  const deleteApplication = useCallback(async (id: string) => {
    try {
      await apiClient.deleteApplication(id)
      setApplications((prev) => prev.filter((app) => app.id !== id))
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete application')
    }
  }, [])

  const refreshApplications = useCallback(async () => {
    await fetchApplications()
  }, [fetchApplications])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  return {
    applications,
    loading,
    error,
    createApplication,
    updateApplication,
    deleteApplication,
    refreshApplications,
  }
}

export default useApplications

