import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
)

interface ExtractedPost {
  shop_name: string
  table: 'events' | 'updates'
  title: string
  description: string
  event_date: string | null
  external_url: string | null
  type: string
  tags: string[]
}

async function extractPostFromImage(base64Image: string, mediaType: string): Promise<ExtractedPost> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY as string,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: base64Image },
          },
          {
            type: 'text',
            text: `This is an Instagram post from a Pittsburgh coffee shop. Extract details and respond ONLY with valid JSON, no other text:
{
  "shop_name": "coffee shop name shown or implied in the post",
  "table": "events if this is a specific happening with a date (class, pop-up, tasting, etc.), otherwise updates",
  "title": "concise title (e.g. Summer Menu Launch, Latte Art Class, New Hours)",
  "description": "post body text, cleaned up and readable",
  "event_date": "YYYY-MM-DD if a specific date is mentioned, otherwise null",
  "external_url": "any external link visible in the post such as a ticket or menu link, otherwise null",
  "type": "pick the single most relevant from: event, opening, closure, temporary closure, coming soon, seasonal, menu, offering",
  "tags": ["pick all relevant from: event, opening, closure, temporary closure, coming soon, seasonal, menu, offering"]
}`,
          },
        ],
      }],
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Anthropic API error ${response.status}: ${body}`)
  }

  const result = await response.json()
  const text = result.content[0].text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()
  return JSON.parse(text) as ExtractedPost
}

export async function POST(request: Request) {
  const secret = request.headers.get('x-capture-secret')
  if (secret !== process.env.CAPTURE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
  }

  const formData = await request.formData()
  const keys = Array.from(formData.keys())
  const imageFile = formData.get('image') as File | string | null

  if (!imageFile) {
    return NextResponse.json({ error: 'No image provided', keys, contentType: request.headers.get('content-type') }, { status: 400 })
  }

  // Temp debug: return info about what was received
  return NextResponse.json({
    debug: true,
    keys,
    imageType: typeof imageFile,
    isFile: imageFile instanceof File,
    fileType: imageFile instanceof File ? imageFile.type : null,
    fileSize: imageFile instanceof File ? imageFile.size : (typeof imageFile === 'string' ? imageFile.length : null),
  })

  let base64Image: string
  let mediaType: string

  if (typeof imageFile === 'string') {
    base64Image = imageFile.replace(/^data:image\/\w+;base64,/, '')
    mediaType = 'image/jpeg'
  } else {
    mediaType = imageFile.type || 'image/jpeg'
    base64Image = Buffer.from(await imageFile.arrayBuffer()).toString('base64')
  }

  let extracted: ExtractedPost
  try {
    extracted = await extractPostFromImage(base64Image, mediaType)
  } catch (error) {
    logger.error('Failed to extract post from image', { error: String(error) })
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 })
  }

  const { data: shops } = await supabase
    .from('shops')
    .select('uuid, name, neighborhood')
    .ilike('name', `%${extracted.shop_name}%`)
    .limit(5)

  const shop = shops?.[0] ?? null
  const postDate = new Date().toISOString().split('T')[0]
  const shopId = shop?.uuid ?? null

  let record: Record<string, unknown>
  let insertError

  if (extracted.table === 'events') {
    const { error } = await supabase
      .from('events')
      .insert([{
        title: extracted.title,
        description: extracted.description,
        url: extracted.external_url,
        type: extracted.type,
        post_date: postDate,
        event_date: extracted.event_date,
        shop_id: shopId,
        is_hidden: true,
      }])
      .select()
      .single()
    record = {}
    insertError = error
  } else {
    const { error } = await supabase
      .from('updates')
      .insert([{
        title: extracted.title,
        description: extracted.description,
        url: extracted.external_url,
        type: extracted.type,
        tags: extracted.tags,
        post_date: postDate,
        event_date: extracted.event_date,
        shop_id: shopId,
      }])
      .select()
      .single()
    record = {}
    insertError = error
  }

  if (insertError) {
    logger.error('Failed to insert post', { error: insertError.message })
    return NextResponse.json({ error: 'Failed to stage post' }, { status: 500 })
  }

  const message = extracted.table === 'events'
    ? 'Staged in events with is_hidden=true. Set to false in Supabase Studio to publish.'
    : 'Inserted into updates and live immediately.'

  return NextResponse.json({
    record,
    extracted,
    shop_matched: shop ? { name: shop.name, neighborhood: shop.neighborhood } : null,
    message,
  }, { status: 201 })
}
