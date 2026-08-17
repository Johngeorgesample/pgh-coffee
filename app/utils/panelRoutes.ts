const PANEL_PATH_PREFIXES = ['/shops/', '/events/', '/news/', '/roasters/', '/companies/']
const PANEL_QUERY_PARAMS = ['company', 'roaster', 'news', 'event', 'events']

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
