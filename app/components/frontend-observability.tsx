'use client'

import { faro, getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk'
import { TracingInstrumentation } from '@grafana/faro-web-tracing'

export default function FrontendObservability() {
  // skip if already initialized
  if (faro.api) {
    return null
  }

  try {
    const faro = initializeFaro({
      url: process.env.NEXT_PUBLIC_FARO_URL,
      app: {
        name: process.env.NEXT_PUBLIC_FARO_APP_NAME || 'unknown_service:webjs',
        namespace: process.env.NEXT_PUBLIC_FARO_APP_NAMESPACE || undefined,
        version: process.env.VERCEL_DEPLOYMENT_ID || '1.0.0',
        environment: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development',
      },

      instrumentations: [
        // Mandatory, omits default instrumentations otherwise.
        ...getWebInstrumentations(),

        // Tracing package to get end-to-end visibility for HTTP requests.
        new TracingInstrumentation(),
      ],
    })
  } catch (e) {
    return null
  }
  return null
}
