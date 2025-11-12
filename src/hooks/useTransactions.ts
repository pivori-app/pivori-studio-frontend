import { useState, useEffect, useCallback } from 'react'
import { transactionsService } from '../services/supabaseClient'
import { apiClient } from '../services/api'

interface Transaction {
  id: string
  application_id: string
  user_id: string
  amount: number
  currency: string
  status: string
  type: string
  description?: string
  created_at: string
  updated_at: string
}

interface UseTransactionsReturn {
  transactions: Transaction[]
  loading: boolean
  error: Error | null
  createTransaction: (data: any) => Promise<Transaction>
  refreshTransactions: () => Promise<void>
  stats: {
    total: number
    completed: number
    pending: number
    failed: number
  }
}

export function useTransactions(applicationId: string): UseTransactionsReturn {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0,
  })

  const fetchTransactions = useCallback(async () => {
    if (!applicationId) return

    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.getTransactions(applicationId)
      setTransactions(data || [])

      // Calculate stats
      const newStats = {
        total: 0,
        completed: 0,
        pending: 0,
        failed: 0,
      }

      data?.forEach((tx: Transaction) => {
        newStats.total += tx.amount
        if (tx.status === 'completed') newStats.completed++
        else if (tx.status === 'pending') newStats.pending++
        else if (tx.status === 'failed') newStats.failed++
      })

      setStats(newStats)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch transactions'))
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }, [applicationId])

  const createTransaction = useCallback(
    async (data: any): Promise<Transaction> => {
      try {
        const newTx = await apiClient.createTransaction(applicationId, data)
        setTransactions((prev) => [newTx, ...prev])
        return newTx
      } catch (err) {
        throw err instanceof Error ? err : new Error('Failed to create transaction')
      }
    },
    [applicationId]
  )

  const refreshTransactions = useCallback(async () => {
    await fetchTransactions()
  }, [fetchTransactions])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return {
    transactions,
    loading,
    error,
    createTransaction,
    refreshTransactions,
    stats,
  }
}

export default useTransactions

