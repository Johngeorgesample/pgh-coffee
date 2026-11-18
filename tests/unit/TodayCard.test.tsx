import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import TodayCard from '@/app/components/advent/TodayCard'
import { AdventDay } from '@/data/advent'

vi.mock('@/public/advent/top.webp', () => ({ default: { src: '/advent/top.webp', width: 2819, height: 800 } }))

const entry: AdventDay = { day: 2, roasterName: 'Commonplace Coffee', coffee: 'Ratnagiri Estate', notes: [], agtron: 91.3 }

describe('TodayCard', () => {
  it('leaves out details the roaster has not sent', () => {
    render(<TodayCard entry={entry} step={2} href="/advent/2" />)
    expect(screen.queryByText('Varietal')).not.toBeInTheDocument()
  })
})
