import { useMemo } from 'react'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { TFeatureCollection, TShop } from '@/types/shop-types'
import { doesShopMatchFilter } from '@/app/utils/utils'

interface CoffeeShopsState {
  allShops: TFeatureCollection
  fetchCoffeeShops: () => Promise<void>
  setAllShops: (data: TShop[]) => void
  currentShop: TShop
  setCurrentShop: (data: TShop) => void
  hoveredShop: TShop | null
  setHoveredShop: (shop: TShop | null) => void

  // Filters
  searchValue: string
  setSearchValue: (value: string) => void
  activeAmenityFilters: string[]
  toggleAmenityFilter: (amenity: string) => void
  clearAmenityFilters: () => void

  // Override for Company/Roaster pages that show a subset of shops
  overrideShops: TFeatureCollection | null
  setOverrideShops: (shops: TFeatureCollection | null) => void
}

const useCoffeeShopsStore = create<CoffeeShopsState>()(
  devtools(
    set => ({
      allShops: {
        type: 'FeatureCollection',
        features: [],
      },

      setAllShops: (data: TShop[] | { type: string; features: TShop[] }) =>
        set(prev => {
          const isGeoJSON = typeof data === 'object' && 'type' in data && 'features' in data

          return {
            allShops: isGeoJSON
              ? (data as TFeatureCollection)
              : {
                  ...prev.allShops,
                  features: data as TShop[],
                },
          }
        }),

      fetchCoffeeShops: async () => {
        const { allShops } = useCoffeeShopsStore.getState()
        if (allShops.features.length > 0) {
          return
        }
        try {
          const response = await fetch('/api/shops/geojson')
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
      setSearchValue: value => set({ searchValue: value }),

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
    }),
    { name: 'ShopsStore' },
  ),
)

/**
 * Derives the displayed shops from allShops + filters + currentShop selection state.
 * When overrideShops is set (e.g. Company page), returns that instead.
 */
export function useDisplayedShops(): TFeatureCollection {
  const { allShops, searchValue, activeAmenityFilters, currentShop, overrideShops } = useCoffeeShopsStore()

  return useMemo(() => {
    if (overrideShops) return overrideShops

    const filtered = allShops.features.filter(shop => {
      if (!doesShopMatchFilter(shop.properties.name, shop.properties.neighborhood, searchValue)) {
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
    activeAmenityFilters,
    currentShop?.properties?.address,
    currentShop?.properties?.name,
    overrideShops,
  ])
}

export default useCoffeeShopsStore
