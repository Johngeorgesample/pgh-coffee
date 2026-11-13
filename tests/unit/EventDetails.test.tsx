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
  test('shows badge for verified roaster and shop', () => {
    render(
      <EventDetails
        event={{
          ...baseEvent,
          roaster: { name: "It's Still Coffee", slug: 'its-still-coffee', is_verified: true },
          shop: { name: 'De Fer', neighborhood: 'Downtown', uuid: 'u1', is_verified: true },
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

describe('EventDetails time', () => {
  test('renders the start time in 12-hour format', () => {
    render(<EventDetails event={{ ...baseEvent, event_date: '2020-11-21', start_time: '18:30:00' }} />)
    expect(screen.getByText('6:30 PM')).toBeInTheDocument()
  })

  test('renders a range when there is an end time', () => {
    render(<EventDetails event={{ ...baseEvent, event_date: '2020-11-21', start_time: '10:00:00', end_time: '12:00:00' }} />)
    expect(screen.getByText('10:00 AM – 12:00 PM')).toBeInTheDocument()
  })

  test('omits the time block when there is no time', () => {
    render(<EventDetails event={{ ...baseEvent, event_date: '2020-11-21' }} />)
    expect(screen.queryByText('Time')).toBeNull()
  })
})
