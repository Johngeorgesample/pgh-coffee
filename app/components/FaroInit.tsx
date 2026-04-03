'use client'

import { useEffect } from 'react'
import { setFaro } from '@/lib/faro'

export function FaroInit() {
  useEffect(() => {
    Promise.all([import('@grafana/faro-web-sdk'), import('@grafana/faro-web-tracing')]).then(
      ([{ getWebInstrumentations, initializeFaro }, { TracingInstrumentation }]) => {
        setFaro(initializeFaro({
          url: 'https://faro-collector-prod-us-east-2.grafana.net/collect/8844f973079025ab519a2686d969081b',
          app: {
            name: 'pgh-coffee',
            version: '1.0.0',
            environment: 'production',
          },
          instrumentations: [...getWebInstrumentations(), new TracingInstrumentation()],
        }))
      },
    )
  }, [])

  return null
}
