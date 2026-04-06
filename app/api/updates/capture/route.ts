import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'
import { getImageData, getShopCandidates, buildShopContext, validateShopUuid, type Shop } from '@/lib/capture'

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
)

interface ExtractedUpdate {
  shop_name: string
  shop_uuid: string | null
  title: string
  description: string
  external_url: string | null
  type: string
  tags: string[]
}

async function extractUpdateFromImage(base64Image: string, mediaType: string, shopCandidates: Shop[]): Promise<ExtractedUpdate> {
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
            text: `This is an Instagram post from a Pittsburgh coffee shop sharing a general update (new menu, hours change, opening, closure, new offering, etc.). Extract details and respond ONLY with valid JSON, no other text:
{
  "shop_name": "coffee shop name shown or implied in the post",
  "shop_uuid": "uuid of the best matching shop from the list below, or null if no match",
  "title": "concise update title (e.g. Summer Menu Launch, New Hours, Temporary Closure)",
  "description": "post body text, cleaned up and readable",
  "external_url": "any relevant link visible in the post such as a menu or ordering link, otherwise null",
  "type": "pick the single most relevant from: opening, closure, temporary closure, coming soon, seasonal, menu, offering",
  "tags": ["pick all relevant from: opening, closure, temporary closure, coming soon, seasonal, menu, offering"]
}${buildShopContext(shopCandidates)}`,
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
  return JSON.parse(text) as ExtractedUpdate
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

  const shopCandidates = await getShopCandidates(imageData.base64Image, imageData.mediaType)

  let extracted: ExtractedUpdate
  try {
    extracted = await extractUpdateFromImage(imageData.base64Image, imageData.mediaType, shopCandidates)
  } catch (error) {
    logger.error('Failed to extract update from image', { error: String(error) })
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 })
  }

  const shop = validateShopUuid(shopCandidates, extracted.shop_uuid)

  const { error: insertError } = await supabase
    .from('updates')
    .insert([{
      title: extracted.title,
      description: extracted.description,
      url: extracted.external_url,
      type: extracted.type,
      tags: extracted.tags,
      post_date: new Date().toISOString().split('T')[0],
      shop_id: shop?.uuid ?? null,
    }])

  if (insertError) {
    logger.error('Failed to insert update', { error: insertError.message })
    return NextResponse.json({ error: 'Failed to save update' }, { status: 500 })
  }

  return NextResponse.json({
    extracted,
    shop_matched: shop ? { name: shop.name, neighborhood: shop.neighborhood } : null,
    message: 'Inserted into updates and live immediately.',
  }, { status: 201 })
}
