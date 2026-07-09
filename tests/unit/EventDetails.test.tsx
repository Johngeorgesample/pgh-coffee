import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EventDetails } from '@/app/components/EventDetails'
import type { EventCardData } from '@/app/components/EventCard'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/hooks', () => ({
  useCopyToClipboard: () => ({ showToast: false, copyCurrentUrl: vi.fn(), closeToast: vi.fn() }),
  useAnalytics: () => vi.fn(),
}))

const baseEvent: EventCardData = {
  id: 'event-1',
  title: 'Starts with Coffee',
}

describe('EventDetails verified badges', () => {
  test('shows badge for verified roaster and company-verified shop', () => {
    render(
      <EventDetails
        event={{
          ...baseEvent,
          roaster: { name: "It's Still Coffee", slug: 'its-still-coffee', is_verified: true },
          shop: { name: 'De Fer', neighborhood: 'Downtown', uuid: 'u1', company: { is_verified: true } },
        }}
      />,
    )
    expect(screen.getAllByText('Verified')).toHaveLength(2)
  })

  test('no badge for unverified entities', () => {
    render(
      <EventDetails
        event={{
          ...baseEvent,
          roaster: { name: "It's Still Coffee", slug: 'its-still-coffee' },
          shop: { name: 'De Fer', neighborhood: 'Downtown', uuid: 'u1' },
        }}
      />,
    )
    expect(screen.queryByText('Verified')).toBeNull()
  })
})
