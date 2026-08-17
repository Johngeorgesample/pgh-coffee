import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Settings from '@/app/settings/page'

describe('Settings page', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  // Regression for S19: the page used to render blank on a first visit, because
  // it read `null` from localStorage and kept it. The default is now derived on
  // read (parseUnits), so a first visit renders it without writing anything —
  // and a reload derives the same value from the same absent key.
  it('renders the default unit on a first visit without writing to storage', async () => {
    render(<Settings />)

    await waitFor(() => {
      expect(screen.getByText('Miles')).toBeInTheDocument()
    })
    expect(window.localStorage.getItem('distanceUnits')).toBeNull()

    // A reload sees the same absent key and must resolve it identically.
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
  // resolve to the default rather than rendering blank forever.
  it('treats an empty stored value the same as nothing stored', async () => {
    window.localStorage.setItem('distanceUnits', '')

    render(<Settings />)

    await waitFor(() => {
      expect(screen.getByText('Miles')).toBeInTheDocument()
    })
  })

  // An unrecognized value (an older build, or hand-edited storage) must not
  // render raw — it resolves to the default like any other unusable value.
  it('falls back to the default for an unrecognized stored value', async () => {
    window.localStorage.setItem('distanceUnits', 'kilometers')

    render(<Settings />)

    await waitFor(() => {
      expect(screen.getByText('Miles')).toBeInTheDocument()
    })
    expect(screen.queryByText('kilometers')).toBeNull()
  })
})
