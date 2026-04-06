import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { getImageData, getShopCandidates, buildShopContext, validateShopUuid, callAnthropicVision, getRoasterId, supabase } from '@/lib/capture'

interface ExtractedUpdate {
  shop_name: string
  shop_uuid: string | null
  title: string
  description: string
  external_url: string | null
  type: string
  tags: string[]
}

function buildPrompt(shopContext: string): string {
  return `This is an Instagram post from a Pittsburgh coffee shop sharing a general update (new menu, hours change, opening, closure, new offering, etc.). Extract details and respond ONLY with valid JSON, no other text:
{
  "shop_name": "coffee shop name shown or implied in the post",
  "shop_uuid": "uuid of the best matching shop from the list below, or null if no match",
  "title": "concise update title (e.g. Summer Menu Launch, New Hours, Temporary Closure)",
  "description": "post body text, cleaned up and readable",
  "external_url": "any relevant link visible in the post such as a menu or ordering link, otherwise null",
  "type": "pick the single most relevant from: opening, closure, temporary closure, coming soon, seasonal, menu, offering",
  "tags": ["pick all relevant from: opening, closure, temporary closure, coming soon, seasonal, menu, offering"]
}${shopContext}`
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
    extracted = await callAnthropicVision<ExtractedUpdate>(
      buildPrompt(buildShopContext(shopCandidates)),
      imageData.base64Image,
      imageData.mediaType,
    )
  } catch (error) {
    logger.error('Failed to extract update from image', { error: String(error) })
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 })
  }

  const shop = validateShopUuid(shopCandidates, extracted.shop_uuid)
  const roasterId = shop ? await getRoasterId(shop.uuid) : null

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
      roaster_id: roasterId,
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
