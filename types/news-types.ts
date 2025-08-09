export interface NewsEntry {
  postDate: string
  type: 'shop' | 'menu' | 'site' | 'event' | 'other'
  tags?: string[]
  title: string
  description?: string
  shopId?: string
  url?: string
  eventDate?: string
}
