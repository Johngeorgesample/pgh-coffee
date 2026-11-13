import { useEffect, useMemo, useState } from 'react'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { TFeatureCollection, TShop } from '@/types/shop-types'
import { doesShopMatchFilter } from '@/app/utils/utils'
import { areaForNeighborhood } from '@/app/utils/neighborhoodAreas'
import { isOpenNow, pittsburghNow, type HoursRow } from '@/app/utils/hours'

interface CoffeeShopsState {
  allShops: TFeatureCollection
  fetchCoffeeShops: () => Promise<void>
  currentShop: TShop
  setCurrentShop: (data: TShop) => void
  hoveredShop: TShop | null
  setHoveredShop: (shop: TShop | null) => void

  // Filters
  searchValue: string
  setSearchValue: (value: string) => void
  areaFilter: string | null
  setAreaFilter: (area: string) => void
  activeAmenityFilters: string[]
  toggleAmenityFilter: (amenity: string) => void
  clearAmenityFilters: () => void

  // Override for Company/Roaster pages that show a subset of shops
  overrideShops: TFeatureCollection | null
  setOverrideShops: (shops: TFeatureCollection | null) => void

  nearPoint: [number, number] | null
  setNearPoint: (point: [number, number] | null) => void

  visitedUUIDs: Set<string> | null
  fetchVisits: () => Promise<void>
  clearVisits: () => void
  setVisited: (uuid: string, visited: boolean) => void
  passportMode: boolean
  setPassportMode: (on: boolean) => void

  shopHours: Record<string, HoursRow[]> | null
  fetchShopHours: () => Promise<void>
  openNow: boolean
  setOpenNow: (on: boolean) => void
}

let visitsRequest: Promise<void> | null = null

const useCoffeeShopsStore = create<CoffeeShopsState>()(
  devtools(
    set => ({
      allShops: {
        type: 'FeatureCollection',
        features: [],
      },

      fetchCoffeeShops: async () => {
        const { allShops } = useCoffeeShopsStore.getState()
        if (allShops.features.length > 0) {
          return
        }
        try {
          const response = await fetch('/api/shops/geojson')
          if (!response.ok) throw new Error(`Failed to fetch shops: ${response.status}`)
          const data: TFeatureCollection = await response.json()
          set({ allShops: data })
        } catch (error) {
          console.error('Error fetching coffee shops:', error)
        }
      },

      currentShop: {} as TShop,
      setCurrentShop: (data: TShop) => set({ currentShop: data }),

      hoveredShop: null,
      setHoveredShop: shop => set({ hoveredShop: shop }),

      // Filters
      searchValue: '',
      setSearchValue: value => set({ searchValue: value, areaFilter: null }),
      areaFilter: null,
      setAreaFilter: area => set({ searchValue: area, areaFilter: area }),

      activeAmenityFilters: [],
      toggleAmenityFilter: amenity =>
        set(prev => ({
          activeAmenityFilters: prev.activeAmenityFilters.includes(amenity)
            ? prev.activeAmenityFilters.filter(a => a !== amenity)
            : [...prev.activeAmenityFilters, amenity],
        })),
      clearAmenityFilters: () => set({ activeAmenityFilters: [] }),

      overrideShops: null,
      setOverrideShops: shops => set({ overrideShops: shops }),

      nearPoint: null,
      setNearPoint: nearPoint => set({ nearPoint }),

      visitedUUIDs: null,
      fetchVisits: () => {
        visitsRequest ??= (async () => {
          try {
            const response = await fetch('/api/visits')
            if (!response.ok) throw new Error(`Failed to fetch visits: ${response.status}`)
            const visits: { shop: { uuid: string } | null }[] = await response.json()
            set({ visitedUUIDs: new Set(visits.flatMap(visit => visit.shop?.uuid ?? [])) })
          } catch (error) {
            console.error('Error fetching visits:', error)
          } finally {
            visitsRequest = null
          }
        })()
        return visitsRequest
      },
      clearVisits: () => set({ visitedUUIDs: null, passportMode: false }),
      setVisited: (uuid, visited) =>
        set(prev => {
          const next = new Set(prev.visitedUUIDs)
          if (visited) next.add(uuid)
          else next.delete(uuid)
          return { visitedUUIDs: next, passportMode: prev.passportMode && next.size > 0 }
        }),
      passportMode: false,
      setPassportMode: passportMode => set({ passportMode }),

      shopHours: null,
      fetchShopHours: async () => {
        if (useCoffeeShopsStore.getState().shopHours) return
        try {
          const response = await fetch('/api/shops/hours')
          if (!response.ok) throw new Error(`Failed to fetch shop hours: ${response.status}`)
          set({ shopHours: await response.json() })
        } catch (error) {
          console.error('Error fetching shop hours:', error)
        }
      },
      openNow: false,
      setOpenNow: openNow => {
        set({ openNow })
        if (openNow) useCoffeeShopsStore.getState().fetchShopHours()
      },
    }),
    { name: 'ShopsStore' },
  ),
)

/**
 * Derives the displayed shops from allShops + filters + currentShop selection state.
 * When overrideShops is set (e.g. Company page), returns that instead.
 */
export function useDisplayedShops(): TFeatureCollection {
  const allShops = useCoffeeShopsStore(s => s.allShops)
  const searchValue = useCoffeeShopsStore(s => s.searchValue)
  const areaFilter = useCoffeeShopsStore(s => s.areaFilter)
  const activeAmenityFilters = useCoffeeShopsStore(s => s.activeAmenityFilters)
  const currentShop = useCoffeeShopsStore(s => s.currentShop)
  const overrideShops = useCoffeeShopsStore(s => s.overrideShops)

  return useMemo(() => {
    if (overrideShops) return overrideShops

    const filtered = allShops.features.filter(shop => {
      if (areaFilter) {
        if (areaForNeighborhood(shop.properties.neighborhood) !== areaFilter) return false
      } else if (!doesShopMatchFilter(shop.properties.name, shop.properties.neighborhood, searchValue)) {
        return false
      }
      if (
        activeAmenityFilters.length > 0 &&
        !activeAmenityFilters.every(amenity => shop.properties.amenities?.includes(amenity))
      ) {
        return false
      }
      return true
    })

    // Mark selected shop, avoiding new objects when selected state is unchanged
    let anyChanged = false
    const features = filtered.map(shop => {
      const isSelected =
        shop.properties.address === currentShop?.properties?.address &&
        shop.properties.name === currentShop?.properties?.name

      if (shop.properties.selected === isSelected) return shop

      anyChanged = true
      return {
        ...shop,
        properties: {
          ...shop.properties,
          selected: isSelected,
        },
      }
    })

    return { ...allShops, features: anyChanged ? features : filtered }
  }, [
    allShops,
    searchValue,
    areaFilter,
    activeAmenityFilters,
    currentShop?.properties?.address,
    currentShop?.properties?.name,
    overrideShops,
  ])
}

export function useIsClosed() {
  const openNow = useCoffeeShopsStore(s => s.openNow)
  const shopHours = useCoffeeShopsStore(s => s.shopHours)
  const minute = useMinuteTick(openNow)

  return useMemo(() => {
    const now = pittsburghNow()
    return (uuid: string) => openNow && !!shopHours?.[uuid] && !isOpenNow(shopHours[uuid], now)
  }, [openNow, shopHours, minute])
}

function useMinuteTick(enabled: boolean) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (!enabled) return
    const id = setInterval(() => setTick(t => t + 1), 60_000)
    return () => clearInterval(id)
  }, [enabled])
  return tick
}

export default useCoffeeShopsStore
