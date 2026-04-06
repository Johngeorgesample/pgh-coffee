import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { getImageData, getShopCandidates, buildShopContext, validateShopUUID, callAnthropicVision, getRoasterID, supabase } from '@/lib/capture'

interface ExtractedEvent {
  shop_name: string
  shop_uuid: string | null
  title: string
  description: string
  event_date: string | null
  external_url: string | null
  type: string
}

function buildPrompt(shopContext: string): string {
  return `This is an Instagram post from a Pittsburgh coffee shop announcing a specific event (class, tasting, pop-up, live music, etc.). Extract details and respond ONLY with valid JSON, no other text:
{
  "shop_name": "coffee shop name shown or implied in the post",
  "shop_uuid": "uuid of the best matching shop from the list below, or null if no match",
  "title": "concise event title (e.g. Latte Art Class, Decaf Tasting, Holiday Pop-Up)",
  "description": "post body text, cleaned up and readable",
  "event_date": "YYYY-MM-DD if a specific date is mentioned, otherwise null",
  "external_url": "any ticket or registration link visible in the post, otherwise null",
  "type": "pick the single most relevant from: FIX THESE, event, seasonal, coming soon"
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

  let extracted: ExtractedEvent
  try {
    extracted = await callAnthropicVision<ExtractedEvent>(
      buildPrompt(buildShopContext(shopCandidates)),
      imageData.base64Image,
      imageData.mediaType,
    )
  } catch (error) {
    logger.error('Failed to extract event from image', { error: String(error) })
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 })
  }

  const shop = validateShopUUID(shopCandidates, extracted.shop_uuid)
  const roasterId = shop ? await getRoasterID(shop.uuid) : null

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
      roaster_id: roasterId,
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
