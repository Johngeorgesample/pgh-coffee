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
 *
 * Note: @pyroscope/nodejs depends on @datadog/pprof, a native module compiled
 * at install time. Verify your deployment environment supports native addons
 * (e.g. Netlify Functions) before enabling.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  if (!process.env.PYROSCOPE_SERVER_ADDRESS) return

  let logger: Awaited<typeof import('@/lib/logger')>['logger'] | undefined

  try {
    const [{ init, start }, { logger: _logger }] = await Promise.all([
      import('@pyroscope/nodejs'),
      import('@/lib/logger'),
    ])
    logger = _logger

    if (!process.env.PYROSCOPE_BASIC_AUTH_USER || !process.env.PYROSCOPE_BASIC_AUTH_PASSWORD) {
      logger.warn('Pyroscope: PYROSCOPE_BASIC_AUTH_USER or PYROSCOPE_BASIC_AUTH_PASSWORD is not set — connecting without authentication')
    }

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
    const message = err instanceof Error ? err.message : String(err)
    if (logger) {
      logger.error('Failed to start Pyroscope profiling', { error: message })
    } else {
      console.error('Failed to start Pyroscope profiling:', message)
    }
  }
}
