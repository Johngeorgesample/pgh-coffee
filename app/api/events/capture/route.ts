import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
)

interface ExtractedEvent {
  shop_name: string
  neighborhood: string | null
  title: string
  description: string
  event_date: string | null
  external_url: string | null
  type: string
}

async function extractEventFromImage(base64Image: string, mediaType: string): Promise<ExtractedEvent> {
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
            text: `This is an Instagram post from a Pittsburgh coffee shop announcing a specific event (class, tasting, pop-up, live music, etc.). Extract details and respond ONLY with valid JSON, no other text:
{
  "shop_name": "coffee shop name shown or implied in the post",
  "neighborhood": "Pittsburgh neighborhood where the shop is located if mentioned or visible (e.g. South Side, Lawrenceville, Downtown), otherwise null",
  "title": "concise event title (e.g. Latte Art Class, Decaf Tasting, Holiday Pop-Up)",
  "description": "post body text, cleaned up and readable",
  "event_date": "YYYY-MM-DD if a specific date is mentioned, otherwise null",
  "external_url": "any ticket or registration link visible in the post, otherwise null",
  "type": "pick the single most relevant from: event, seasonal, coming soon"
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
  return JSON.parse(text) as ExtractedEvent
}

async function getImageData(request: Request): Promise<{ base64Image: string; mediaType: string } | null> {
  const contentType = request.headers.get('content-type') ?? ''

  if (contentType.startsWith('multipart/form-data')) {
    const formData = await request.formData()
    const imageFile = formData.get('image')
    if (!imageFile || !(imageFile instanceof File)) return null
    return {
      mediaType: imageFile.type || 'image/jpeg',
      base64Image: Buffer.from(await imageFile.arrayBuffer()).toString('base64'),
    }
  }

  const buffer = await request.arrayBuffer()
  if (!buffer.byteLength) return null
  return {
    mediaType: contentType || 'image/jpeg',
    base64Image: Buffer.from(buffer).toString('base64'),
  }
}

export async function POST(request: Request) {
  const secret = request.headers.get('x-capture-secret')
  if (secret !== process.env.CAPTURE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
  }

  const imageData = await getImageData(request)
  if (!imageData) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 })
  }

  let extracted: ExtractedEvent
  try {
    extracted = await extractEventFromImage(imageData.base64Image, imageData.mediaType)
  } catch (error) {
    logger.error('Failed to extract event from image', { error: String(error) })
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 })
  }

  const { data: shops } = await supabase
    .from('shops')
    .select('uuid, name, neighborhood')
    .ilike('name', `%${extracted.shop_name}%`)
    .limit(10)

  const shop = (() => {
    if (!shops?.length) return null
    if (shops.length === 1 || !extracted.neighborhood) return shops[0]
    const hint = extracted.neighborhood.toLowerCase()
    return shops.find(s => s.neighborhood?.toLowerCase().includes(hint)) ?? shops[0]
  })()

  const { error: insertError } = await supabase
    .from('events')
    .insert([{
      title: extracted.title,
      description: extracted.description,
      url: extracted.external_url,
      type: extracted.type,
      post_date: new Date().toISOString().split('T')[0],
      event_date: extracted.event_date,
      shop_id: shop?.uuid ?? null,
      is_hidden: true,
    }])

  if (insertError) {
    logger.error('Failed to insert event', { error: insertError.message })
    return NextResponse.json({ error: 'Failed to stage event' }, { status: 500 })
  }

  return NextResponse.json({
    extracted,
    shop_matched: shop ? { name: shop.name, neighborhood: shop.neighborhood } : null,
    message: 'Staged in events with is_hidden=true. Set to false in Supabase Studio to publish.',
  }, { status: 201 })
}
