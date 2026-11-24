import { notFound } from 'next/navigation'
import { Footer } from '@/app/components/about'
import Reveal from '@/app/components/advent/Reveal'
import Reading from '@/app/components/advent/day/Reading'
import Sheet from '@/app/components/advent/day/Sheet'
import { findAdventDay } from '@/data/advent'
import { findOrder, jarHref, jarOgHref, stepOf } from '@/data/advent-orders'
import { parseDayParam } from '@/app/utils/advent'
import { getRoasterBySlug } from '@/app/utils/roasters'
import { OG_IMAGE_SIZE } from '@/app/utils/ogTheme'

type Props = { params: Promise<{ day: string }>; searchParams: Promise<{ order?: string }> }

const resolveDay = async (params: Props['params']) => {
  const day = parseDayParam((await params).day)
  const entry = day ? findAdventDay(day) : undefined
  if (!entry) notFound()
  return entry
}

const resolveOrder = async (searchParams: Props['searchParams']) => findOrder((await searchParams).order)

export async function generateMetadata({ params, searchParams }: Props) {
  const entry = await resolveDay(params)
  const order = await resolveOrder(searchParams)
  const step = stepOf(order, entry.day)
  const title = `Day ${step} | Pittsburgh coffee advent calendar`
  const description = `Day ${step} of the Pittsburgh coffee advent calendar: one jar from a Pittsburgh roaster. Open it to see what's inside.`
  return {
    title: `${title} | pgh.coffee`,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: jarHref(order, entry.day),
      images: [{ url: jarOgHref(order, entry.day), ...OG_IMAGE_SIZE, alt: `Day ${step} of the Pittsburgh coffee advent calendar` }],
    },
    robots: { index: false },
  }
}

export default async function AdventDayPage({ params, searchParams }: Props) {
  const entry = await resolveDay(params)
  const order = await resolveOrder(searchParams)
  const step = stepOf(order, entry.day)
  const roaster = entry.roasterSlug ? await getRoasterBySlug(entry.roasterSlug) : null

  return (
    <div className="bg-stone-50">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-12 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-20">
        <Sheet entry={entry} order={order} step={step} />
        <Reading entry={entry} order={order} step={step} roaster={roaster} />
      </div>
      <Footer />
      <Reveal />
    </div>
  )
}
