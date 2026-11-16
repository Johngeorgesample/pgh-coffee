import { NextRequest, NextResponse } from 'next/server'
import { extractUuidPrefix } from '@/app/utils/slug'
import { getUpdateByIdPrefix } from '@/app/utils/updates'
import { withMetrics } from '@/lib/withMetrics'

async function handleGET(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params

  const prefix = extractUuidPrefix(slug)
  let update
  try {
    update = prefix ? await getUpdateByIdPrefix(prefix) : null
  } catch {
    return NextResponse.json({ error: 'Error fetching update' }, { status: 500 })
  }

  if (!update) {
    return NextResponse.json({ error: 'Update not found' }, { status: 404 })
  }

  return NextResponse.json(update)
}

export const GET = withMetrics('updates/by-slug/[slug]', handleGET)
