import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Settings from '@/app/account/components/Settings'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('Settings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockReset()
  })

  describe('loading state', () => {
    it('shows loading skeleton while fetching preferences', async () => {
      mockFetch.mockImplementation(() => new Promise(() => {})) // Never resolves

      const { container } = render(<Settings />)

      expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
    })
  })

  describe('unauthorized state', () => {
    it('shows sign in message when user is not authenticated', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Unauthorized' }),
      })

      render(<Settings />)

      await waitFor(() => {
        expect(
          screen.getByText('Please sign in to manage your notification preferences')
        ).toBeInTheDocument()
      })
    })
  })

  describe('with no existing preferences', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            global: null,
            shops: [],
          }),
      })
    })

    it('renders the email notifications heading', async () => {
      render(<Settings />)

      await waitFor(() => {
        expect(screen.getByText('Email Notifications')).toBeInTheDocument()
      })
    })

    it('renders the global notifications toggle', async () => {
      render(<Settings />)

      await waitFor(() => {
        expect(screen.getByText('Receive email updates')).toBeInTheDocument()
        expect(screen.getByRole('switch')).toBeInTheDocument()
      })
    })

    it('starts with notifications disabled by default', async () => {
      render(<Settings />)

      await waitFor(() => {
        const toggle = screen.getByRole('switch')
        expect(toggle).toHaveAttribute('aria-checked', 'false')
      })
    })

    it('does not show frequency and notification types when notifications are disabled', async () => {
      render(<Settings />)

      await waitFor(() => {
        expect(screen.getByRole('switch')).toBeInTheDocument()
      })

      expect(screen.queryByLabelText('Frequency')).not.toBeInTheDocument()
      expect(screen.queryByText('Notification types')).not.toBeInTheDocument()
    })

    it('shows frequency and notification types when notifications are enabled', async () => {
      render(<Settings />)

      await waitFor(() => {
        expect(screen.getByRole('switch')).toBeInTheDocument()
      })

      const toggle = screen.getByRole('switch')
      fireEvent.click(toggle)

      expect(screen.getByLabelText('Frequency')).toBeInTheDocument()
      expect(screen.getByText('Notification types')).toBeInTheDocument()
      expect(screen.getByText('News & announcements')).toBeInTheDocument()
      expect(screen.getByText('New locations')).toBeInTheDocument()
      expect(screen.getByText('Promotions & deals')).toBeInTheDocument()
      expect(screen.getByText('Events')).toBeInTheDocument()
    })

    it('shows message about favoriting shops when no shop preferences exist', async () => {
      render(<Settings />)

      await waitFor(() => {
        expect(screen.getByRole('switch')).toBeInTheDocument()
      })

      const toggle = screen.getByRole('switch')
      fireEvent.click(toggle)

      expect(
        screen.getByText('Favorite some shops to receive notifications about them.')
      ).toBeInTheDocument()
    })

    it('renders the save button', async () => {
      render(<Settings />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Save preferences' })).toBeInTheDocument()
      })
    })
  })

  describe('with existing preferences', () => {
    const mockPreferences = {
      global: {
        id: '1',
        user_id: 'user-123',
        notifications_enabled: true,
        notification_frequency: 'weekly',
        notification_types: ['news', 'events'],
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
      shops: [
        {
          id: 'pref-1',
          user_id: 'user-123',
          shop_id: 'shop-uuid-1',
          subscribed: true,
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          shop: {
            uuid: 'shop-uuid-1',
            name: 'De Fer Coffee & Tea',
            neighborhood: 'Downtown',
          },
        },
        {
          id: 'pref-2',
          user_id: 'user-123',
          shop_id: 'shop-uuid-2',
          subscribed: false,
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          shop: {
            uuid: 'shop-uuid-2',
            name: 'Commonplace Coffee',
            neighborhood: 'Squirrel Hill',
          },
        },
      ],
    }

    beforeEach(() => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPreferences),
      })
    })

    it('loads existing global preferences', async () => {
      render(<Settings />)

      await waitFor(() => {
        const toggle = screen.getByRole('switch')
        expect(toggle).toHaveAttribute('aria-checked', 'true')
      })

      const frequencySelect = screen.getByLabelText('Frequency')
      expect(frequencySelect).toHaveValue('weekly')
    })

    it('loads existing notification types', async () => {
      render(<Settings />)

      await waitFor(() => {
        expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
      })

      const newsCheckbox = screen.getByRole('checkbox', { name: 'News & announcements' })
      const eventsCheckbox = screen.getByRole('checkbox', { name: 'Events' })
      const promotionsCheckbox = screen.getByRole('checkbox', { name: 'Promotions & deals' })
      const locationsCheckbox = screen.getByRole('checkbox', { name: 'New locations' })

      expect(newsCheckbox).toBeChecked()
      expect(eventsCheckbox).toBeChecked()
      expect(promotionsCheckbox).not.toBeChecked()
      expect(locationsCheckbox).not.toBeChecked()
    })

    it('displays shop-specific notifications section', async () => {
      render(<Settings />)

      await waitFor(() => {
        expect(screen.getByText('Shop-specific notifications')).toBeInTheDocument()
      })

      expect(screen.getByText('De Fer Coffee & Tea')).toBeInTheDocument()
      expect(screen.getByText('Downtown')).toBeInTheDocument()
      expect(screen.getByText('Commonplace Coffee')).toBeInTheDocument()
      expect(screen.getByText('Squirrel Hill')).toBeInTheDocument()
    })

    it('displays correct subscription state for each shop', async () => {
      render(<Settings />)

      await waitFor(() => {
        expect(screen.getByText('De Fer Coffee & Tea')).toBeInTheDocument()
      })

      const subscriptionCheckboxes = screen.getAllByRole('checkbox', { name: 'Subscribed' })
      expect(subscriptionCheckboxes[0]).toBeChecked() // De Fer
      expect(subscriptionCheckboxes[1]).not.toBeChecked() // Commonplace
    })
  })

  describe('saving preferences', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            global: null,
            shops: [],
          }),
      })
    })

    it('makes PUT request when saving global preferences', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            id: '1',
            notifications_enabled: true,
            notification_frequency: 'daily',
            notification_types: ['news', 'new_locations'],
          }),
      })

      render(<Settings />)

      await waitFor(() => {
        expect(screen.getByRole('switch')).toBeInTheDocument()
      })

      // Enable notifications
      const toggle = screen.getByRole('switch')
      fireEvent.click(toggle)

      // Save
      const saveButton = screen.getByRole('button', { name: 'Save preferences' })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/account/email-preferences', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: expect.any(String),
        })
      })

      const requestBody = JSON.parse(mockFetch.mock.calls[1][1].body)
      expect(requestBody.notifications_enabled).toBe(true)
      expect(requestBody.notification_frequency).toBe('daily')
      expect(requestBody.notification_types).toEqual(['news', 'new_locations'])
    })

    it('shows success message after saving', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      })

      render(<Settings />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Save preferences' })).toBeInTheDocument()
      })

      const saveButton = screen.getByRole('button', { name: 'Save preferences' })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText('Preferences saved successfully')).toBeInTheDocument()
      })
    })

    it('shows saving state on button while saving', async () => {
      mockFetch.mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(() => resolve({ ok: true, json: () => ({}) }), 100))
      )

      render(<Settings />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Save preferences' })).toBeInTheDocument()
      })

      const saveButton = screen.getByRole('button', { name: 'Save preferences' })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Saving...' })).toBeInTheDocument()
      })
    })

    it('shows error message when saving fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Failed' }),
      })

      render(<Settings />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Save preferences' })).toBeInTheDocument()
      })

      const saveButton = screen.getByRole('button', { name: 'Save preferences' })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText('Failed to save preferences')).toBeInTheDocument()
      })
    })
  })

  describe('toggling shop subscriptions', () => {
    const mockPreferences = {
      global: {
        id: '1',
        user_id: 'user-123',
        notifications_enabled: true,
        notification_frequency: 'daily',
        notification_types: ['news'],
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
      shops: [
        {
          id: 'pref-1',
          user_id: 'user-123',
          shop_id: 'shop-uuid-1',
          subscribed: false,
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          shop: {
            uuid: 'shop-uuid-1',
            name: 'Test Shop',
            neighborhood: 'Test Neighborhood',
          },
        },
      ],
    }

    beforeEach(() => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPreferences),
      })
    })

    it('makes PUT request when toggling shop subscription', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ subscribed: true }),
      })

      render(<Settings />)

      await waitFor(() => {
        expect(screen.getByText('Test Shop')).toBeInTheDocument()
      })

      const subscribeCheckbox = screen.getByRole('checkbox', { name: 'Subscribed' })
      fireEvent.click(subscribeCheckbox)

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/account/email-preferences/shop-uuid-1', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscribed: true }),
        })
      })
    })

    it('performs optimistic update when toggling', async () => {
      mockFetch.mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(() => resolve({ ok: true, json: () => ({}) }), 100))
      )

      render(<Settings />)

      await waitFor(() => {
        expect(screen.getByText('Test Shop')).toBeInTheDocument()
      })

      const subscribeCheckbox = screen.getByRole('checkbox', { name: 'Subscribed' })
      expect(subscribeCheckbox).not.toBeChecked()

      fireEvent.click(subscribeCheckbox)

      // Should be immediately checked due to optimistic update
      expect(subscribeCheckbox).toBeChecked()
    })

    it('reverts optimistic update on failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Failed' }),
      })

      render(<Settings />)

      await waitFor(() => {
        expect(screen.getByText('Test Shop')).toBeInTheDocument()
      })

      const subscribeCheckbox = screen.getByRole('checkbox', { name: 'Subscribed' })
      expect(subscribeCheckbox).not.toBeChecked()

      fireEvent.click(subscribeCheckbox)

      // Initially checked due to optimistic update
      expect(subscribeCheckbox).toBeChecked()

      // Should revert after failure
      await waitFor(() => {
        expect(subscribeCheckbox).not.toBeChecked()
      })

      expect(screen.getByText('Failed to update shop preference')).toBeInTheDocument()
    })
  })

  describe('toggling notification types', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            global: null,
            shops: [],
          }),
      })
    })

    it('toggles notification types when clicking checkboxes', async () => {
      render(<Settings />)

      await waitFor(() => {
        expect(screen.getByRole('switch')).toBeInTheDocument()
      })

      // Enable notifications to show checkboxes
      const toggle = screen.getByRole('switch')
      fireEvent.click(toggle)

      // News is checked by default, uncheck it
      const newsCheckbox = screen.getByRole('checkbox', { name: 'News & announcements' })
      expect(newsCheckbox).toBeChecked()

      fireEvent.click(newsCheckbox)
      expect(newsCheckbox).not.toBeChecked()

      // Promotions is unchecked by default, check it
      const promotionsCheckbox = screen.getByRole('checkbox', { name: 'Promotions & deals' })
      expect(promotionsCheckbox).not.toBeChecked()

      fireEvent.click(promotionsCheckbox)
      expect(promotionsCheckbox).toBeChecked()
    })
  })

  describe('changing frequency', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            global: null,
            shops: [],
          }),
      })
    })

    it('updates frequency when selecting different option', async () => {
      render(<Settings />)

      await waitFor(() => {
        expect(screen.getByRole('switch')).toBeInTheDocument()
      })

      // Enable notifications
      const toggle = screen.getByRole('switch')
      fireEvent.click(toggle)

      const frequencySelect = screen.getByLabelText('Frequency')
      expect(frequencySelect).toHaveValue('daily')

      fireEvent.change(frequencySelect, { target: { value: 'weekly' } })
      expect(frequencySelect).toHaveValue('weekly')

      fireEvent.change(frequencySelect, { target: { value: 'immediate' } })
      expect(frequencySelect).toHaveValue('immediate')
    })
  })

  describe('error handling', () => {
    it('shows error message when initial fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' }),
      })

      render(<Settings />)

      await waitFor(() => {
        expect(screen.getByText('Failed to load preferences')).toBeInTheDocument()
      })
    })
  })
})
