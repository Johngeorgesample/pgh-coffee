'use client'

import { useEffect } from 'react'
import { getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk'
import { TracingInstrumentation } from '@grafana/faro-web-tracing'

export function FaroInit() {
  useEffect(() => {
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
  }, [])

  return null
}
