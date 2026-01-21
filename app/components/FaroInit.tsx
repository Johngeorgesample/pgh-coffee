'use client'

import { useEffect } from 'react'

export function FaroInit() {
  useEffect(() => {
    const initFaro = async () => {
      const { getWebInstrumentations, initializeFaro } = await import('@grafana/faro-web-sdk')
      const { TracingInstrumentation } = await import('@grafana/faro-web-tracing')

      initializeFaro({
        url: 'https://faro-collector-prod-us-east-2.grafana.net/collect/8844f973079025ab519a2686d969081b',
        app: {
          name: 'pgh-coffee',
          version: '1.0.0',
          environment: 'production',
        },
        instrumentations: [
          ...getWebInstrumentations(),
          new TracingInstrumentation(),
        ],
      })
    }

    // Defer Faro initialization until after the page is idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => initFaro())
    } else {
      // Fallback for Safari
      setTimeout(() => initFaro(), 1000)
    }
  }, [])

  return null
}
