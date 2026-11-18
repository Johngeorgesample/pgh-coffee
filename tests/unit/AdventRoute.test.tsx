import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import AdventRoute from '@/app/components/advent/AdventRoute'

const push = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }))
vi.mock('@/public/advent/top.webp', () => ({ default: { src: '/advent/top.webp', width: 2819, height: 800 } }))
vi.mock('@/public/advent/left.webp', () => ({ default: { src: '/advent/left.webp', width: 2882, height: 800 } }))

describe('AdventRoute', () => {
  afterEach(() => {
    vi.useRealTimers()
    window.history.replaceState(null, '', '/')
  })

  it('stamps the days before today and keeps later days locked', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-12-03T12:00:00-05:00'))
    render(<AdventRoute />)

    const opened = screen.getAllByRole('link').map(a => a.getAttribute('href')).filter(href => href?.startsWith('/advent/'))
    expect(opened).toContain('/advent/2')
    expect(screen.getAllByRole('link').find(a => a.getAttribute('href') === '/advent/2')).toHaveTextContent(/^Dec\s*2/)
    expect(opened).not.toContain('/advent/4')
    expect(screen.getByRole('button', { name: 'Open Dec 4 early' })).toBeInTheDocument()
  })

  it('leads with today, then the opened jars, then the sealed ones', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-12-03T12:00:00-05:00'))
    render(<AdventRoute />)

    const today = screen.getByText('Today · Dec 3')
    const opened = screen.getByRole('heading', { name: 'Opened' })
    const sealed = screen.getByRole('heading', { name: 'Still sealed' })
    expect(today.compareDocumentPosition(opened) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(opened.compareDocumentPosition(sealed) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('keeps every jar sealed and unopenable before December, counting down to the first', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-18T12:00:00-05:00'))
    render(<AdventRoute />)

    expect(screen.queryAllByRole('link').filter(a => a.getAttribute('href')?.startsWith('/advent/'))).toHaveLength(0)
    expect(screen.queryByRole('button', { name: /^Open Dec/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'North to south' })).not.toBeInTheDocument()
    expect(screen.getByText('13 days to go')).toBeInTheDocument()
  })

  it('pretends it is the dev-day in December when that param is set', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-18T12:00:00-05:00'))
    window.history.replaceState(null, '', '/advent?dev-day=3')
    render(<AdventRoute />)

    expect(screen.getByText('Today · Dec 3')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open Dec 4 early' })).toBeInTheDocument()
  })

  it('dates today by its place in the chosen order and says which jar to open', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-12-03T12:00:00-05:00'))
    render(<AdventRoute />)

    fireEvent.click(screen.getByRole('button', { name: 'North to south' }))
    expect(screen.getByText('Today · Dec 3')).toBeInTheDocument()
    expect(screen.getByAltText('Jar 17')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Colombia Cauca' })).toHaveAttribute('href', '/advent/17?order=geo')
  })

  it("only goes to a sealed jar's day after the spoiler warning is accepted, leaving it sealed", async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-12-03T12:00:00-05:00'))
    render(<AdventRoute />)

    fireEvent.click(screen.getByRole('button', { name: 'Open Dec 4 early' }))
    fireEvent.click(screen.getByRole('button', { name: 'Open it' }))
    fireEvent.click(screen.getByRole('button', { name: 'Nevermind' }))
    expect(push).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Open Dec 4 early' }))
    fireEvent.click(screen.getByRole('button', { name: 'Open it' }))
    fireEvent.click(screen.getByRole('button', { name: 'Open anyway' }))
    await waitFor(() => expect(push).toHaveBeenCalledWith('/advent/4'))
    expect(screen.getAllByRole('link').find(a => a.getAttribute('href') === '/advent/4')).toBeUndefined()
  })
})
