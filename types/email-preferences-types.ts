export type NotificationType = 'news' | 'events' | 'promotions' | 'new_locations'

export type NotificationFrequency = 'immediate' | 'daily' | 'weekly'

export interface EmailPreferences {
  id: string
  user_id: string
  notifications_enabled: boolean
  notification_frequency: NotificationFrequency
  notification_types: NotificationType[]
  created_at: string
  updated_at: string
}

export interface ShopEmailPreference {
  id: string
  user_id: string
  shop_id: string
  subscribed: boolean
  created_at: string
  updated_at: string
  shop?: {
    uuid: string
    name: string
    neighborhood: string
  }
}

export interface EmailPreferencesResponse {
  global: EmailPreferences | null
  shops: ShopEmailPreference[]
}

export interface UpdateGlobalPreferencesRequest {
  notifications_enabled: boolean
  notification_frequency: NotificationFrequency
  notification_types: NotificationType[]
}

export interface UpdateShopPreferenceRequest {
  subscribed: boolean
}
