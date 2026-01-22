import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import FavoriteButton from '@/app/components/FavoriteButton'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock next-plausible
vi.mock('next-plausible', () => ({
  usePlausible: () => vi.fn(),
}))

// Mock AuthProvider
const mockUseAuth = vi.fn()
vi.mock('@/app/components/AuthProvider', () => ({
  useAuth: () => mockUseAuth(),
}))

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signInWithOAuth: vi.fn(),
    },
  }),
}))

describe('FavoriteButton', () => {
  const defaultProps = {
    shopUUID: 'test-uuid-123',
    shopName: 'Test Coffee Shop',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockReset()
  })

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
      })
    })

    it('renders the favorite button', () => {
      render(<FavoriteButton {...defaultProps} />)
      expect(screen.getByRole('button', { name: /favorite/i })).toBeInTheDocument()
    })

    it('shows login modal when clicking favorite button', async () => {
      render(<FavoriteButton {...defaultProps} />)

      const button = screen.getByRole('button', { name: /favorite/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText('Sign in to save favorites')).toBeInTheDocument()
      })
    })

    it('does not make API call when clicking favorite', async () => {
      render(<FavoriteButton {...defaultProps} />)

      const button = screen.getByRole('button', { name: /favorite/i })
      fireEvent.click(button)

      expect(mockFetch).not.toHaveBeenCalledWith('/api/favorites', expect.objectContaining({
        method: 'POST',
      }))
    })

    it('does not check favorite status on mount when not authenticated', async () => {
      render(<FavoriteButton {...defaultProps} />)

      await waitFor(() => {
        // Should not call GET /api/favorites when user is not authenticated
        expect(mockFetch).not.toHaveBeenCalledWith('/api/favorites')
      })
    })
  })

  describe('when user is authenticated', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: { id: 'user-123', email: 'test@example.com' },
        loading: false,
      })
    })

    it('checks favorite status on mount', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      })

      render(<FavoriteButton {...defaultProps} />)

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/favorites')
      })
    })

    it('makes POST API call when clicking favorite', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([]),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })

      render(<FavoriteButton {...defaultProps} />)

      // Wait for button to be enabled (loading complete)
      await waitFor(() => {
        const button = screen.getByRole('button', { name: /favorite/i })
        expect(button).not.toBeDisabled()
      })

      const button = screen.getByRole('button', { name: /favorite/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/favorites', expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ shopUUID: 'test-uuid-123' }),
        }))
      })
    })

    it('does not show login modal when clicking favorite', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([]),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })

      render(<FavoriteButton {...defaultProps} />)

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled()
      })

      const button = screen.getByRole('button', { name: /favorite/i })
      fireEvent.click(button)

      expect(screen.queryByText('Sign in to save favorites')).not.toBeInTheDocument()
    })

    it('shows favorited state when shop is already favorited', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([
          { shop: { uuid: 'test-uuid-123' } },
        ]),
      })

      render(<FavoriteButton {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /favorited/i })).toBeInTheDocument()
      })
    })

    it('makes DELETE API call when unfavoriting', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([
            { shop: { uuid: 'test-uuid-123' } },
          ]),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })

      render(<FavoriteButton {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /favorited/i })).toBeInTheDocument()
      })

      const button = screen.getByRole('button', { name: /favorited/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/favorites', expect.objectContaining({
          method: 'DELETE',
          body: JSON.stringify({ shopUUID: 'test-uuid-123' }),
        }))
      })
    })
  })

  describe('when auth is loading', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
      })
    })

    it('does not check favorite status while loading', async () => {
      render(<FavoriteButton {...defaultProps} />)

      // Wait a bit and verify no fetch was made
      await new Promise(resolve => setTimeout(resolve, 100))
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })
})
