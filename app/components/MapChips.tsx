'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Clock, LocateFixed } from 'lucide-react'
import { useAnalytics } from '@/hooks'
import useShopsStore from '@/stores/coffeeShopsStore'
import MapChip from './MapChip'
import PassportToggle from './PassportToggle'
import { NEAR_ME } from '@/hooks/useNearRouteSync'
import usePanelStore from '@/stores/panelStore'

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

export default function MapChips() {
  const sheetExpanded = usePanelStore(s => s.sheetExpanded)

  return (
    <div
      inert={sheetExpanded}
      className={`absolute left-4 top-4 z-10 flex flex-wrap gap-2 transition duration-200 ease-out ${
        sheetExpanded ? '-translate-y-2 opacity-0' : ''
      }`}
    >
      <OpenNowToggle />
      <PassportToggle />
      <NearMeToggle />
    </div>
  )
}
