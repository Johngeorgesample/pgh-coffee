'use client'

import { useState } from 'react'
import { Calendar, MapPin } from 'lucide-react'

/**
 * Throwaway design playground for the events/updates photo exploration.
 * Not linked anywhere — visit /preview directly. Delete before shipping the
 * real image_url work.
 */

const IMG = 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80'

const sample = {
  title: 'Summer Solstice: Bukeye Single Origin Coffee Launch',
  tag: 'Offering',
  posted: 'June 30, 2026',
  roaster: 'Commonplace Coffee',
  neighborhood: 'Squirrel Hill',
  description:
    'Commonplace Coffee announced the return of the Summer Solstice series. This washed Brunundi has bright acidity and full, juicy body, perfect for summertime adventures.',
}

type HeroVariant = 'A' | 'B' | 'C' | 'D'
type CardVariant = 'A' | 'B' | 'C'

const heroOptions: { id: HeroVariant; label: string; note: string }[] = [
  { id: 'A', label: 'Full-bleed', note: 'Edge-to-edge hero, title below (current PR)' },
  { id: 'B', label: 'Overlay title', note: 'Title sits on the image with a gradient scrim' },
  { id: 'C', label: 'Inset card', note: 'Rounded image with padding around it' },
  { id: 'D', label: 'No hero', note: 'Small thumbnail beside the title' },
]

const cardOptions: { id: CardVariant; label: string; note: string }[] = [
  { id: 'A', label: 'Top banner', note: 'Image across the top of the card (current PR)' },
  { id: 'B', label: 'Left thumb', note: 'Square thumbnail on the left, text on the right' },
  { id: 'C', label: 'Corner thumb', note: 'Small rounded thumbnail tucked in the corner' },
]

const DetailBody = () => (
  <div className="px-6 pt-6 space-y-6">
    <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-600">
      {sample.tag}
    </span>
    <div className="flex items-start gap-3">
      <div className="bg-yellow-100 p-2.5 rounded-lg">
        <Calendar className="w-4 h-4 text-yellow-500" />
      </div>
      <div>
        <span className="block text-[10px] font-semibold text-yellow-500 uppercase tracking-wider mb-1">
          Posted
        </span>
        <span className="text-slate-900 font-medium text-[15px]">{sample.posted}</span>
      </div>
    </div>
    <div className="border-t border-gray-200 pt-6">
      <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-4">
        About
      </span>
      <p className="text-gray-600 leading-relaxed">{sample.description}</p>
    </div>
  </div>
)

const Hero = ({ variant }: { variant: HeroVariant }) => {
  if (variant === 'A') {
    return (
      <>
        <img src={IMG} alt="" className="w-full h-48 object-cover" />
        <div className="p-6 pb-0">
          <h1 className="font-display text-[28px] font-bold tracking-tight text-slate-900 leading-tight">
            {sample.title}
          </h1>
        </div>
        <DetailBody />
      </>
    )
  }

  if (variant === 'B') {
    return (
      <>
        <div className="relative h-56">
          <img src={IMG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <h1 className="absolute bottom-0 left-0 right-0 p-6 font-display text-[28px] font-bold tracking-tight text-white leading-tight">
            {sample.title}
          </h1>
        </div>
        <DetailBody />
      </>
    )
  }

  if (variant === 'C') {
    return (
      <>
        <div className="p-4 pb-0">
          <img src={IMG} alt="" className="w-full h-44 object-cover rounded-2xl" />
        </div>
        <div className="p-6 pb-0">
          <h1 className="font-display text-[28px] font-bold tracking-tight text-slate-900 leading-tight">
            {sample.title}
          </h1>
        </div>
        <DetailBody />
      </>
    )
  }

  // D — no hero, thumbnail beside title
  return (
    <>
      <div className="flex items-start gap-4 p-6 pb-0">
        <img src={IMG} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0" />
        <h1 className="font-display text-[24px] font-bold tracking-tight text-slate-900 leading-tight">
          {sample.title}
        </h1>
      </div>
      <DetailBody />
    </>
  )
}

const Card = ({ variant }: { variant: CardVariant }) => {
  const meta = (
    <div className="flex items-center text-xs text-slate-500">
      <MapPin className="h-[14px] w-[14px] mr-1" />
      <span className="font-medium text-slate-700">{sample.roaster}</span>
      <span className="mx-1">•</span>
      <span>{sample.neighborhood}</span>
    </div>
  )

  if (variant === 'A') {
    return (
      <article className="bg-white border border-gray-100 shadow-sm rounded-lg overflow-hidden">
        <img src={IMG} alt="" className="w-full h-32 object-cover" />
        <div className="p-5 border-l-2 border-green-500">
          <span className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-green-50 text-green-600 border-green-100 mb-2">
            {sample.tag}
          </span>
          <h3 className="text-xl font-bold mb-2 leading-tight text-gray-900">{sample.title}</h3>
          <p className="text-gray-500 text-sm mb-3 line-clamp-1">{sample.description}</p>
          {meta}
        </div>
      </article>
    )
  }

  if (variant === 'B') {
    return (
      <article className="bg-white border border-gray-100 shadow-sm rounded-lg overflow-hidden flex">
        <img src={IMG} alt="" className="w-28 shrink-0 object-cover" />
        <div className="p-4 flex-1 min-w-0">
          <span className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-green-50 text-green-600 border-green-100 mb-1.5">
            {sample.tag}
          </span>
          <h3 className="text-base font-bold mb-1 leading-tight text-gray-900 line-clamp-2">
            {sample.title}
          </h3>
          {meta}
        </div>
      </article>
    )
  }

  // C — small corner thumbnail
  return (
    <article className="bg-white border border-gray-100 shadow-sm rounded-lg p-5 border-l-2 border-green-500">
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <span className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-green-50 text-green-600 border-green-100 mb-2">
            {sample.tag}
          </span>
          <h3 className="text-lg font-bold mb-2 leading-tight text-gray-900">{sample.title}</h3>
          {meta}
        </div>
        <img src={IMG} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
      </div>
    </article>
  )
}

const Switcher = <T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string; note: string }[]
  value: T
  onChange: (v: T) => void
}) => (
  <div className="space-y-2">
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            value === o.id
              ? 'bg-slate-900 text-white shadow'
              : 'bg-white text-slate-600 border border-stone-200 hover:border-stone-300'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
    <p className="text-xs text-slate-500">{options.find(o => o.id === value)?.note}</p>
  </div>
)

export default function PhotoPreviewPage() {
  const [hero, setHero] = useState<HeroVariant>('A')
  const [card, setCard] = useState<CardVariant>('A')

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Photo layout playground</h1>
        <p className="text-sm text-slate-500 mb-10">
          Click through the variations. Nothing here ships — it just mirrors the real panel styling.
        </p>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Detail hero column */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Detail — hero image
            </h2>
            <Switcher options={heroOptions} value={hero} onChange={setHero} />
            <div className="mt-5 bg-white rounded-2xl shadow-lg overflow-hidden max-w-[430px]">
              <Hero variant={hero} />
              <div className="h-6" />
            </div>
          </section>

          {/* Card column */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              List — card
            </h2>
            <Switcher options={cardOptions} value={card} onChange={setCard} />
            <div className="mt-5 max-w-[430px] space-y-3">
              <Card variant={card} />
              <Card variant={card} />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
