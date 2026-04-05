import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
)

interface ExtractedEvent {
  shop_name: string
  title: string
  description: string
  event_date: string | null
  external_url: string | null
  tags: string[]
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
            text: `This is an Instagram post from a Pittsburgh coffee shop. Extract event or update details and respond ONLY with valid JSON, no other text:
{
  "shop_name": "coffee shop name shown or implied in the post",
  "title": "concise title for this event or update (e.g. Summer Menu Launch, Latte Art Class, New Hours)",
  "description": "post body text, cleaned up and readable",
  "event_date": "YYYY-MM-DD if a specific event date is mentioned, otherwise null",
  "external_url": "any external link visible in the post such as a ticket or menu link, otherwise null",
  "tags": ["pick the most relevant from: event, opening, closure, temporary closure, coming soon, seasonal, menu, offering"]
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

export async function POST(request: Request) {
  const secret = request.headers.get('x-capture-secret')
  if (secret !== process.env.CAPTURE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
  }

  const formData = await request.formData()
  const imageFile = formData.get('image') as File | null

  if (!imageFile) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 })
  }

  const mediaType = imageFile.type || 'image/jpeg'
  const base64Image = Buffer.from(await imageFile.arrayBuffer()).toString('base64')

  let extracted: ExtractedEvent
  try {
    extracted = await extractEventFromImage(base64Image, mediaType)
  } catch (error) {
    logger.error('Failed to extract event from image', { error: String(error) })
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 })
  }

  const { data: shops } = await supabase
    .from('shops')
    .select('uuid, name, neighborhood')
    .ilike('name', `%${extracted.shop_name}%`)
    .limit(5)

  const shop = shops?.[0] ?? null

  const { data: event, error: insertError } = await supabase
    .from('events')
    .insert([{
      title: extracted.title,
      description: extracted.description,
      url: extracted.external_url,
      tags: extracted.tags,
      post_date: new Date().toISOString().split('T')[0],
      event_date: extracted.event_date,
      shop_id: shop?.uuid ?? null,
      is_hidden: true,
    }])
    .select()
    .single()

  if (insertError) {
    logger.error('Failed to insert event', { error: insertError.message })
    return NextResponse.json({ error: 'Failed to stage event' }, { status: 500 })
  }

  return NextResponse.json({
    event,
    extracted,
    shop_matched: shop ? { name: shop.name, neighborhood: shop.neighborhood } : null,
    message: 'Staged with is_hidden=true. Set to false in Supabase Studio to publish.',
  }, { status: 201 })
}
