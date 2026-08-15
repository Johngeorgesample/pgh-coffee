import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Settings from '@/app/settings/page'

describe('Settings page', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  // Regression for S19: the page used to read `null` from localStorage on a
  // first visit, write the default in, but leave state holding the `null` it
  // had already read — so the unit rendered blank, disagreeing with what a
  // reload would then read back from the now-seeded localStorage.
  it('renders the same default unit on a first visit that it persists for a reload', async () => {
    render(<Settings />)

    await waitFor(() => {
      expect(screen.getByText('Miles')).toBeInTheDocument()
    })
    expect(window.localStorage.getItem('distanceUnits')).toBe('Miles')
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
    expect(window.localStorage.getItem('distanceUnits')).toBe('Miles')
  })
})
