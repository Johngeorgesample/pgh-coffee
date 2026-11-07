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

  return NextResponse.json(profile, {
    headers: { 'Cache-Control': 'private, no-store' },
  })
}
