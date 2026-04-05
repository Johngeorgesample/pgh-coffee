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
  const imageFile = formData.get('image')

  if (!imageFile) {
    return NextResponse.json({ error: 'No image provided', keys, contentType: request.headers.get('content-type') }, { status: 400 })
  }

  const debugInfo = {
    keys,
    imageType: typeof imageFile,
    isFile: imageFile instanceof File,
    fileType: imageFile instanceof File ? imageFile.type : null,
    fileSize: imageFile instanceof File ? imageFile.size : (typeof imageFile === 'string' ? (imageFile as string).length : null),
    constructorName: Object.getPrototypeOf(imageFile)?.constructor?.name ?? 'unknown',
  }
  console.error('CAPTURE DEBUG:', JSON.stringify(debugInfo))
  return NextResponse.json({ debug: true, ...debugInfo })
}
