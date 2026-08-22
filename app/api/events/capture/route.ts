import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { getImageData, getSourceUrl, getAllShops, getAllRoasters, buildEntityContext, validateUUID, callAnthropicVision, getRoasterID, supabase } from '@/lib/capture'

interface ExtractedEvent {
  shop_name: string
  shop_uuid: string | null
  roaster_uuid: string | null
  title: string
  description: string
  event_date: string | null
  external_url: string | null
  type: string
}

function buildPrompt(entityContext: string): string {
  const year = new Date().getFullYear()
  return `This is an Instagram post from a Pittsburgh coffee shop or roaster announcing a specific event (class, tasting, pop-up, live music, etc.). Extract details and respond ONLY with valid JSON, no other text:
{
  "shop_name": "coffee shop name shown or implied in the post",
  "shop_uuid": "uuid from the SHOPS list of the shop where the event physically takes place. This is the venue, which is not always the account that posted — a throwdown posted by one shop is often held at another. If a brand has several locations and the post does not say which one, return null rather than guessing a branch.",
  "roaster_uuid": "uuid from the ROASTERS list of the roaster hosting or presenting the event. Null if a roaster is only mentioned in passing, such as whose coffee will be served.",
  "title": "concise event title (e.g. Latte Art Class, Decaf Tasting, Holiday Pop-Up)",
  "description": "post body text, cleaned up and readable. Replace any first-person language (we, I, our, my) with the shop's name",
  "event_date": "YYYY-MM-DD if a date is mentioned. If no year is shown, assume ${year}. Null if no date is mentioned.",
  "external_url": "any ticket or registration link visible in the post, otherwise null",
  "type": "pick the single most relevant from: class, community event, event, market, pop-up, special event, talk / lecture, tasting, throwdown, workshop"
}${entityContext}`
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

  const [shops, roasters] = await Promise.all([getAllShops(), getAllRoasters()])

  let extracted: ExtractedEvent
  try {
    extracted = await callAnthropicVision<ExtractedEvent>(
      buildPrompt(buildEntityContext(shops, roasters)),
      imageData.base64Image,
      imageData.mediaType,
    )
  } catch (error) {
    logger.error('Failed to extract event from image', { error: String(error) })
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 })
  }

  const shop = validateUUID(shops, extracted.shop_uuid)
  const roaster = validateUUID(roasters, extracted.roaster_uuid)
  const roasterId = roaster?.uuid ?? (shop ? await getRoasterID(shop.uuid) : null)

  const { error: insertError } = await supabase
    .from('events')
    .insert([{
      title: extracted.title,
      description: extracted.description,
      // A ticket or registration link beats the Instagram permalink the Shortcut sends.
      url: extracted.external_url ?? getSourceUrl(request),
      type: extracted.type,
      post_date: new Date().toISOString().split('T')[0],
      event_date: extracted.event_date,
      shop_id: shop?.uuid ?? null,
      roaster_id: roasterId,
    }])

  if (insertError) {
    logger.error('Failed to insert event', { error: insertError.message })
    return NextResponse.json({ error: 'Failed to stage event' }, { status: 500 })
  }

  return NextResponse.json({
    extracted,
    shop_matched: shop ? { name: shop.name, neighborhood: shop.neighborhood } : null,
    roaster_matched: roaster?.name ?? null,
    message: 'Inserted into events.',
  }, { status: 201 })
}
