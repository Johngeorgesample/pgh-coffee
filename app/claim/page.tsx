import Link from 'next/link'
import type { Metadata } from 'next'
import { Footer } from '@/app/components/about'
import { resolveClaimTarget } from '@/app/utils/claims'
import type { ClaimType } from '@/types/claim-types'
import ClaimPreview from './ClaimPreview'
import ClaimForm from './ClaimForm'

interface TProps {
  searchParams: Promise<{ shop?: string | string[]; company?: string | string[]; roaster?: string | string[] }>
}

const HEADINGS: Record<ClaimType, string> = {
  shop: "Your shop's on the map. Make it yours.",
  company: "Your brand's on the map. Make it yours.",
  roaster: "Your roastery's on the map. Make it yours.",
}

// A search param can repeat (?shop=a&shop=b arrives as an array); take the first.
const first = (value?: string | string[]) => {
  return Array.isArray(value) ? value[0] : value
}

const entryFrom = (params: Awaited<TProps['searchParams']>) => ({
  shop: first(params.shop),
  company: first(params.company),
  roaster: first(params.roaster),
})

export async function generateMetadata({ searchParams }: TProps): Promise<Metadata> {
  const entry = entryFrom(await searchParams)
  const target = entry.shop || entry.company || entry.roaster ? await resolveClaimTarget(entry) : null
  if (!target) return {}

  const title = `Claim ${target.name} · pgh.coffee`
  const description = 'Verify your listing to get a verified badge and a head start managing it when self-serve editing launches.'
  // Fall back to the site-default OG image: this openGraph object replaces the
  // layout's wholesale, so without an explicit image a photo-less target
  // (e.g. a roaster with no logo) would emit no og:image at all.
  const images = target.photo ? [target.photo] : ['/opengraph-image']
  return {
    title,
    description,
    openGraph: { siteName: 'pgh.coffee', title, description, images },
  }
}

export default async function ClaimAListing({ searchParams }: TProps) {
  const entry = entryFrom(await searchParams)
  const hasEntry = Boolean(entry.shop || entry.company || entry.roaster)
  const target = hasEntry ? await resolveClaimTarget(entry) : null

  return (
    <div>
      <header className="max-w-7xl mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
            {target ? HEADINGS[target.type] : "You're on the map. Make it yours."}
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 font-light leading-relaxed">
            Claim your listing to get a verified badge and a head start managing it when self-serve editing launches.
          </p>
        </div>
      </header>

      {/* @TODO should never be null */}
      {target ? (
        <>
          <ClaimPreview name={target.name} subtitle={target.subtitle} photo={target.photo} />
          <ClaimForm target={target} />
        </>
      ) : (
        <section className="max-w-2xl mx-auto px-6 pb-20 text-center">
          <p className="text-lg text-slate-600">
            Find your shop on the{' '}
            <Link href="/" className="font-semibold text-yellow-600 underline">
              map
            </Link>{' '}
            and use the <span className="font-semibold">Claim this shop</span> button to get started.
          </p>
        </section>
      )}

      <Footer />
    </div>
  )
}
