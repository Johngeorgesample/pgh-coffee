const LOKI_URL = process.env.LOKI_URL
const LOKI_USER = process.env.LOKI_USER
const LOKI_PASSWORD = process.env.LOKI_PASSWORD
const ENV = process.env.NODE_ENV ?? 'development'

type Level = 'info' | 'warn' | 'error'

function push(level: Level, message: string, fields?: Record<string, string>) {
  if (!LOKI_URL || !LOKI_USER || !LOKI_PASSWORD) return

  const timestamp = (Date.now() * 1_000_000).toString()
  const line = fields ? JSON.stringify({ message, ...fields }) : message

  fetch(`${LOKI_URL}/loki/api/v1/push`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${LOKI_USER}:${LOKI_PASSWORD}`).toString('base64')}`,
    },
    body: JSON.stringify({
      streams: [
        {
          stream: { app: 'pgh-coffee', env: ENV, level },
          values: [[timestamp, line]],
        },
      ],
    }),
  }).catch(() => {})
}

export const logger = {
  info:  (message: string, fields?: Record<string, string>) => push('info',  message, fields),
  warn:  (message: string, fields?: Record<string, string>) => push('warn',  message, fields),
  error: (message: string, fields?: Record<string, string>) => push('error', message, fields),
}
