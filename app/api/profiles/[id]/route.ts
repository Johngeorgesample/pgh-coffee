import { NextResponse } from 'next/server'
import { getPublicProfile } from '@/app/utils/profiles'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const profile = await getPublicProfile(id)

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  // Not CDN-cached: a user toggling their profile private must take effect
  // immediately, so this endpoint must never serve stale public data.
  return NextResponse.json(profile, {
    headers: { 'Cache-Control': 'private, no-store' },
  })
}
