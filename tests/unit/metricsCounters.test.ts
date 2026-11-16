import { describe, expect, it } from 'vitest'
import { nextCounterTotal } from '@/lib/metrics'

describe('nextCounterTotal', () => {
  it('accumulates a running total per metric and label set', () => {
    expect(nextCounterTotal('t_total', { neighborhood: 'Shadyside' }, 1)).toBe(1)
    expect(nextCounterTotal('t_total', { neighborhood: 'Shadyside' }, 2)).toBe(3)
  })

  it('keeps separate totals for different label values', () => {
    expect(nextCounterTotal('u_total', { neighborhood: 'Oakland' }, 1)).toBe(1)
    expect(nextCounterTotal('u_total', { neighborhood: 'Bloomfield' }, 1)).toBe(1)
  })

  it('treats label order as irrelevant', () => {
    nextCounterTotal('v_total', { a: '1', b: '2' }, 1)
    expect(nextCounterTotal('v_total', { b: '2', a: '1' }, 1)).toBe(2)
  })
})
