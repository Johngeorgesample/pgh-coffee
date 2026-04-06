import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
)

interface Shop {
  uuid: string
  name: string
  neighborhood: string
}

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
  const shopContext = shopCandidates.length > 0
    ? `\nThe following shops are in our database — pick the best match and return its uuid, or null if none fit:\n${shopCandidates.map(s => `- "${s.name}" (${s.neighborhood}) — uuid: ${s.uuid}`).join('\n')}`
    : ''

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
}${shopContext}`,
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

async function getShopCandidates(shopName: string): Promise<Shop[]> {
  const { data } = await supabase
    .from('shops')
    .select('uuid, name, neighborhood')
    .ilike('name', `%${shopName}%`)
    .limit(10)
  return data ?? []
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

  // First pass: extract just the shop name to look up candidates
  const firstPass = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY as string,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 64,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: imageData.mediaType, data: imageData.base64Image } },
          { type: 'text', text: 'What is the name of the coffee shop in this Instagram post? Reply with only the shop name, nothing else.' },
        ],
      }],
    }),
  })

  let shopCandidates: Shop[] = []
  if (firstPass.ok) {
    const firstPassResult = await firstPass.json()
    const shopName = firstPassResult.content[0].text.trim()
    shopCandidates = await getShopCandidates(shopName)
  }

  let extracted: ExtractedUpdate
  try {
    extracted = await extractUpdateFromImage(imageData.base64Image, imageData.mediaType, shopCandidates)
  } catch (error) {
    logger.error('Failed to extract update from image', { error: String(error) })
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 })
  }

  // Validate the returned uuid is actually one of the candidates
  const shop = shopCandidates.find(s => s.uuid === extracted.shop_uuid) ?? null

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
