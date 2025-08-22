import { useEffect } from 'react'
import { TShop } from '@/types/shop-types'

export function useHighlightCurrentShop({
  currentShop,
  displayedShops,
  setDisplayedShops,
}: {
  currentShop: TShop
  displayedShops: {
    type: 'FeatureCollection'
    features: TShop[]
  }
  setDisplayedShops: (data: { type: 'FeatureCollection'; features: TShop[] }) => void
}) {
  useEffect(() => {
    if (!currentShop || !Array.isArray(displayedShops?.features) || displayedShops.features.length === 0) return

    const updatedFeatures = displayedShops.features.map((f: any) => {
      const isSelected =
        f.properties.address === currentShop.properties?.address &&
        f.properties.name === currentShop.properties?.name

      // Avoid unnecessary object mutation
      if (f.properties.selected === isSelected) return f

      return {
        ...f,
        properties: {
          ...f.properties,
          selected: isSelected,
        },
      }
    })

    // Check if any features actually changed
    const hasChanged = updatedFeatures.some((f, i) => f !== displayedShops.features[i])
    if (hasChanged) {
      setDisplayedShops({
        ...displayedShops,
        features: updatedFeatures,
      })
    }
  }, [currentShop, displayedShops, setDisplayedShops])
}
