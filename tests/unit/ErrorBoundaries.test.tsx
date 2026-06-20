import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RootError from '@/app/error'
import AccountError from '@/app/account/error'

describe('Root error boundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('shows a message and calls reset when "Try again" is clicked', () => {
    const reset = vi.fn()
    render(<RootError error={new Error('boom')} reset={reset} />)

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /try again/i }))
    expect(reset).toHaveBeenCalledOnce()
  })

  it('links back to the home page', () => {
    render(<RootError error={new Error('boom')} reset={vi.fn()} />)

    expect(screen.getByRole('link', { name: /go home/i })).toHaveAttribute('href', '/')
  })
})

describe('Account error boundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('shows a message and calls reset when "Try again" is clicked', () => {
    const reset = vi.fn()
    render(<AccountError error={new Error('boom')} reset={reset} />)

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /try again/i }))
    expect(reset).toHaveBeenCalledOnce()
  })
})
