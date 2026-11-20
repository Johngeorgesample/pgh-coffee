import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react'
import TastingJournal from '@/app/components/advent/TastingJournal'

global.fetch = vi.fn().mockResolvedValue({ ok: true })

const auth = vi.hoisted(() => ({ user: null as { id: string } | null }))

const plausible = vi.hoisted(() => vi.fn())
vi.mock('next-plausible', () => ({ usePlausible: () => plausible }))

vi.mock('@/app/components/AuthProvider', () => ({ useAuth: () => ({ user: auth.user }) }))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: { signUp: vi.fn().mockResolvedValue({ data: { user: { identities: [{}] }, session: {} }, error: null }) },
  }),
}))

const renderJournal = () => render(<TastingJournal day={1} step={1} notes={['Red apple', 'Cocoa']} returnTo="/advent/1" />)

describe('TastingJournal', () => {
  beforeEach(() => {
    localStorage.clear()
    auth.user = null
    plausible.mockClear()
  })

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

  it('logs a signed-out visitor’s cup once they sign up from the save dialog', async () => {
    renderJournal()

    fireEvent.click(screen.getByRole('button', { name: '4 out of 5' }))
    fireEvent.click(screen.getByRole('button', { name: 'Save tasting note' }))
    fireEvent.change(await screen.findByLabelText('Email'), { target: { value: 'a@b.co' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'hunter22' } })
    auth.user = { id: 'u1' }
    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }))

    await waitFor(() => expect(screen.getByText('Logged · Day 01')).toBeInTheDocument())
    expect(JSON.parse(localStorage.getItem('advent:journal:1')!)).toMatchObject({ rating: 4, logged: true })
    expect(plausible.mock.calls.filter(([event]) => event === 'AdventSaveAuthCompleted')).toHaveLength(1)
  })

  it('logs the cup when a visitor comes back signed in from a Google or email-confirmation redirect', () => {
    renderJournal()
    fireEvent.click(screen.getByRole('button', { name: '4 out of 5' }))
    fireEvent.click(screen.getByRole('button', { name: 'Save tasting note' }))

    cleanup()
    auth.user = { id: 'u1' }
    renderJournal()

    expect(screen.getByText('Logged · Day 01')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('advent:journal:1')!)).toMatchObject({ rating: 4, logged: true, pending: false })
  })

})
