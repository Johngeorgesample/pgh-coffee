import { describe, test, expect, vi } from 'vitest'

const h = vi.hoisted(() => ({ readFileSync: vi.fn(() => Buffer.from('fake-png-bytes')) }))
vi.mock('node:fs', () => ({ readFileSync: h.readFileSync, default: { readFileSync: h.readFileSync } }))

describe('ogTheme asset loaders', () => {
  test('reads the logo from disk at most once per process', async () => {
    const { getOgLogoSrc } = await import('@/app/utils/ogTheme')

    const first = getOgLogoSrc()
    const second = getOgLogoSrc()

    expect(second).toBe(first)
    expect(h.readFileSync).toHaveBeenCalledTimes(1)
  })

  test('reads the watermark from disk at most once per process, independently of the logo', async () => {
    const { getOgLogoSrc, getOgWatermarkSrc } = await import('@/app/utils/ogTheme')

    getOgLogoSrc()
    const first = getOgWatermarkSrc()
    const second = getOgWatermarkSrc()

    expect(second).toBe(first)
    // One read for the logo (previous test) + one for the watermark, not one
    // shared cache between the two independent once() instances.
    expect(h.readFileSync).toHaveBeenCalledTimes(2)
  })
})
