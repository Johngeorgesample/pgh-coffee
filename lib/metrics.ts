import { compress } from 'snappyjs'

const MIMIR_URL = process.env.MIMIR_URL
const MIMIR_USER = process.env.MIMIR_USER
const MIMIR_PASSWORD = process.env.MIMIR_PASSWORD
const ENV = process.env.NODE_ENV ?? 'development'

// Minimal protobuf encoder for Prometheus WriteRequest
// https://github.com/prometheus/prometheus/blob/main/prompb/remote.proto

function varint(n: number): Buffer {
  const bytes: number[] = []
  while (n > 127) {
    bytes.push((n & 0x7f) | 0x80)
    n = Math.floor(n / 128)
  }
  bytes.push(n)
  return Buffer.from(bytes)
}

function stringField(fieldNum: number, value: string): Buffer {
  const encoded = Buffer.from(value, 'utf8')
  return Buffer.concat([varint((fieldNum << 3) | 2), varint(encoded.length), encoded])
}

function doubleField(fieldNum: number, value: number): Buffer {
  const buf = Buffer.allocUnsafe(8)
  buf.writeDoubleLE(value, 0)
  return Buffer.concat([varint((fieldNum << 3) | 1), buf])
}

function embeddedField(fieldNum: number, data: Buffer): Buffer {
  return Buffer.concat([varint((fieldNum << 3) | 2), varint(data.length), data])
}

function encodeLabel(name: string, value: string): Buffer {
  return Buffer.concat([stringField(1, name), stringField(2, value)])
}

function encodeSample(value: number, timestampMs: number): Buffer {
  return Buffer.concat([doubleField(1, value), varint((2 << 3) | 0), varint(timestampMs)])
}

function encodeWriteRequest(metricName: string, value: number, extraLabels: Record<string, string>): Buffer {
  const labels = { __name__: metricName, app: 'pgh-coffee', env: ENV, ...extraLabels }

  const labelBuffers = Object.entries(labels)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => embeddedField(1, encodeLabel(k, v)))

  const sample = embeddedField(2, encodeSample(value, Date.now()))
  const timeSeries = embeddedField(1, Buffer.concat([...labelBuffers, sample]))

  return timeSeries
}

function push(metricName: string, value: number, labels: Record<string, string> = {}) {
  if (!MIMIR_URL || !MIMIR_USER || !MIMIR_PASSWORD) return

  const writeRequest = encodeWriteRequest(metricName, value, labels)
  const compressed = compress(writeRequest)

  fetch(`${MIMIR_URL}/api/prom/push`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-protobuf',
      'X-Prometheus-Remote-Write-Version': '0.1.0',
      Authorization: `Basic ${Buffer.from(`${MIMIR_USER}:${MIMIR_PASSWORD}`).toString('base64')}`,
    },
    body: compressed,
  }).catch(() => {})
}

function increment(metricName: string, labels: Record<string, string> = {}) {
  push(metricName, 1, labels)
}

function gauge(metricName: string, value: number, labels: Record<string, string> = {}) {
  push(metricName, value, labels)
}

export const metrics = {
  shopSubmitted:              () => increment('shop_submitted_total'),
  shopReportSubmitted:        () => increment('shop_report_submitted_total'),
  shopAmenityReportSubmitted: () => increment('amenity_report_submitted_total'),
  shopNotFound:               (name: string) => increment('shop_not_found_total', { name }),
  shopViewed:                 (name: string, neighborhood: string) => increment('shop_view_total', { name, neighborhood }),
  favoriteAdded:              (neighborhood: string) => increment('favorite_added_total', { neighborhood }),
  favoriteRemoved:            () => increment('favorite_removed_total'),
  authSignIn:                 () => increment('auth_signin_total'),
  authSignUp:                 () => increment('auth_signup_total'),
  authSignOut:                () => increment('auth_signout_total'),
  apiError:                   (route: string) => increment('api_error_total', { route }),
  requestCompleted:           (route: string, statusCode: number, durationSeconds: number) => {
    increment('request_total', { route, status_code: String(statusCode) })
    gauge('request_duration_seconds', durationSeconds, { route })
  },
  shopsPerNeighborhood:       (neighborhood: string, count: number) => gauge('shops_total', count, { neighborhood }),
}
