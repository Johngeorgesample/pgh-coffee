# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (uses Turbopack)
- **Build**: `npm run build`
- **Production server**: `npm start`
- **Linting**: `npm run lint` (oxlint, not ESLint — there is no `.eslintrc`)
- **Type check**: `npm run typecheck` (`tsc --noEmit`)
- **Tests**: `npm test` (Vitest, **watch mode** — use `npx vitest run` for a single pass)

## Environment Setup

Server-side (read at runtime by API routes, `lib/logger.ts`, `lib/metrics.ts`):
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`: used by every API route that talks to the database
- `MIMIR_URL`, `MIMIR_USER`, `MIMIR_PASSWORD`: metrics remote-write
- `LOKI_URL`, `LOKI_USER`, `LOKI_PASSWORD`: log shipping
- `CAPTURE_SECRET`: shared secret for the `/api/*/capture` ingest routes
- `ANTHROPIC_API_KEY`: used by `lib/capture.ts` and the two `capture` routes to summarize scraped content

Browser-side:
- `MAPBOX_ACCESS_TOKEN`: Mapbox token with all Public scopes, injected into client bundles via the `env` block in `next.config.js`
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`: used by the browser Supabase client for auth

`.env.example` is not a complete list — it omits `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `CAPTURE_SECRET`, and `ANTHROPIC_API_KEY`, even though `SUPABASE_URL`/`SUPABASE_ANON_KEY` have ~25 call sites each. Check `process.env` call sites before assuming a variable is unused. `scripts/` accepts either the bare or the `NEXT_PUBLIC_` form (see `scripts/README.md`).

## Architecture Overview

This is a Next.js 15 App Router application that displays Pittsburgh coffee shops on an interactive map, alongside roasters, companies, events, and news.

### Core Data Flow

1. **Data source**: PostgreSQL database hosted on Supabase
2. **API layer**: Next.js route handlers under `app/api/` query Supabase; `app/api/shops/geojson` transforms rows to GeoJSON via `formatDataToGeoJSON` in `app/utils/utils.ts`
3. **State management**: Zustand stores in `stores/` — shop data, panel stack, explore list
4. **Client app**: `HomeClient` mounts the map and panel, and registers the route-sync hooks that translate the URL into panel content

### Key Components

- **HomeClient** (`app/components/HomeClient.tsx`): rendered by `app/(map)/layout.tsx`. Owns the panel/map layout, the mobile `presented` state, panel close behaviour, and the document title. It does **not** own shop selection — see `useShopSelection`.
- **MapContainerLazy** (`app/components/MapContainerLazy.tsx`): what `HomeClient` actually renders. It `dynamic()`-imports **MapContainer** with `ssr: false` *and* holds it behind a `requestIdleCallback` (200ms `setTimeout` fallback), showing a `map-placeholder` div until then — so tests and screenshots need to wait for the real map. **MapContainer** (`app/components/MapContainer.tsx`) draws the Mapbox GL map with `react-map-gl`.
- **Panel** (`app/components/Panel.tsx`): the slide-out container. Its children come from `panelStore.panelContent`, so it renders whatever the current panel mode put there.
- **ShopDetails** (`app/components/ShopDetails.tsx`): a thin wrapper over `PanelHeader` + `PanelContent`; `PanelContent` is where amenities, hours, roaster, events, news, and `NearbyShops` live.
- **ShopSearch** (`app/components/ShopSearch.tsx`): amenity filters plus a `ShopList` of the currently displayed shops. Filtering is driven by `searchValue` in the store (typed into `SearchBar`), not by local state here.

### State Management Pattern

Three Zustand stores, all wrapped in `devtools`:

- **`stores/coffeeShopsStore.ts`** — default export is `useCoffeeShopsStore`, imported everywhere as `useShopsStore`. Holds `allShops` (GeoJSON `FeatureCollection` fetched once from `/api/shops/geojson`; `fetchCoffeeShops` no-ops if already populated), `currentShop`, `hoveredShop`, `searchValue`, `activeAmenityFilters`, and `overrideShops`. **Read the derived list through `useDisplayedShops()`**, not `allShops` — it applies search + amenity filters, honours `overrideShops` (company/roaster pages), and stamps `properties.selected`.
- **`stores/panelStore.ts`** — the panel content stack. `panelMode` is one of `explore | search | shop | list | news | events | company | roaster | event`. `setPanelNavigate` lets popping history drive real router navigation.
- **`stores/exploreStore.ts`** — the explore panel's three independent feeds (featured shop, events, news), each with its own `*Loading`/`*Error` flags and `fetch*` action.

### URL Synchronization

Selection is **path-based**, not query-param based. Shops live at `/shops/<slug>`, where the slug is `` `${slugify(name)}-${slugify(neighborhood)}-${uuid.slice(0,8)}` `` built by `buildShopSlug` in `app/utils/shopSlug.ts` (`extractUuidPrefix` reverses the suffix). Roasters, companies, events, and news have parallel `/(map)/<kind>/[slug]` routes.

- Selecting a shop goes through **`useShopSelection().handleShopSelect`** (`hooks/useShopSelection.tsx`): sets `currentShop`, clears filters, `router.push`es the slug route, sets panel content, and fires a `FeaturePointClick` Plausible event.
- The reverse direction is a set of route-sync hooks registered in `HomeClient`: `useShopRouteSync`, `useCompanyRouteSync`, `useRoasterRouteSync`, `useNewsRouteSync`, `useEventRouteSync`, `useURLNeighborhoodSync`. Each reads `useParams()`/`usePathname()`, guards on its own path prefix (every `[slug]` route shares the same param name), fetches its record, and writes the panel. On leaving the route it clears the selection.
- `HomeClient.removeSearchParam` still strips legacy `shop`/`company`/`roaster`/`news`/`event`/`events` query params on close and returns to `/`.

### API Routes

Route handlers live throughout `app/api/`, not only under `shops/`. Shop-related:
- `GET /api/shops` — all shops as plain JSON, optional `?neighborhood=` filter
- `GET /api/shops/geojson` — all shops as a GeoJSON `FeatureCollection`, CDN-cached
- `GET /api/shops/by-slug/[slug]` — a single shop by the `buildShopSlug` identifier (there is no `[shopDetails]` route)
- `GET /api/shops/batch`, `/api/shops/hours/[uuid]`, `/api/shops/static-map/[lng]/[lat]`
- `POST /api/shops/submit` — inserts into the `moderation` table
- `POST /api/shops/claim`, `/api/shops/report`, `/api/shops/report-amenities`

Other groups: `api/events/*`, `api/updates/*` (news), `api/companies/[company]/*`, `api/roasters/[slug]`, `api/profiles/*`, `api/favorites`, `api/visits`, `api/curated-lists`, `api/featured-shop`, `api/auth/event`. `app/api-docs` renders the browsable list.

`middleware.ts` runs `updateSession` (Supabase auth cookie refresh) on nearly every request.

### Map Interaction

`MAP_CONSTANTS` inside `MapContainer` holds the tunables:
- Two stacked circle layers: a `shop-border` halo (radius + 2, white when hovered or selected, otherwise transparent) under the interactive `myPoint` layer.
- `myPoint` fill: `#FDE047` (yellow) by default, `#fff` when `properties.selected`, yellow when `properties.hovered`.
- Radius interpolates linearly across three zoom stops — 4px at zoom 8, 8px at zoom 12, 12px at zoom 16.
- Clicks are handled by `handleMapClick`, which `queryRenderedFeatures` on `myPoint`, then **re-hydrates the shop from the store by `uuid`** — `queryRenderedFeatures` strips nested properties like `company` — before calling `handleShopSelect`.
- Above zoom 15 every in-view shop gets a persistent `ShopPopup`; below that, hover shows a single popup.
- A change to `currentShopCoordinates` triggers `flyTo`.

### Testing

- Framework: Vitest 4 with jsdom
- Include glob is `tests/**/*.test.ts` and `tests/**/*.test.tsx` (see `vitest.config.ts`) — plain `.ts` route-handler tests are collected too, and `tests/helpers/` holds shared helpers
- Setup: `tests/setupTests.ts` imports `@testing-library/jest-dom`
- Path alias `@/` resolves to project root (configured in both `tsconfig.json` and `vitest.config.ts`)

### Monitoring & Analytics

- **Plausible Analytics**: `PlausibleProvider domain="pgh.coffee" trackOutboundLinks` in `app/layout.tsx`; custom events go through the `useAnalytics()` hook. `netlify.toml` proxies the Plausible script and event endpoints.
- **Grafana Faro**: `FaroInit` (`app/components/FaroInit.tsx`) lazily imports the web SDK and tracing instrumentation on mount; the instance is stashed via `lib/faro.ts`.
- **Server-side**: `lib/logger.ts` ships logs to Loki and `lib/metrics.ts` writes metrics to Mimir. `withMetrics(name, handler)` is the wrapper for this, but only 4 of the ~28 route handlers currently use it — the rest call `logger`/`metrics` directly or not at all.

### Shop Submission Guidelines

Criteria stated on the submission form (`app/components/submit/SubmitForm.tsx`) — copy, not validation; the `POST /api/shops/submit` handler only requires `name` and `address`:
- Local independent businesses only — no chains or franchises headquartered elsewhere
- Must be located within Allegheny County

### TypeScript Patterns

- Path alias `@/*` maps to project root
- Do not annotate return types (see the user's global convention)
- Types in `types/`:
  - `shop-types.ts`: `TShop` GeoJSON Feature and `TFeatureCollection`
  - `neighborhood-types.ts`: `TNeighborhood`, a string-literal union of Pittsburgh neighborhoods (a union, not an `enum`)
  - `unit-types.ts`: `TUnits`, `DISTANCE_UNITS`, `DEFAULT_UNITS`, `parseUnits`
  - `claim-types.ts`, `news-types.ts`

### Distance Units

`DISTANCE_UNITS` has exactly two values, **`Miles` and `Meters`** (not kilometers). The preference is stored in `localStorage` under `DISTANCE_UNITS_STORAGE_KEY` (`'distanceUnits'`) and read back through `parseUnits`, which falls back to `DEFAULT_UNITS` (`Miles`) for anything unrecognized.

## Build & verification gotchas

- **`npm run lint` may fail with `sh: oxlint: command not found`.** `oxlint` is in `devDependencies` but can be missing from a `node_modules` installed before the ESLint→oxlint swap (a3967b8). Run `npm install` first.
- **`npm run typecheck` currently reports one pre-existing error** in `tests/unit/useNewsRouteSync.test.tsx` (TS2461). Don't assume your change caused it — check `git status` first.

- **Don't `npm run build` while `npm run dev` is running.** The build overwrites `.next` under the dev server, which then 500s on every route. The app is fine; only the dev process is poisoned. Stop dev first, or `rm -rf .next` and restart it.
- **The first build after `rm -rf .next` can die** with `PageNotFoundError: Cannot find module for page: /_document`. Re-running the identical command succeeds. The partial `.nft.json` files it leaves behind are misleading if you're inspecting them.
- **`og:image` is an absolute `https://pgh.coffee/...` URL in a production build** (relative in dev), so `curl`ing it against a local `next start` silently fetches the deployed site. Swap the origin for localhost before fetching.
- **Dynamic-segment OG routes aren't served at their source path.** `/shops/<slug>/opengraph-image` 404s; the real path is hashed (`/opengraph-image-11ib4g?<hash>`). Scrape it out of the page's `og:image` meta tag. Static ones like `/opengraph-image` work as written.

## Working agreement

- Before saying a change is done, run `npm run lint` and `npm test` and report the actual result. Don't claim it works without exercising it.
- Non-trivial logic (a branch, a parser, a money/auth path) leaves one runnable check behind — not a suite, just the smallest test that fails if the logic breaks.
- If you're unsure why something breaks, say so and investigate. Don't guess at a fix and present it as certain.
