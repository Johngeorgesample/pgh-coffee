import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { ShopNews } from '@/app/components/ShopNews'
import type { TShop } from '@/types/shop-types'
import type { NewsItem } from '@/types/news-types'

vi.mock('@/app/components/NewsCard', () => ({
  NewsCard: ({ item }: { item: NewsItem }) => <div data-testid="news-item">{item.title}</div>,
}))

const shop: TShop = {
  type: 'Feature',
  properties: {
    company: null,
    name: 'Commonplace Coffee',
    neighborhood: 'Bloomfield',
    address: '123 Main St',
    website: 'https://example.com',
    uuid: 'shop-uuid-1',
  },
  geometry: { type: 'Point', coordinates: [-79.925, 40.4363] },
}

const otherShop: TShop = { ...shop, properties: { ...shop.properties, uuid: 'shop-uuid-2' } }

describe('ShopNews', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  test('queries /api/updates scoped to this shop', async () => {
    ;(fetch as any).mockResolvedValueOnce({ ok: true, json: async () => [] })

    render(<ShopNews shop={shop} />)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/updates?shop_id=shop-uuid-1', expect.objectContaining({ signal: expect.anything() }))
    })
  })

  test('aborts the in-flight request when the shop changes before it resolves', async () => {
    let capturedSignal: AbortSignal | undefined
    ;(fetch as any).mockImplementationOnce((_url: string, opts: RequestInit) => {
      capturedSignal = opts.signal as AbortSignal
      return new Promise(() => {}) // never resolves, standing in for a slow request
    })

    const { rerender } = render(<ShopNews shop={shop} />)
    await waitFor(() => expect(capturedSignal).toBeDefined())

    ;(fetch as any).mockResolvedValueOnce({ ok: true, json: async () => [] })
    rerender(<ShopNews shop={otherShop} />)

    expect(capturedSignal?.aborted).toBe(true)
  })

  test('clears the previous shop\'s updates immediately on switch, before the new fetch settles', async () => {
    const shopAUpdates: NewsItem[] = [{ id: '1', title: 'Shop A update' }]
    ;(fetch as any).mockResolvedValueOnce({ ok: true, json: async () => shopAUpdates })

    const { rerender } = render(<ShopNews shop={shop} />)
    await waitFor(() => expect(screen.getByText('Shop A update')).toBeInTheDocument())

    ;(fetch as any).mockImplementationOnce(() => new Promise(() => {}))
    rerender(<ShopNews shop={otherShop} />)

    expect(screen.queryByText('Shop A update')).not.toBeInTheDocument()
  })

  test('ignores a stale response that resolves after the shop already changed', async () => {
    let resolveShopA: (value: unknown) => void = () => {}
    ;(fetch as any).mockImplementationOnce(
      () => new Promise(resolve => { resolveShopA = resolve }),
    )

    const { rerender } = render(<ShopNews shop={shop} />)
    await waitFor(() => expect(fetch).toHaveBeenCalled())

    ;(fetch as any).mockResolvedValueOnce({ ok: true, json: async () => [] })
    rerender(<ShopNews shop={otherShop} />)

    resolveShopA({ ok: true, json: async () => [{ id: '1', title: 'Shop A update' }] })
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(screen.queryByText('Shop A update')).not.toBeInTheDocument()
  })

  test('renders nothing when the shop has no updates', async () => {
    ;(fetch as any).mockResolvedValueOnce({ ok: true, json: async () => [] })

    const { container } = render(<ShopNews shop={shop} />)

    await waitFor(() => expect(fetch).toHaveBeenCalled())
    expect(container).toBeEmptyDOMElement()
  })

  test('renders the server-provided updates in the order returned', async () => {
    const updates: NewsItem[] = [
      { id: '1', title: 'Newest update' },
      { id: '2', title: 'Older update' },
    ]
    ;(fetch as any).mockResolvedValueOnce({ ok: true, json: async () => updates })

    render(<ShopNews shop={shop} />)

    await waitFor(() => expect(screen.getByText('Newest update')).toBeInTheDocument())
    const rendered = screen.getAllByTestId('news-item').map(el => el.textContent)
    expect(rendered).toEqual(['Newest update', 'Older update'])
  })
})
