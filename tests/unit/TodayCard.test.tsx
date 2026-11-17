import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import TodayCard from '@/app/components/advent/TodayCard'
import { AdventDay } from '@/data/advent'

const entry: AdventDay = { day: 2, roasterName: 'Commonplace Coffee', coffee: 'Ratnagiri Estate', notes: [], agtron: 91.3 }

describe('TodayCard', () => {
  it('falls back to the Agtron reading when the roaster gave no roast level', () => {
    render(<TodayCard step={2} entry={entry} />)
    expect(screen.getByText('Agtron 91')).toBeInTheDocument()
  })

  it('leaves out tiles for details the roaster has not sent', () => {
    render(<TodayCard step={2} entry={entry} />)
    expect(screen.queryByText('Varietal')).not.toBeInTheDocument()
  })
})
