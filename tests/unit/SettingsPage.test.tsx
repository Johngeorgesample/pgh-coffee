import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Settings from '@/app/settings/page'

describe('Settings page', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders the default unit on a first visit without writing to storage', async () => {
    render(<Settings />)

    await waitFor(() => {
      expect(screen.getByText('Miles')).toBeInTheDocument()
    })
    expect(window.localStorage.getItem('distanceUnits')).toBeNull()

    render(<Settings />)
    await waitFor(() => {
      expect(screen.getAllByText('Miles')).toHaveLength(2)
    })
  })

  it('renders a previously stored unit unchanged', async () => {
    window.localStorage.setItem('distanceUnits', 'Meters')

    render(<Settings />)

    await waitFor(() => {
      expect(screen.getByText('Meters')).toBeInTheDocument()
    })
  })

  // An empty string is a stored-but-blank value, not "nothing stored" — it must
  // self-heal to the default rather than rendering blank forever.
  it('treats an empty stored value the same as nothing stored', async () => {
    window.localStorage.setItem('distanceUnits', '')

    render(<Settings />)

    await waitFor(() => {
      expect(screen.getByText('Miles')).toBeInTheDocument()
    })
  })

  it('falls back to the default for an unrecognized stored value', async () => {
    window.localStorage.setItem('distanceUnits', 'kilometers')

    render(<Settings />)

    await waitFor(() => {
      expect(screen.getByText('Miles')).toBeInTheDocument()
    })
    expect(screen.queryByText('kilometers')).toBeNull()
  })
})
