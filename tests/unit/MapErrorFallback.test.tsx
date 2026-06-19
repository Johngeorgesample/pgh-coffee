import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MapErrorFallback from '@/app/components/MapErrorFallback'

describe('MapErrorFallback', () => {
  it('renders a retry button', () => {
    render(<MapErrorFallback onRetry={vi.fn()} />)
    expect(screen.getByRole('button', { name: /try again/i })).toBeTruthy()
  })

  it('calls onRetry once when the button is clicked', () => {
    const onRetry = vi.fn()
    render(<MapErrorFallback onRetry={onRetry} />)
    fireEvent.click(screen.getByRole('button', { name: /try again/i }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
