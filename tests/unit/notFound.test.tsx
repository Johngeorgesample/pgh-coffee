import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import NotFound from '@/app/not-found'
import usePanelStore from '@/stores/panelStore'

describe('NotFound', () => {
  it('hides the map panel while mounted and restores it on unmount', () => {
    const { unmount } = render(<NotFound />)
    expect(usePanelStore.getState().hidden).toBe(true)

    unmount()
    expect(usePanelStore.getState().hidden).toBe(false)
  })
})
