import { describe, test, expect } from 'vitest'
import { isPanelOwnedRoute } from '@/app/utils/panelRoutes'

const at = (url: string) => {
  const { pathname, searchParams } = new URL(url, 'https://pgh.coffee')
  return isPanelOwnedRoute(pathname, searchParams)
}

describe('isPanelOwnedRoute', () => {
  test('claims the detail routes that each have a route-sync hook', () => {
    expect(at('/shops/klvn-larimer-e3bd219a')).toBe(true)
    expect(at('/companies/commonplace-coffee-co')).toBe(true)
    expect(at('/roasters/commonplace-roasting')).toBe(true)
    expect(at('/news/a-new-shop-a1b2c3d4')).toBe(true)
    expect(at('/events/latte-art-throwdown-a1b2c3d4')).toBe(true)
  })

  test('claims the list params a hook actually reads', () => {
    expect(at('/?news')).toBe(true)
    expect(at('/?events')).toBe(true)
  })

  test('leaves the bare map route unclaimed', () => {
    expect(at('/')).toBe(false)
    expect(at('/?neighborhood=Bloomfield')).toBe(false)
  })

  test('does not claim params no hook installs a panel for', () => {
    // Legacy query params from before these moved to their own routes: claiming
    // them would block a teardown while waiting on a panel that never arrives.
    expect(at('/?company=commonplace-coffee-co')).toBe(false)
    expect(at('/?roaster=commonplace-roasting')).toBe(false)
  })
})
