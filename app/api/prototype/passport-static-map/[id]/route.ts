// PROTOTYPE: throwaway proxy for the passport minimap variant B. Not for main.
import { NextResponse } from 'next/server'
import { getPublicProfile } from '@/app/utils/profiles'
import { openVisits } from '@/app/utils/visitStats'

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const profile = await getPublicProfile(id)
  if (!profile) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const pins = openVisits(profile.visits)
    .filter((v) => v.shop?.longitude && v.shop?.latitude)
    .map((v) => `pin-s+FDE047(${v.shop.longitude!.toFixed(4)},${v.shop.latitude!.toFixed(4)})`)
    .join(',')
  const overlay = pins ? `${pins}/auto` : '-79.99585,40.440742,11'
  const url = `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/${overlay}/720x320@2x?padding=40&access_token=${process.env.MAPBOX_ACCESS_TOKEN}`

  const upstream = await fetch(url)
  if (!upstream.ok) return NextResponse.json({ error: await upstream.text() }, { status: 502 })
  return new NextResponse(await upstream.arrayBuffer(), {
    headers: { 'Content-Type': upstream.headers.get('content-type') ?? 'image/png' },
  })
}
