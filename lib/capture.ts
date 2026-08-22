import { createClient } from '@supabase/supabase-js'

export interface Shop {
  uuid: string
  name: string
  neighborhood: string
  address: string
  instagram_handle: string | null
}

export interface Roaster {
  uuid: string
  name: string
  instagram: string | null
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

/**
 * The Instagram permalink is never visible in a screenshot of the post, so the
 * iOS Shortcut passes it as `?url=`. Query string rather than a form field so it
 * works for both request shapes getImageData accepts.
 */
export function getSourceUrl(request: Request): string | null {
  const url = new URL(request.url).searchParams.get('url')
  return url?.startsWith('https://') ? url : null
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

export async function getAllShops(): Promise<Shop[]> {
  const { data } = await supabase
    .from('shops')
    .select('uuid, name, neighborhood, address, company:company_id(instagram_handle)')
    .order('name')

  return (data ?? []).map(({ company, ...shop }) => ({
    ...shop,
    instagram_handle: (company as unknown as { instagram_handle: string } | null)?.instagram_handle ?? null,
  })) as Shop[]
}

/** Local roasters only: a national brand is far likelier to be mentioned in passing than to host. */
export async function getAllRoasters(): Promise<Roaster[]> {
  const { data } = await supabase.from('roaster').select('uuid:id, name, instagram').eq('is_local', true).order('name')
  return (data ?? []) as unknown as Roaster[]
}

const shopLine = (s: Shop) =>
  `- "${s.name}" — ${s.neighborhood}, ${s.address}${s.instagram_handle ? ` — @${s.instagram_handle}` : ''} — uuid: ${s.uuid}`

const roasterLine = (r: Roaster) =>
  `- "${r.name}"${r.instagram ? ` — @${r.instagram}` : ''} — uuid: ${r.uuid}`

/**
 * Every shop and roaster goes in the prompt rather than a pre-filtered shortlist:
 * name matching in SQL missed rows over an ampersand ("De Fer Coffee & Tea" vs
 * "De Fer Coffee and Tea"), and a shortlist of same-named branches gave the model
 * no way to tell them apart. Handles are listed because the @name at the top of
 * the screenshot identifies the brand exactly; the address disambiguates branches.
 */
export function buildEntityContext(shops: Shop[], roasters: Roaster[]): string {
  return `

SHOPS — the @handle at the top of the screenshot usually matches one of these:
${shops.map(shopLine).join('\n')}

ROASTERS:
${roasters.map(roasterLine).join('\n')}`
}

export function validateUUID<T extends { uuid: string }>(candidates: T[], uuid: string | null): T | null {
  if (!uuid) return null
  return candidates.find(c => c.uuid === uuid) ?? null
}

/** The shop's own in-house roaster, used when the post names no roaster of its own. */
export async function getRoasterID(shopUuid: string): Promise<string | null> {
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
