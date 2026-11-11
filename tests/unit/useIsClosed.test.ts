import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import useShopsStore, { useIsClosed } from '@/stores/coffeeShopsStore'

const morningOnly = [{ day_of_week: 2, opens_at: '07:00:00', closes_at: '11:00:00', spans_midnight: false }]

describe('useIsClosed', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-11-10T20:00:00Z'))
    useShopsStore.setState({ openNow: true, shopHours: { morning: morningOnly } })
  })
  afterEach(() => vi.useRealTimers())

  it('calls a shop closed outside its hours', () => {
    const { result } = renderHook(() => useIsClosed())
    expect(result.current('morning')).toBe(true)
  })

  it('does not call a shop closed when we have no hours for it', () => {
    const { result } = renderHook(() => useIsClosed())
    expect(result.current('unknown')).toBe(false)
  })

  it('closes nothing while the filter is off', () => {
    useShopsStore.setState({ openNow: false })
    const { result } = renderHook(() => useIsClosed())
    expect(result.current('morning')).toBe(false)
  })
})
