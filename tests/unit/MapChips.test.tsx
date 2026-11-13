import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import MapChips from '@/app/components/MapChips'
import usePanelStore from '@/stores/panelStore'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('next-plausible', () => ({ usePlausible: () => vi.fn() }))

afterEach(() => {
  usePanelStore.setState({ sheetExpanded: false })
})

describe('MapChips', () => {
  it('stays interactive while the sheet is not expanded', () => {
    render(<MapChips />)
    expect(screen.getByText('Open now').closest('[inert]')).toBeNull()
  })

  it('steps out of the way when the mobile sheet is fully expanded', () => {
    usePanelStore.setState({ sheetExpanded: true })
    render(<MapChips />)
    expect(screen.getByText('Open now').closest('[inert]')).not.toBeNull()
  })
})
