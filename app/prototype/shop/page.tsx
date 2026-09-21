'use client'

/**
 * DESIGN PROTOTYPE — not wired to real data.
 * Hardcoded around De Fer Coffee & Tea (Strip District) to explore a richer
 * shop details page. Throwaway: delete app/prototype when done.
 */

import {
  ArrowTopRightOnSquareIcon,
  BuildingStorefrontIcon,
  ChevronRightIcon,
  ClockIcon,
  MapPinIcon,
  StarIcon,
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'
import {
  Flame,
  Wifi,
  Plug,
  Sun,
  Accessibility,
  Car,
  Dog,
  Heart,
  Share2,
  Navigation,
  Instagram,
} from 'lucide-react'

const shop = {
  name: 'De Fer Coffee & Tea',
  neighborhood: 'Strip District',
  address: '2002 Smallman St, Pittsburgh, PA 15222',
  rating: 4.7,
  reviewCount: 412,
  priceLevel: 2,
  photo:
    'https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=1200&q=70',
  blurb:
    'A Strip District anchor known for meticulous espresso and a serious loose-leaf tea program. The cavernous, light-filled room doubles as one of the neighborhood’s best work-and-linger spots.',
  knownFor: ['Espresso', 'Loose-leaf tea', 'Laptop-friendly', 'Pastries'],
  status: { open: true, until: '6:00 PM' },
  hours: [
    { day: 'Mon', range: '7 AM – 6 PM' },
    { day: 'Tue', range: '7 AM – 6 PM' },
    { day: 'Wed', range: '7 AM – 6 PM', today: true },
    { day: 'Thu', range: '7 AM – 6 PM' },
    { day: 'Fri', range: '7 AM – 7 PM' },
    { day: 'Sat', range: '8 AM – 7 PM' },
    { day: 'Sun', range: '8 AM – 5 PM' },
  ],
  menu: [
    { name: 'Cortado', price: '$4.00', note: 'House espresso' },
    { name: 'Pour Over', price: '$5.50', note: 'Rotating single origin' },
    { name: 'London Fog', price: '$5.00', note: 'Earl grey + vanilla' },
  ],
  gallery: [
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=600&q=70',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=70',
    'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=600&q=70',
  ],
  amenities: [
    { label: 'Free WiFi', icon: Wifi },
    { label: 'Outlets', icon: Plug },
    { label: 'Outdoor seating', icon: Sun },
    { label: 'Accessible', icon: Accessibility },
    { label: 'Street parking', icon: Car },
    { label: 'Dog friendly', icon: Dog },
  ],
  nearby: [
    { name: 'Commonplace Coffee', neighborhood: 'Strip District', dist: '0.2 mi' },
    { name: 'Ineffable Cà Phê', neighborhood: 'Strip District', dist: '0.4 mi' },
    { name: 'Adda Coffee & Tea', neighborhood: 'Strip District', dist: '0.6 mi' },
  ],
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i =>
        i <= Math.round(rating) ? (
          <StarSolid key={i} className="h-3.5 w-3.5 text-yellow-400" />
        ) : (
          <StarIcon key={i} className="h-3.5 w-3.5 text-white/50" />
        )
      )}
    </span>
  )
}

