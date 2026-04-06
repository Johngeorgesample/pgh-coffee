import { createClient } from '@supabase/supabase-js'

export interface Shop {
  uuid: string
  name: string
  neighborhood: string
}

export const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
)

export async function getImageData(request: Request): Promise<{ base64Image: string; mediaType: string } | null> {
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

export async function callAnthropicVision<T>(prompt: string, base64Image: string, mediaType: string, maxTokens = 1024): Promise<T> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY as string,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Image } },
          { type: 'text', text: prompt },
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
  return JSON.parse(text) as T
}

export async function getShopCandidates(base64Image: string, mediaType: string): Promise<Shop[]> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
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
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Image } },
          { type: 'text', text: 'What is the name of the coffee shop in this Instagram post? Reply with only the shop name, nothing else.' },
        ],
      }],
    }),
  })

  if (!response.ok) return []

  const result = await response.json()
  const shopName = result.content[0].text.trim()

  const { data } = await supabase
    .from('shops')
    .select('uuid, name, neighborhood')
    .ilike('name', `%${shopName}%`)
    .limit(10)

  return data ?? []
}

export function buildShopContext(candidates: Shop[]): string {
  if (!candidates.length) return ''
  return `\nThe following shops are in our database — pick the best match and return its uuid, or null if none fit:\n${candidates.map(s => `- "${s.name}" (${s.neighborhood}) — uuid: ${s.uuid}`).join('\n')}`
}

export function validateShopUuid(candidates: Shop[], uuid: string | null): Shop | null {
  if (!uuid) return null
  return candidates.find(s => s.uuid === uuid) ?? null
}

export async function getRoasterId(shopUuid: string): Promise<string | null> {
  const { data: shop } = await supabase
    .from('shops')
    .select('company_id')
    .eq('uuid', shopUuid)
    .single()

  if (!shop?.company_id) return null

  const { data: roaster } = await supabase
    .from('roaster')
    .select('id')
    .eq('company_id', shop.company_id)
    .single()

  return roaster?.id ?? null
}
