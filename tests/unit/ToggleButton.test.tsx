import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ToggleButton from '@/app/components/ToggleButton'
import { FAVORITE_TOGGLE_CONFIG, VISITED_TOGGLE_CONFIG } from '@/app/components/toggleConfigs'

const mockFetch = vi.fn()
global.fetch = mockFetch

const mockPlausible = vi.fn()
vi.mock('next-plausible', () => ({
  usePlausible: () => mockPlausible,
}))

const mockUseAuth = vi.fn()
vi.mock('@/app/components/AuthProvider', () => ({
  useAuth: () => mockUseAuth(),
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signInWithOAuth: vi.fn(),
    },
  }),
}))

// Both configs' inactive/active aria-labels, combined into one pattern each,
// so the same assertions run against favorite ("Favorite"/"Favorited") and
// visited ("Mark as visited"/"Visited") without special-casing either.
const anyStatePattern = (config: typeof FAVORITE_TOGGLE_CONFIG) =>
  new RegExp(`${config.ariaLabelInactive}|${config.ariaLabelActive}`, 'i')
const activeOnlyPattern = (config: typeof FAVORITE_TOGGLE_CONFIG) => new RegExp(`^${config.ariaLabelActive}$`, 'i')

const cases = [
  { name: 'favorite', config: FAVORITE_TOGGLE_CONFIG },
  { name: 'visited', config: VISITED_TOGGLE_CONFIG },
]

describe.each(cases)('ToggleButton ($name config)', ({ config }) => {
  const defaultProps = {
    shopUUID: 'test-uuid-123',
    shopName: 'Test Coffee Shop',
    config,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockReset()
  })

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({ user: null, loading: false })
    })

    it('renders the toggle button', () => {
      render(<ToggleButton {...defaultProps} />)
      expect(screen.getByRole('button', { name: anyStatePattern(config) })).toBeInTheDocument()
    })

    it('shows login modal when clicking the button', async () => {
      render(<ToggleButton {...defaultProps} />)

      fireEvent.click(screen.getByRole('button', { name: anyStatePattern(config) }))

      await waitFor(() => {
        expect(screen.getByText('Sign in to save favorites')).toBeInTheDocument()
      })
    })

    it('does not make an API call when clicking the button', () => {
      render(<ToggleButton {...defaultProps} />)

      fireEvent.click(screen.getByRole('button', { name: anyStatePattern(config) }))

      expect(mockFetch).not.toHaveBeenCalledWith(config.apiPath, expect.objectContaining({ method: 'POST' }))
    })

    it('does not check status on mount when not authenticated', async () => {
      render(<ToggleButton {...defaultProps} />)

      await waitFor(() => {
        expect(mockFetch).not.toHaveBeenCalledWith(config.apiPath)
      })
    })
  })

  describe('when user is authenticated', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({ user: { id: 'user-123', email: 'test@example.com' }, loading: false })
    })

    it('checks status on mount', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) })

      render(<ToggleButton {...defaultProps} />)

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(config.apiPath)
      })
    })

    it('does not show the login modal when toggling', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ success: true }) })

      render(<ToggleButton {...defaultProps} />)

      await waitFor(() => expect(screen.getByRole('button', { name: anyStatePattern(config) })).not.toBeDisabled())
      fireEvent.click(screen.getByRole('button', { name: anyStatePattern(config) }))

      expect(screen.queryByText('Sign in to save favorites')).not.toBeInTheDocument()
    })

    it('makes a POST call when toggling on', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ success: true }) })

      render(<ToggleButton {...defaultProps} />)

      await waitFor(() => expect(screen.getByRole('button', { name: anyStatePattern(config) })).not.toBeDisabled())
      fireEvent.click(screen.getByRole('button', { name: anyStatePattern(config) }))

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(config.apiPath, expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ shopUUID: 'test-uuid-123' }),
        }))
      })
    })

    it('shows the active state when the shop is already toggled on', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([{ shop: { uuid: 'test-uuid-123' } }]) })

      render(<ToggleButton {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: activeOnlyPattern(config) })).toBeInTheDocument()
      })
    })

    it('does not fire the analytics event on mount', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([{ shop: { uuid: 'test-uuid-123' } }]) })

      render(<ToggleButton {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: activeOnlyPattern(config) })).toBeInTheDocument()
      })
      expect(mockPlausible).not.toHaveBeenCalledWith(config.analyticsEvent, expect.anything())
    })

    it('fires the analytics event with correct props when toggling on', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ success: true }) })

      render(<ToggleButton {...defaultProps} />)

      await waitFor(() => expect(screen.getByRole('button', { name: anyStatePattern(config) })).not.toBeDisabled())
      fireEvent.click(screen.getByRole('button', { name: anyStatePattern(config) }))

      await waitFor(() => {
        expect(mockPlausible).toHaveBeenCalledWith(config.analyticsEvent, {
          props: { shopName: 'Test Coffee Shop', shopUUID: 'test-uuid-123', status: true },
        })
      })
    })

    it('fires the analytics event with correct props when toggling off', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([{ shop: { uuid: 'test-uuid-123' } }]) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ success: true }) })

      render(<ToggleButton {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: activeOnlyPattern(config) })).toBeInTheDocument()
      })
      fireEvent.click(screen.getByRole('button', { name: activeOnlyPattern(config) }))

      await waitFor(() => {
        expect(mockPlausible).toHaveBeenCalledWith(config.analyticsEvent, {
          props: { shopName: 'Test Coffee Shop', shopUUID: 'test-uuid-123', status: false },
        })
      })
    })

    it('makes a DELETE call when toggling off', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([{ shop: { uuid: 'test-uuid-123' } }]) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ success: true }) })

      render(<ToggleButton {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: activeOnlyPattern(config) })).toBeInTheDocument()
      })
      fireEvent.click(screen.getByRole('button', { name: activeOnlyPattern(config) }))

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(config.apiPath, expect.objectContaining({
          method: 'DELETE',
          body: JSON.stringify({ shopUUID: 'test-uuid-123' }),
        }))
      })
    })

    it('shows the toast with this config\'s message and link when toggling on', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ success: true }) })

      render(<ToggleButton {...defaultProps} />)

      await waitFor(() => expect(screen.getByRole('button', { name: anyStatePattern(config) })).not.toBeDisabled())
      fireEvent.click(screen.getByRole('button', { name: anyStatePattern(config) }))

      await waitFor(() => {
        expect(screen.getByText(config.toast.verbPhrase, { exact: false })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: config.toast.viewLabel })).toHaveAttribute('href', config.toast.viewHref)
      })
    })
  })

  describe('when auth is loading', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({ user: null, loading: true })
    })

    it('does not check status while auth is loading', async () => {
      render(<ToggleButton {...defaultProps} />)

      await new Promise(resolve => setTimeout(resolve, 100))
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })
})
