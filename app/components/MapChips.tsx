'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Clock, LocateFixed } from 'lucide-react'
import { useAnalytics } from '@/hooks'
import useShopsStore from '@/stores/coffeeShopsStore'
import MapChip from './MapChip'
import PassportToggle from './PassportToggle'
import { NEAR_ME } from '@/hooks/useNearRouteSync'
import { useMediaQuery } from '@/hooks'
import { useChipsVariant, useSheetExpanded } from './prototype/mobileChipsPrototype'

function OpenNowToggle() {
  const plausible = useAnalytics()
  const openNow = useShopsStore(s => s.openNow)
  const setOpenNow = useShopsStore(s => s.setOpenNow)

  const handleClick = () => {
    setOpenNow(!openNow)
    plausible('filterByAmenity', { props: { amenity: 'open_now' } })
  }

  return (
    <MapChip on={openNow} onClick={handleClick}>
      <Clock className="size-4" />
      Open now
    </MapChip>
  )
}

function NearMeToggle() {
  const router = useRouter()
  const on = useSearchParams().get('near') === NEAR_ME

  return (
    <MapChip on={on} onClick={() => router.push(on ? '/' : `/?near=${NEAR_ME}`)}>
      <LocateFixed className="size-4" />
      Near me
    </MapChip>
  )
}

export function ChipRow({ className = '' }: { className?: string }) {
  return (
    <div className={`flex gap-2 ${className}`}>
      <OpenNowToggle />
      <PassportToggle />
      <NearMeToggle />
    </div>
  )
}

export default function MapChips() {
  const largeViewport = useMediaQuery('(min-width: 1024px)')
  const variant = useChipsVariant()
  const expanded = useSheetExpanded(s => s.expanded)

  if (!largeViewport && variant === 'B') return null
  const hidden = !largeViewport && variant === 'A' && expanded

  return (
    <ChipRow
      className={`absolute left-4 top-4 z-10 flex-wrap transition-all duration-200 ${hidden ? 'pointer-events-none -translate-y-2 opacity-0' : ''}`}
    />
  )
}
