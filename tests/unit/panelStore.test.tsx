import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { createElement } from 'react'
import usePanelStore, { setPanelNavigate } from '@/stores/panelStore'
import { buildContentSlug } from '@/app/utils/slug'

const navigate = vi.fn()
let replaceState: ReturnType<typeof vi.spyOn>

function setPathname(pathname: string) {
  Object.defineProperty(window, 'location', {
    value: new URL(`https://pgh.coffee${pathname}`),
    writable: true,
    configurable: true,
  })
}

// Panel entries are keyed off their React element props (see getURLParamForEntry).
const companyEntry = createElement('div', { slug: 'acme' })
const newsItem = { id: 'a1b2c3d4-0000-0000-0000-000000000000', title: 'Commonplace adds a new roast' }
const newsEntry = createElement('div', { news: newsItem })
const shopEntry = createElement('div', {
  shop: { properties: { name: 'KLVN', neighborhood: 'Larimer', uuid: 'e3bd219a-c907-4b6c-9a78-d4c177bc7e1a' } },
})

describe('panelStore back() URL sync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setPanelNavigate(navigate)
    replaceState = vi.spyOn(window.history, 'replaceState').mockImplementation(() => {})
    usePanelStore.getState().reset()
  })

  afterEach(() => {
    setPanelNavigate(null)
    replaceState.mockRestore()
  })

  test('backing out of a /shops/[slug] route goes through the router, not replaceState', () => {
    setPathname('/shops/klvn-larimer-e3bd219a')
    const { setPanelContent, back } = usePanelStore.getState()
    setPanelContent(companyEntry, 'company')
    setPanelContent(shopEntry, 'shop')

    back() // -> company entry; pathname changes /shops/... -> /companies/acme

    expect(navigate).toHaveBeenCalledWith('/companies/acme')
    expect(replaceState).not.toHaveBeenCalled()
  })

  test('backing out to a news entry restores its /news/[slug] URL', () => {
    // NewsDetails takes a single `news` object prop (not top-level id/title),
    // so this locks in that getURLParamForEntry reads it from the right shape.
    setPathname('/')
    const { setPanelContent, back } = usePanelStore.getState()
    setPanelContent(newsEntry, 'news')
    setPanelContent(shopEntry, 'shop')

    back() // -> news entry

    expect(navigate).toHaveBeenCalledWith(`/news/${buildContentSlug(newsItem)}`)
  })

  test('backing out to a news entry with no title falls back to the ?news query, not a malformed slug', () => {
    setPathname('/')
    const { setPanelContent, back } = usePanelStore.getState()
    setPanelContent(createElement('div', { news: { id: newsItem.id, title: '' } }), 'news')
    setPanelContent(shopEntry, 'shop')

    back() // -> news entry

    expect(replaceState).toHaveBeenCalled()
    expect(navigate).not.toHaveBeenCalled()
  })

  test('a same-pathname query change stays on replaceState (no router navigation)', () => {
    setPathname('/')
    const { setPanelContent, back } = usePanelStore.getState()
    // The events list lives on `/` as a query panel (?events), so backing to it
    // is a same-pathname change that should use replaceState, not the router.
    setPanelContent(createElement('div', {}), 'events')
    setPanelContent(shopEntry, 'shop')

    back() // -> events entry; pathname stays /

    expect(replaceState).toHaveBeenCalled()
    expect(navigate).not.toHaveBeenCalled()
  })
})
