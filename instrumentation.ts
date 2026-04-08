/**
 * Next.js instrumentation hook — called once on server process startup.
 *
 * Starts Grafana Pyroscope continuous profiling when running in the Node.js
 * runtime and PYROSCOPE_SERVER_ADDRESS is configured.
 *
 * Required environment variables:
 *   PYROSCOPE_SERVER_ADDRESS      – Pyroscope / Grafana Cloud Profiles URL
 *
 * Optional environment variables:
 *   PYROSCOPE_APPLICATION_NAME    – app label sent with profiles (default: "pgh-coffee")
 *   PYROSCOPE_BASIC_AUTH_USER     – Grafana Cloud instance ID for basic auth
 *   PYROSCOPE_BASIC_AUTH_PASSWORD – Grafana Cloud API token for basic auth
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  if (!process.env.PYROSCOPE_SERVER_ADDRESS) return

  try {
    const { init, start } = await import('@pyroscope/nodejs')
    const { logger } = await import('@/lib/logger')

    init({
      appName: process.env.PYROSCOPE_APPLICATION_NAME ?? 'pgh-coffee',
      serverAddress: process.env.PYROSCOPE_SERVER_ADDRESS,
      basicAuthUser: process.env.PYROSCOPE_BASIC_AUTH_USER,
      basicAuthPassword: process.env.PYROSCOPE_BASIC_AUTH_PASSWORD,
      tags: { env: process.env.NODE_ENV ?? 'development' },
    })

    start()
    logger.info('Pyroscope profiling started')
  } catch (err) {
    const { logger } = await import('@/lib/logger')
    logger.error('Failed to start Pyroscope profiling', {
      error: err instanceof Error ? err.message : String(err),
    })
  }
}
