import { metrics } from '@/lib/metrics'

export function withMetrics(route: string, handler: (...args: any[]) => any) {
  return async (...args: any[]) => {
    const start = Date.now()
    const response = await handler(...args)
    metrics.requestCompleted(route, response.status, (Date.now() - start) / 1000)
    return response
  }
}
