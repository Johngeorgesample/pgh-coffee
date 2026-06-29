import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { User } from 'lucide-react'
import ShopCard from '@/app/components/ShopCard'
import VisitStats from '@/app/account/components/VisitStats'
import { formatDBShopAsFeature } from '@/app/utils/utils'
import { getPublicProfile } from '@/app/utils/profiles'

type Props = {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const profile = await getPublicProfile(username)
  if (!profile) return { title: 'Profile not found' }

  const name = profile.displayName || `@${profile.username}`
  return {
    title: `${name} · pgh.coffee`,
    description: `${name} has visited ${profile.visits.length} Pittsburgh coffee shops.`,
  }
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params
  const profile = await getPublicProfile(username)

  if (!profile) notFound()

  const name = profile.displayName || `@${profile.username}`

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
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
              <p className="text-sm text-gray-500">@{profile.username}</p>
            </div>
          </div>
        </div>

        <VisitStats visits={profile.visits} />

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Passport</h2>
          {profile.visits.length > 0 ? (
            <ul>
              {profile.visits.map((visit) => (
                <ShopCard key={visit.id} shop={formatDBShopAsFeature(visit.shop)} />
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No visits yet.</p>
          )}
        </section>

        {profile.lists.map((list) => (
          <section key={list.id} className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{list.name}</h2>
              {list.description && <p className="text-gray-500">{list.description}</p>}
            </div>
            {list.shops.length > 0 ? (
              <ul>
                {list.shops.map((shop) => (
                  <ShopCard key={shop.uuid} shop={formatDBShopAsFeature(shop)} />
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No shops in this list yet.</p>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
