import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import AdventRoute from '@/app/components/advent/AdventRoute'

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
    expect(screen.getByText('Jar 12')).toBeInTheDocument()
  })

  it('only opens a sealed jar after the spoiler warning is accepted', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-12-03T12:00:00-05:00'))
    render(<AdventRoute />)

    fireEvent.click(screen.getByRole('button', { name: 'Open Dec 4 early' }))
    fireEvent.click(screen.getByRole('button', { name: 'Open it' }))
    fireEvent.click(screen.getByRole('button', { name: 'Nevermind' }))
    const link = (day: number) => screen.getAllByRole('link').find(a => a.getAttribute('href') === `/advent/${day}`)
    expect(link(4)).toBeUndefined()

    fireEvent.click(screen.getByRole('button', { name: 'Open Dec 4 early' }))
    fireEvent.click(screen.getByRole('button', { name: 'Open it' }))
    fireEvent.click(screen.getByRole('button', { name: 'Open anyway' }))
    await waitFor(() => expect(link(4)).toBeDefined())
    expect(link(4)).toHaveTextContent(/^Dec\s*4/)
    expect(link(4)!.firstElementChild).toHaveClass('animate-stamp')
    expect(link(2)!.firstElementChild).not.toHaveClass('animate-stamp')
  })
})
