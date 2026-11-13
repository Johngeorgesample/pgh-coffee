'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Stamp, MapPin } from 'lucide-react'
import EmptyCard from './EmptyCard'
import VisitChecklist from './VisitChecklist'
import Passport from '@/app/u/[id]/Passport'
import PassportCover from '@/app/u/[id]/PassportCover'
import { useOwnProfile } from '@/hooks'
import type { Visit } from '@/app/utils/visitStats'

export default function Visited() {
  const { profile } = useOwnProfile()
  const [visits, setVisits] = useState<Visit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [skipped, setSkipped] = useState(false)

  const hasVisits = visits && visits.length > 0

  const fetchVisits = useCallback(async () => {
    const res = await fetch('/api/visits')
    if (!res.ok) throw new Error(`Failed to fetch visits: ${res.status}`)
    const data = await res.json()
    setVisits(Array.isArray(data) ? data : [])
  }, [])

  useEffect(() => {
    fetchVisits()
      .catch((err) => {
        console.error('Failed to fetch visits:', err)
        setError(true)
      })
      .finally(() => setLoading(false))
  }, [fetchVisits])

  if (loading) return <div>Loading...</div>

  if (error) {
    return (
      <EmptyCard icon={Stamp} title="Couldn't load your passport" body="Something went wrong while loading your visited shops. Please try refreshing the page." />
    )
  }

  return (
    <div className="space-y-6">
      {hasVisits ? (
        <>
          <div className="overflow-hidden rounded-2xl">
            <PassportCover name={profile?.display_name || 'Your passport'} avatarUrl={profile?.avatar_url ?? null} visits={visits} />
          </div>
          <Passport visits={visits} />
        </>
      ) : !skipped ? (
        <VisitChecklist onSaved={fetchVisits} onSkip={() => setSkipped(true)} />
      ) : (
        <EmptyCard icon={Stamp} title="No visits yet" body="Mark the shops you've been to and watch your passport fill up.">
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-lg py-3 px-4 text-sm font-semibold text-black bg-yellow-300 hover:bg-yellow-400"
          >
            <MapPin className="h-4 w-4" />
            Explore shops
          </Link>
        </EmptyCard>
      )}
    </div>
  )
}
