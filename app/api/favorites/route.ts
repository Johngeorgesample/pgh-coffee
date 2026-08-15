import { createToggleRoute } from '@/lib/toggleRoute'
import { metrics } from '@/lib/metrics'

export const { GET, POST, DELETE } = createToggleRoute({
  table: 'user_favorites',
  label: 'favorite',
  onAdded: metrics.favoriteAdded,
  onRemoved: metrics.favoriteRemoved,
})
