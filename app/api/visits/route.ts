import { createToggleRoute } from '@/lib/toggleRoute'
import { metrics } from '@/lib/metrics'

export const { GET, POST, DELETE } = createToggleRoute({
  table: 'user_visits',
  label: 'visit',
  onAdded: metrics.visitAdded,
  onRemoved: metrics.visitRemoved,
})
