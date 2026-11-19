import { fireEvent, render, screen } from '@testing-library/react'
import PassportToggle from '@/app/components/PassportToggle'
import useShopsStore from '@/stores/coffeeShopsStore'

describe('PassportToggle', () => {
  beforeEach(() => useShopsStore.setState({ visitedUUIDs: null, passportMode: false }))

  it('stays hidden until the user has a visit', () => {
    useShopsStore.setState({ visitedUUIDs: new Set() })
    render(<PassportToggle />)
    expect(screen.queryByRole('switch')).not.toBeInTheDocument()
  })

  it('turns passport mode on', () => {
    useShopsStore.setState({ visitedUUIDs: new Set(['a']) })
    render(<PassportToggle />)
    fireEvent.click(screen.getByRole('switch'))
    expect(useShopsStore.getState().passportMode).toBe(true)
  })

  it('leaves passport mode when the last visit is removed', () => {
    useShopsStore.setState({ visitedUUIDs: new Set(['a']), passportMode: true })
    useShopsStore.getState().setVisited('a', false)
    expect(useShopsStore.getState().passportMode).toBe(false)
  })
})
