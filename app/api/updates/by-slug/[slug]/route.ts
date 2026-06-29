import { NextRequest, NextResponse } from 'next/server'
import { extractUuidPrefix } from '@/app/utils/slug'
import { getUpdateByIdPrefix } from '@/app/utils/updates'

export async function GET(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params

  const prefix = extractUuidPrefix(slug)
  const update = prefix ? await getUpdateByIdPrefix(prefix) : null

  if (!update) {
    return NextResponse.json({ error: 'Update not found' }, { status: 404 })
  }

  return NextResponse.json(update)
}
