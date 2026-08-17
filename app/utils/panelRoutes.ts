const PANEL_PATH_PREFIXES = ['/shops/', '/events/', '/news/', '/roasters/', '/companies/']

// Only the params some hook actually reads: useNewsRouteSync reads `news`,
// useEventRouteSync reads `events`. Listing a param nothing owns (`?company=`,
// from before companies moved to their own route) would block the teardown for a
// panel that never arrives.
const PANEL_QUERY_PARAMS = ['news', 'events']

/**
 * Whether some route-sync hook owns the panel at this location. A route-sync
 * hook exiting its own route uses this to decide between tearing the panel down
 * and handing it to whichever hook owns the destination — those hooks fetch
 * before they set content, so tearing down first would flash Explore and, worse,
 * reset the history their panel is about to be pushed onto.
 */
export const isPanelOwnedRoute = (pathname: string, params: { has: (name: string) => boolean }) =>
  PANEL_PATH_PREFIXES.some(prefix => pathname.startsWith(prefix)) ||
  PANEL_QUERY_PARAMS.some(param => params.has(param))

// Routes whose panel installs its own map filter (overrideShops). A hook leaving
// for one of these must leave the filter alone: the destination's panel replaces
// it once its fetch resolves, and clearing on the way out would un-filter the map
// for the whole request.
const MAP_FILTER_PATH_PREFIXES = ['/companies/', '/roasters/']

export const ownsMapFilter = (pathname: string) =>
  MAP_FILTER_PATH_PREFIXES.some(prefix => pathname.startsWith(prefix))
