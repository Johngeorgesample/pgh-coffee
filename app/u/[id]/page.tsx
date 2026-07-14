import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { User } from 'lucide-react'
import VisitStats from '@/app/account/components/VisitStats'
import { getPublicProfile } from '@/app/utils/profiles'
import Passport from './Passport'
import ProfileViewTracker from './ProfileViewTracker'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const profile = await getPublicProfile(id)
  if (!profile) return { title: 'Profile not found' }

  const name = profile.displayName || 'Coffee lover'
  const shopCount = profile.visits.length
  const neighborhoodCount = new Set(profile.visits.map((v) => v.shop?.neighborhood).filter(Boolean)).size
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
      <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              {profile.avatarUrl ? (
                <img className="w-full h-full object-cover" src={profile.avatarUrl} alt={name} />
              ) : (
                <User className="w-8 h-8 text-yellow-600" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
            </div>
          </div>
        </div>

        <VisitStats visits={profile.visits} />

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Passport</h2>
          <Passport visits={profile.visits} />
        </section>
      </div>
    </div>
  )
}
