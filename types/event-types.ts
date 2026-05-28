import { RoasterRef } from '@/types/shop-types'

export type EventCardData = {
  id: string
  title: string
  description?: string | null
  url?: string | null
  tags?: string[] | null
  post_date?: string
  postDate?: string
  event_date?: string | null
  shop?: {
    name: string
    neighborhood: string
  }
  roaster?: Pick<RoasterRef, 'name' | 'slug'>
}
