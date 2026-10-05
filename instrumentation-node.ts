import Pyroscope from '@pyroscope/nodejs'

Pyroscope.init({
  appName: 'pgh-coffee',
  serverAddress: process.env.PYROSCOPE_URL,
  basicAuthUser: process.env.PYROSCOPE_USER,
  basicAuthPassword: process.env.PYROSCOPE_PASSWORD,
  // Netlify Lambdas freeze between requests; the 60s default would rarely get to flush
  flushIntervalMs: 10_000,
})
Pyroscope.start()
