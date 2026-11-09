import Link from 'next/link'
import { LocateFixed } from 'lucide-react'
import { NEAR_ME } from '@/hooks/useNearRouteSync'

const DOWNTOWN_MAP = '/api/shops/static-map/-79.99585/40.44074'

export function NearMeCTA() {
  return (
    <>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">Shops near you</h3>
      <Link
        href={`/?near=${NEAR_ME}`}
        className="group mt-3 block overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition-all hover:shadow-md"
      >
        <div className="relative h-28 bg-stone-800">
          <img src={DOWNTOWN_MAP} alt="" className="size-full object-cover opacity-80" loading="lazy" />
          <span className="absolute left-1/2 top-1/2 flex size-4 -translate-x-1/2 -translate-y-1/2">
            <span className="absolute inline-flex size-full rounded-full bg-blue-500 opacity-75 motion-safe:animate-ping" />
            <span className="relative inline-flex size-4 rounded-full border-2 border-white bg-blue-500" />
          </span>
        </div>
        <div className="flex items-center gap-3 p-4">
          <p className="flex-1 text-sm text-slate-600">See the closest shops to wherever you are right now.</p>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-yellow-300 px-3 py-1.5 text-sm font-semibold text-stone-900">
            <LocateFixed className="size-4" />
            Use my location
          </span>
        </div>
      </Link>
    </>
  )
}
