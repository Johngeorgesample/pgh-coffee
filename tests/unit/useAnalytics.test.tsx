import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAnalytics } from '@/hooks/useAnalytics'

const mockPlausible = vi.fn()
vi.mock('next-plausible', () => ({
  usePlausible: () => mockPlausible,
}))

const mockPushEvent = vi.fn()
vi.mock('@/lib/faro', () => ({
  getFaro: () => ({ api: { pushEvent: mockPushEvent } }),
}))

describe('useAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('forwards the event to plausible unchanged', () => {
    const { result } = renderHook(() => useAnalytics())
    act(() => result.current('FeaturePointClick', { props: { shopName: 'Margaux', neighborhood: 'East Liberty' } }))
    expect(mockPlausible).toHaveBeenCalledWith('FeaturePointClick', {
      props: { shopName: 'Margaux', neighborhood: 'East Liberty' },
    })
  })

  it('calls faro pushEvent with stringified props', () => {
    const { result } = renderHook(() => useAnalytics())
    act(() => result.current('favorite', { props: { shopName: 'Margaux', status: true } }))
    expect(mockPushEvent).toHaveBeenCalledWith('favorite', { shopName: 'Margaux', status: 'true' })
  })

  it('calls faro pushEvent with undefined attributes when no props provided', () => {
    const { result } = renderHook(() => useAnalytics())
    act(() => result.current('SearchFABClick'))
    expect(mockPushEvent).toHaveBeenCalledWith('SearchFABClick', undefined)
  })

  it('filters out undefined prop values before passing to faro', () => {
    const { result } = renderHook(() => useAnalytics())
    act(() => result.current('EventCardClick', { props: { eventTitle: 'Latte Art Throwdown', shopName: undefined } }))
    expect(mockPushEvent).toHaveBeenCalledWith('EventCardClick', { eventTitle: 'Latte Art Throwdown' })
  })

  it('does not throw when faro is not initialized', () => {
    vi.doMock('@/lib/faro', () => ({ getFaro: () => null }))
    const { result } = renderHook(() => useAnalytics())
    expect(() => act(() => result.current('SearchFABClick'))).not.toThrow()
  })
})
