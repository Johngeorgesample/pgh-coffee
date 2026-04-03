import { useCallback } from 'react'
import { usePlausible } from 'next-plausible'
import { getFaro } from '@/lib/faro'

export function useAnalytics() {
  const plausible = usePlausible()

  return useCallback(
    (...args: Parameters<typeof plausible>) => {
      plausible(...args)
      try {
        const [eventName, options] = args
        const attributes = options?.props
          ? Object.fromEntries(
              Object.entries(options.props)
                .filter(([, v]) => v !== undefined)
                .map(([k, v]) => [k, String(v)]),
            )
          : undefined
        getFaro()?.api?.pushEvent(String(eventName), attributes)
      } catch {
        // fail silently if Faro isn't initialized
      }
    },
    [plausible],
  )
}
