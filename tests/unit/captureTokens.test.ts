import { afterEach, describe, expect, it, vi } from 'vitest'

const { mockAnthropicTokens } = vi.hoisted(() => ({ mockAnthropicTokens: vi.fn() }))

vi.mock('@/lib/metrics', () => ({ metrics: { anthropicTokens: mockAnthropicTokens } }))
vi.mock('@/lib/supabase/server-client', () => ({ getClient: vi.fn() }))

import { callAnthropicVision } from '@/lib/capture'

const respondWith = (body: unknown) =>
  vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(body) })))

describe('callAnthropicVision token metrics', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    mockAnthropicTokens.mockClear()
  })

  it('records input and output tokens from the response usage', async () => {
    respondWith({ content: [{ text: '{"ok":true}' }], usage: { input_tokens: 12, output_tokens: 34 } })

    await callAnthropicVision('prompt', 'base64', 'image/png')

    expect(mockAnthropicTokens).toHaveBeenCalledWith('input', 12)
    expect(mockAnthropicTokens).toHaveBeenCalledWith('output', 34)
  })

  it('records zero tokens when the response has no usage block', async () => {
    respondWith({ content: [{ text: '{"ok":true}' }] })

    await callAnthropicVision('prompt', 'base64', 'image/png')

    expect(mockAnthropicTokens).toHaveBeenCalledWith('input', 0)
    expect(mockAnthropicTokens).toHaveBeenCalledWith('output', 0)
  })
})
