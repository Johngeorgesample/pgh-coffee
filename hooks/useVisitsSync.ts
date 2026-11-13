import { useEffect } from 'react'
import { useAuth } from '@/app/components/AuthProvider'
import useShopsStore from '@/stores/coffeeShopsStore'

export function useVisitsSync() {
  const { user, loading } = useAuth()
  const fetchVisits = useShopsStore(s => s.fetchVisits)
  const clearVisits = useShopsStore(s => s.clearVisits)
  const userID = user?.id

  useEffect(() => {
    if (loading) return
    if (userID) fetchVisits()
    else clearVisits()
  }, [userID, loading, fetchVisits, clearVisits])
}
