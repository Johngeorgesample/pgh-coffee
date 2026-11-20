import { describe, expect, it } from 'vitest'
import { histogramSeries, nextCounterTotal } from '@/lib/metrics'

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

describe('histogramSeries', () => {
  const totals = (series: ReturnType<typeof histogramSeries>) =>
    Object.fromEntries(series.map((s) => [`${s.name}${s.labels.le ? `{le=${s.labels.le}}` : ''}`, s.samples.at(-1)![0]]))

  it('counts a request in every bucket at or above its duration, cumulatively per instance', () => {
    histogramSeries('h_seconds', { route: 'shops' }, 0.7, 1000)
    const second = totals(histogramSeries('h_seconds', { route: 'shops' }, 3, 2000))

    expect(second).toMatchObject({
      'h_seconds_bucket{le=0.5}': 0,
      'h_seconds_bucket{le=1}': 1,
      'h_seconds_bucket{le=2.5}': 1,
      'h_seconds_bucket{le=5}': 2,
      'h_seconds_bucket{le=+Inf}': 2,
      h_seconds_count: 2,
      h_seconds_sum: 3.7,
    })
  })

  it('starts each new series at zero so rate() sees an instance that served one request', () => {
    const [firstBucket] = histogramSeries('k_seconds', { route: 'events' }, 3, 5000)
    const [laterBucket] = histogramSeries('k_seconds', { route: 'events' }, 3, 6000)

    expect(firstBucket.samples).toEqual([[0, 4999], [0, 5000]])
    expect(laterBucket.samples).toEqual([[0, 6000]])
  })
})
