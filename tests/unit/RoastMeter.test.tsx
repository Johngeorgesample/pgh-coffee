import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import RoastMeter from '@/app/components/advent/RoastMeter'

describe('RoastMeter', () => {
  test('announces the reading even without a roast description', () => {
    render(<RoastMeter agtron={70} />)
    const meter = screen.getByRole('meter', { name: 'Roast level' })
    expect(meter).toHaveAttribute('aria-valuenow', '50')
    expect(meter).toHaveAttribute('aria-valuetext', 'Agtron 70 (lower is darker)')
  })
})
