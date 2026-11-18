import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import AdventRoute from '@/app/components/advent/AdventRoute'

vi.mock('@/public/advent/top.webp', () => ({ default: { src: '/advent/top.webp', width: 2819, height: 800 } }))
vi.mock('@/public/advent/left.webp', () => ({ default: { src: '/advent/left.webp', width: 2882, height: 800 } }))

describe('AdventRoute', () => {
  afterEach(() => vi.useRealTimers())

  it('stamps the days before today and keeps later days locked', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-12-03T12:00:00-05:00'))
    render(<AdventRoute />)

    const opened = screen.getAllByRole('link').map(a => a.getAttribute('href')).filter(href => href?.startsWith('/advent/'))
    expect(opened).toContain('/advent/2')
    expect(screen.getAllByRole('link').find(a => a.getAttribute('href') === '/advent/2')).toHaveTextContent(/^Dec\s*2/)
    expect(opened).not.toContain('/advent/4')
    expect(screen.getByRole('button', { name: 'Peek at Dec 4 early' })).toBeInTheDocument()
  })

  it('dates today by its place in the chosen order and says which jar to open', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-12-03T12:00:00-05:00'))
    render(<AdventRoute />)

    fireEvent.click(screen.getByRole('button', { name: 'North to south' }))
    expect(screen.getByText('Today · Dec 3')).toBeInTheDocument()
    expect(screen.getByText('Jar 12')).toBeInTheDocument()
  })

  it('stamps a peeked day the same way as an opened one', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-12-03T12:00:00-05:00'))
    render(<AdventRoute />)

    fireEvent.click(screen.getByRole('button', { name: 'Peek at Dec 4 early' }))
    fireEvent.click(screen.getByRole('button', { name: 'Show me' }))
    const link = (day: number) => screen.getAllByRole('link').find(a => a.getAttribute('href') === `/advent/${day}`)!
    expect(link(4)).toHaveTextContent(/^Dec\s*4/)
    expect(link(4).firstElementChild).toHaveClass('animate-stamp')
    expect(link(2).firstElementChild).not.toHaveClass('animate-stamp')
  })
})
