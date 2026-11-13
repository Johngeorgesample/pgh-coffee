import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPublicProfile } from '@/app/utils/profiles'
import { openVisits } from '@/app/utils/visitStats'
import Passport from './Passport'
import PassportCover from './PassportCover'
import ProfileViewTracker from './ProfileViewTracker'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const profile = await getPublicProfile(id)
  if (!profile) return { title: 'Profile not found' }

  const name = profile.displayName || 'Coffee lover'
  const counted = openVisits(profile.visits)
  const shopCount = counted.length
  const neighborhoodCount = new Set(counted.map((v) => v.shop?.neighborhood).filter(Boolean)).size
  const title = `${name} · pgh.coffee`
  const description =
    `${name} has visited ${shopCount} independent Pittsburgh coffee ${shopCount === 1 ? 'shop' : 'shops'}` +
    ` across ${neighborhoodCount} ${neighborhoodCount === 1 ? 'neighborhood' : 'neighborhoods'}.` +
    ' Track your own coffee passport on pgh.coffee.'

  // No twitter object: the layout's { card: 'summary_large_image' } is inherited
  // and X falls back to og:* tags plus this route's opengraph-image.tsx.
  return {
    title,
    description,
    openGraph: { siteName: 'pgh.coffee', title, description },
  }
}

export default async function PublicProfilePage({ params }: Props) {
  const { id } = await params
  const profile = await getPublicProfile(id)

  if (!profile) notFound()

  const name = profile.displayName || 'Coffee lover'

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <ProfileViewTracker profileId={id} />
      <PassportCover name={name} avatarUrl={profile.avatarUrl} visits={profile.visits} />
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        <Passport visits={profile.visits} />
      </div>
    </div>
  )
}
