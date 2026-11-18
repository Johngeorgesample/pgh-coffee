import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import AdventRoute from '@/app/components/advent/AdventRoute'

vi.mock('@/public/advent/top.webp', () => ({ default: { src: '/advent/top.webp', width: 2819, height: 800 } }))
vi.mock('@/public/advent/left.webp', () => ({ default: { src: '/advent/left.webp', width: 2882, height: 800 } }))

describe('AdventRoute', () => {
  afterEach(() => vi.useRealTimers())

  it('stamps the days before today and keeps later days locked', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-12-03T12:00:00-05:00'))
    render(<AdventRoute />)

    expect(screen.getAllByText('Dec').map(el => el.nextElementSibling?.textContent)).toEqual(['1', '2'])
    expect(screen.getByText('Opens Dec 4')).toBeInTheDocument()
  })
})