export default function ShopPrototype() {
  const price = '$'.repeat(shop.priceLevel)

  return (
    <div className="min-h-screen bg-stone-100 py-0 sm:py-8">
      {/* Simulated slide-out panel width */}
      <div className="mx-auto w-full max-w-[440px] bg-[#FAF9F7] shadow-xl sm:rounded-2xl overflow-hidden">
        {/* ---- Hero ---- */}
        <div
          className="relative h-64 bg-stone-300 bg-cover bg-center"
          style={{ backgroundImage: `url('${shop.photo}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          {/* Open-now pill, top-right */}
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/95 px-2.5 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              Open · until {shop.status.until}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <button className="mb-3 inline-flex items-center gap-1.5 rounded-full border-none bg-white/15 px-3 py-1.5 text-xs text-white/90 backdrop-blur-sm transition-colors hover:bg-white/25">
              <BuildingStorefrontIcon className="h-3.5 w-3.5" />
              <span className="opacity-80">Part of</span>
              <span className="font-semibold">De Fer Coffee &amp; Tea</span>
            </button>
            <h1 className="font-serif text-3xl leading-tight tracking-tight">{shop.name}</h1>
            <div className="mt-1.5 flex items-center gap-2 text-sm text-white/85">
              <Stars rating={shop.rating} />
              <span className="font-medium text-white">{shop.rating}</span>
              <span className="opacity-60">({shop.reviewCount})</span>
              <span className="opacity-50">·</span>
              <span>{price}</span>
              <span className="opacity-50">·</span>
              <span>{shop.neighborhood}</span>
            </div>
          </div>
        </div>

        {/* ---- Primary actions ---- */}
        <div className="flex gap-2 border-b border-stone-200 bg-white px-5 py-3">
          <button className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800">
            <Navigation className="h-4 w-4" />
            Directions
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition-colors hover:bg-gray-100">
            <Heart className="h-[18px] w-[18px]" />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition-colors hover:bg-gray-100">
            <Share2 className="h-[18px] w-[18px]" />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition-colors hover:bg-gray-100">
            <ArrowTopRightOnSquareIcon className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="px-5 py-5">
          {/* ---- Curator blurb ---- */}
          <p className="font-serif text-[15px] italic leading-relaxed text-stone-700">
            {shop.blurb}
          </p>

          {/* ---- Known for ---- */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {shop.knownFor.map(tag => (
              <span
                key={tag}
                className="rounded-full bg-stone-200/70 px-2.5 py-1 text-xs font-medium text-stone-700"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* ---- Roaster card (ties into the roaster feature) ---- */}
          <a
            href="/roasters/de-fer"
            className="group mt-5 flex items-center gap-3 rounded-xl border border-gray-200 p-3 transition-colors hover:border-gray-300 hover:bg-gray-50"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-300 text-gray-950">
              <Flame className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Roasts in-house
              </span>
              <span className="block truncate text-sm font-medium text-gray-900">
                De Fer Roasting Co.
              </span>
            </span>
            <ChevronRightIcon className="h-4 w-4 shrink-0 text-gray-400 transition-colors group-hover:text-gray-600" />
          </a>
        </div>

        <div className="h-px bg-stone-200" />

        {/* ---- Hours ---- */}
        <div className="px-5 py-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Hours</h2>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
              <ClockIcon className="h-3.5 w-3.5" />
              Open now
            </span>
          </div>
          <div className="mt-3 space-y-1">
            {shop.hours.map(h => (
              <div
                key={h.day}
                className={`flex justify-between rounded-md px-2 py-1 text-sm ${
                  h.today ? 'bg-yellow-100 font-semibold text-gray-900' : 'text-gray-600'
                }`}
              >
                <span>{h.day}</span>
                <span>{h.range}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-stone-200" />

        {/* ---- Signature menu ---- */}
        <div className="px-5 py-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Signature drinks
          </h2>
          <div className="mt-3 space-y-2.5">
            {shop.menu.map(item => (
              <div key={item.name} className="flex items-baseline justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="truncate text-xs text-gray-500">{item.note}</p>
                </div>
                <span className="shrink-0 text-sm font-medium tabular-nums text-stone-700">
                  {item.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-stone-200" />

        {/* ---- Photos ---- */}
        <div className="py-5">
          <h2 className="px-5 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Photos
          </h2>
          <div className="mt-3 flex gap-2 overflow-x-auto px-5 pb-1">
            {shop.gallery.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="h-28 w-36 shrink-0 rounded-lg object-cover"
              />
            ))}
          </div>
        </div>

        <div className="h-px bg-stone-200" />

        {/* ---- Map + address ---- */}
        <div className="px-5 py-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Location</h2>
          <div className="relative mt-3 h-32 overflow-hidden rounded-xl bg-gradient-to-br from-stone-200 to-stone-300">
            {/* stylized streets */}
            <div className="absolute inset-0 opacity-40">
              <div className="absolute left-0 right-0 top-1/3 h-1.5 bg-white" />
              <div className="absolute left-0 right-0 top-2/3 h-1.5 bg-white" />
              <div className="absolute bottom-0 left-1/4 top-0 w-1.5 bg-white" />
              <div className="absolute bottom-0 right-1/3 top-0 w-1.5 bg-white" />
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
              <MapPinIcon className="h-7 w-7 fill-yellow-300 text-gray-950" />
            </div>
          </div>
          <a
            href="#"
            className="group mt-3 flex items-start gap-2 text-sm text-stone-700 transition-colors hover:text-amber-700"
          >
            <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0" />
            <address className="not-italic font-medium leading-snug">{shop.address}</address>
          </a>
        </div>

        <div className="h-px bg-stone-200" />

        {/* ---- Amenities ---- */}
        <div className="px-5 py-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Amenities</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {shop.amenities.map(a => {
              const Icon = a.icon
              return (
                <div
                  key={a.label}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                >
                  <Icon className="h-4 w-4 text-stone-500" />
                  {a.label}
                </div>
              )
            })}
          </div>
        </div>

        <div className="h-px bg-stone-200" />

        {/* ---- Nearby ---- */}
        <div className="px-5 py-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Nearby shops
          </h2>
          <div className="mt-3 space-y-1">
            {shop.nearby.map(n => (
              <a
                key={n.name}
                href="#"
                className="group flex items-center justify-between rounded-lg px-2 py-2.5 transition-colors hover:bg-stone-100"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{n.name}</p>
                  <p className="text-xs text-gray-500">{n.neighborhood}</p>
                </div>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  {n.dist}
                  <ChevronRightIcon className="h-4 w-4 transition-colors group-hover:text-gray-600" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
