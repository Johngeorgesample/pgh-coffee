import { useCallback } from 'react'
import { usePlausible } from 'next-plausible'
import { faro } from '@grafana/faro-web-sdk'

export function useAnalytics() {
  const plausible = usePlausible()

  return useCallback(
    (...args: Parameters<typeof plausible>) => {
      plausible(...args)
      try {
        const [eventName, options] = args
        const attributes =
          options?.props &&
          Object.fromEntries(
            Object.entries(options.props)
              .filter(([, v]) => v !== undefined)
              .map(([k, v]) => [k, String(v)]),
          )
        faro?.api?.pushEvent(String(eventName), attributes || undefined)
      } catch {
        // fail silently if Faro isn't initialized
      }
    },
    [plausible],
  )
}
