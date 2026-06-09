export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  if (!process.env.PYROSCOPE_URL) return

  let logger: Awaited<typeof import('@/lib/logger')>['logger'] | undefined

  try {
    const [{ init, start }, { logger: _logger }] = await Promise.all([
      import('@pyroscope/nodejs'),
      import('@/lib/logger'),
    ])
    logger = _logger

    if (!process.env.PYROSCOPE_USER || !process.env.PYROSCOPE_PASSWORD) {
      logger.warn('Pyroscope: PYROSCOPE_USER or PYROSCOPE_PASSWORD is not set — connecting without authentication')
    }

    init({
      appName: 'pgh-coffee',
      serverAddress: process.env.PYROSCOPE_URL,
      basicAuthUser: process.env.PYROSCOPE_USER,
      basicAuthPassword: process.env.PYROSCOPE_PASSWORD,
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
