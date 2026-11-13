import { renderHook } from '@testing-library/react'
import { useURLNeighborhoodSync } from '@/hooks/useURLNeighborhoodSync'
import useCoffeeShopsStore from '@/stores/coffeeShopsStore'

it('folds a granular neighborhood param into its area filter', () => {
  window.history.replaceState({}, '', '/?neighborhood=Central%20Lawrenceville')
  renderHook(() => useURLNeighborhoodSync())
  expect(useCoffeeShopsStore.getState().areaFilter).toBe('Lawrenceville')
})
