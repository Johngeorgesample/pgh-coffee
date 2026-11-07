import { describe, test, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NewsDetails } from '@/app/components/NewsDetails'
import type { NewsItem } from '@/types/news-types'

const pushMock = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}))

vi.mock('@/hooks', () => ({
  useShopSelection: () => ({ handleShopSelect: vi.fn() }),
  useCopyToClipboard: () => ({ showToast: false, copyCurrentUrl: vi.fn(), closeToast: vi.fn() }),
  useAnalytics: () => vi.fn(),
}))

const newsWithRoaster = {
  id: 'news-1',
  title: 'Commonplace adds a new single origin',
  roaster: { name: 'Commonplace Coffee', slug: 'commonplace-coffee' },
} as NewsItem

describe('NewsDetails roaster link', () => {
  beforeEach(() => {
    pushMock.mockClear()
  })

  test('clicking the roaster navigates to its /roasters/{slug} page', () => {
    render(<NewsDetails news={newsWithRoaster} />)

    // The full news object (with its roaster) is now passed in directly, no fetch to await.
    const roasterButton = screen.getByRole('button', { name: /Commonplace Coffee/ })
    fireEvent.click(roasterButton)

    // The /roasters/{slug} route is what useRoasterRouteSync listens for; the
    // old ?roaster= query param this replaced went unhandled.
    expect(pushMock).toHaveBeenCalledWith('/roasters/commonplace-coffee')
  })
})
