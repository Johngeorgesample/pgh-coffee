# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (uses Turbopack)
- **Build**: `npm run build`
- **Production server**: `npm start`
- **Linting**: `npm run lint`
- **Tests**: `npm test` (runs all Vitest tests in `tests/unit/`)

## Environment Setup

Required environment variables (see `.env.example`):
- `MAPBOX_ACCESS_TOKEN`: Mapbox API token with all Public scopes
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key

The Mapbox token is injected into client-side code via `next.config.js`.

## Architecture Overview

This is a Next.js 15 App Router application that displays Pittsburgh coffee shops on an interactive map.

### Core Data Flow

1. **Data source**: PostgreSQL database hosted on Supabase containing coffee shop records
2. **API layer**: Next.js API routes (`app/api/shops/`) query Supabase and transform data to GeoJSON
3. **State management**: Zustand store (`stores/coffeeShopsStore.ts`) fetches and caches shop data as GeoJSON
4. **Client app**: `HomeClient` component orchestrates map display, shop selection, and panel interactions

### Key Components

- **HomeClient** (`app/components/HomeClient.tsx`): Main client component managing application state, URL parameters, and coordinating interactions between map and panel
- **MapContainer** (`app/components/MapContainer.tsx`): Renders Mapbox GL map using `react-map-gl`, displays coffee shops as circular markers
- **ShopPanel**: Slide-out panel that displays either shop search or selected shop details
- **ShopDetails**: Shows detailed information for a selected shop, including nearby shops
- **ShopSearch**: Search interface for finding shops by name

### State Management Pattern

The app uses Zustand with devtools middleware for state management. The primary store is `coffeeShopsStore` which:
- Fetches coffee shops from `/api/shops/geojson`
- Stores data in GeoJSON FeatureCollection format
- Components access via `useShopsStore()` hook

### URL Synchronization

Shop selection is synchronized with URL query parameters:
- Pattern: `?shop={name}_{neighborhood}` (URL-encoded)
- Example: `?shop=De%20Fer%20Coffee%20&%20Tea_Downtown`
- On load, `fetchShopFromURL()` reads query param and fetches shop data from API
- On shop selection, URL is updated via `appendSearchParamToURL()`

### API Routes

All routes are in `app/api/shops/`:
- `GET /api/shops` - Returns array of all shops (standard JSON)
- `GET /api/shops/geojson` - Returns all shops as GeoJSON FeatureCollection
- `GET /api/shops/[shopDetails]` - Returns single shop GeoJSON by `{name}_{neighborhood}` identifier
- `POST /api/shops/submit` - Submits new shop to `moderation` table

### Map Interaction

- Circle markers change color when selected (yellow default, white selected)
- Circle radius scales with zoom level (4px at zoom 8, 12px at zoom 16)
- Clicking a marker triggers `onShopSelect` callback in HomeClient
- Selected shop coordinates trigger `flyTo` animation

### Testing

- Framework: Vitest with jsdom environment
- Test files: `tests/unit/*.test.tsx`
- Setup: `tests/setupTests.ts` imports `@testing-library/jest-dom`
- Path alias `@/` resolves to project root (configured in both `tsconfig.json` and `vitest.config.ts`)

### Monitoring & Analytics

- **Plausible Analytics**: Configured via `next-plausible` provider, tracks outbound links
- **Grafana Faro**: Real user monitoring initialized in `FaroInit` component for performance tracking

### Shop Submission Guidelines

Coffee shops must meet these criteria (enforced in submission form):
- Independent coffee shops only (no chains)
- Must have a physical headquarters location
- Must be located in Allegheny County

### TypeScript Patterns

- Path alias `@/*` maps to project root
- Types defined in `types/` directory:
  - `shop-types.ts`: GeoJSON Feature structure for coffee shops
  - `neighborhood-types.ts`: Neighborhood enumeration
  - `unit-types.ts`: Distance unit types

### Distance Units

User preference for distance units (miles/kilometers) is stored in localStorage with key `distanceUnits`. Default is miles.
