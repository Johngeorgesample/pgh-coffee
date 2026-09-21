import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import TastingJournal from '@/app/components/advent/TastingJournal'

vi.mock('@/hooks', () => ({
  useCopyToClipboard: () => ({ showToast: false, copyCurrentUrl: vi.fn(), closeToast: vi.fn() }),
}))

const renderJournal = () => render(<TastingJournal day={1} notes={['Red apple', 'Cocoa']} />)

describe('TastingJournal', () => {
  beforeEach(() => localStorage.clear())

  // Signed-out visitors are sent to sign-up mid-entry, so the draft has to
  // survive the round trip or the CTA destroys what it is asking them to keep.
  it('restores a signed-out draft after the page is left and reopened', () => {
    renderJournal()

    fireEvent.click(screen.getByRole('button', { name: '4 out of 5' }))
    fireEvent.click(screen.getByRole('button', { name: /Cocoa/ }))

    cleanup()
    renderJournal()

    expect(screen.getByRole('button', { name: '4 out of 5' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /Cocoa/ })).toHaveAttribute('aria-pressed', 'true')
  })

  it('keeps a custom note visible after a reopen', () => {
    renderJournal()

    fireEvent.click(screen.getByRole('button', { name: /Add your own note/ }))
    const input = screen.getByLabelText('Add your own tasting note')
    fireEvent.change(input, { target: { value: 'Dried cherry' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    cleanup()
    renderJournal()

    expect(screen.getByRole('button', { name: /Dried cherry/ })).toHaveAttribute('aria-pressed', 'true')
  })
})
