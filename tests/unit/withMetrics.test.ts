import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockRequestCompleted } = vi.hoisted(() => ({ mockRequestCompleted: vi.fn() }))

vi.mock('@/lib/metrics', () => ({ metrics: { requestCompleted: mockRequestCompleted } }))

import { withMetrics } from '@/lib/withMetrics'

describe('withMetrics', () => {
  beforeEach(() => mockRequestCompleted.mockClear())

  it('reports the route name and response status', async () => {
    const handler = withMetrics('favorites:POST', async () => new Response(null, { status: 201 }))

    await handler()

    expect(mockRequestCompleted).toHaveBeenCalledWith('favorites:POST', 201, expect.any(Number))
  })

  it('returns the handler response and forwards its arguments', async () => {
    const response = new Response(null, { status: 204 })
    const inner = vi.fn(async () => response)

    const result = await withMetrics('visits', inner)('request', { params: 'p' })

    expect(result).toBe(response)
    expect(inner).toHaveBeenCalledWith('request', { params: 'p' })
  })
})
