import { compress } from 'snappyjs'
import type { ClaimType } from '@/types/claim-types'

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

type Series = { name: string; labels: Record<string, string>; samples: [value: number, timestampMs: number][] }

function encodeTimeSeries({ name, labels: extraLabels, samples }: Series): Buffer {
  const labels = { __name__: name, app: 'pgh-coffee', env: ENV, ...extraLabels }

  const labelBuffers = Object.entries(labels)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => embeddedField(1, encodeLabel(k, v)))

  const sampleBuffers = samples.map(([value, timestampMs]) => embeddedField(2, encodeSample(value, timestampMs)))
  return embeddedField(1, Buffer.concat([...labelBuffers, ...sampleBuffers]))
}

function send(series: Series[]) {
  if (!MIMIR_URL || !MIMIR_USER || !MIMIR_PASSWORD) return

  fetch(`${MIMIR_URL}/api/prom/push`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-protobuf',
      'X-Prometheus-Remote-Write-Version': '0.1.0',
      Authorization: `Basic ${Buffer.from(`${MIMIR_USER}:${MIMIR_PASSWORD}`).toString('base64')}`,
    },
    body: compress(Buffer.concat(series.map(encodeTimeSeries))),
  }).catch(() => {})
}

// Each process reports a running total under its own `instance` label, so every
// series is monotonic and rate()/increase() work across serverless instances.
const INSTANCE = Math.random().toString(36).slice(2, 10)
const counterTotals: Record<string, number> = {}

const counterKey = (metricName: string, labels: Record<string, string>) =>
  `${metricName}|${JSON.stringify(Object.entries(labels).sort())}`

export const nextCounterTotal = (metricName: string, labels: Record<string, string>, by: number) => {
  const key = counterKey(metricName, labels)
  counterTotals[key] = (counterTotals[key] ?? 0) + by
  return counterTotals[key]
}

const counterSeries = (name: string, labels: Record<string, string>, by: number, now: number): Series => {
  const isNew = !(counterKey(name, labels) in counterTotals)
  const total: [number, number] = [nextCounterTotal(name, labels, by), now]
  return { name, labels: { ...labels, instance: INSTANCE }, samples: isNew ? [[0, now - 1], total] : [total] }
}

const DURATION_BUCKETS = [0.1, 0.25, 0.5, 1, 1.5, 2.5, 5, 10, Infinity]

export const histogramSeries = (name: string, labels: Record<string, string>, value: number, now = Date.now()) => [
  ...DURATION_BUCKETS.map((le) =>
    counterSeries(`${name}_bucket`, { ...labels, le: le === Infinity ? '+Inf' : String(le) }, value <= le ? 1 : 0, now)),
  counterSeries(`${name}_count`, labels, 1, now),
  counterSeries(`${name}_sum`, labels, value, now),
]

function increment(metricName: string, labels: Record<string, string> = {}, by = 1) {
  send([counterSeries(metricName, labels, by, Date.now())])
}

function gauge(metricName: string, value: number, labels: Record<string, string> = {}) {
  send([{ name: metricName, labels, samples: [[value, Date.now()]] }])
}

export const metrics = {
  shopSubmitted:              () => increment('shop_submitted_total'),
  shopReportSubmitted:        () => increment('shop_report_submitted_total'),
  claimSubmitted:             (claimType: ClaimType) => increment('claim_submitted_total', { claim_type: claimType }),
  shopAmenityReportSubmitted: () => increment('amenity_report_submitted_total'),
  shopNotFound:               (reason: 'invalid_slug' | 'no_match') => increment('shop_not_found_total', { reason }),
  shopViewed:                 (neighborhood: string) => increment('shop_view_total', { neighborhood }),
  favoriteAdded:              (neighborhood: string) => increment('favorite_added_total', { neighborhood }),
  favoriteRemoved:            () => increment('favorite_removed_total'),
  visitAdded:                 (neighborhood: string, count = 1) => increment('visit_added_total', { neighborhood }, count),
  visitRemoved:               () => increment('visit_removed_total'),
  authSignIn:                 () => increment('auth_signin_total'),
  authSignUp:                 () => increment('auth_signup_total'),
  authSignOut:                () => increment('auth_signout_total'),
  apiError:                   (route: string) => increment('api_error_total', { route }),
  requestCompleted:           (route: string, statusCode: number, durationSeconds: number) => {
    increment('request_total', { route, status_code: String(statusCode) })
    send(histogramSeries('http_request_duration_seconds', { route }, durationSeconds))
  },
  shopsPerNeighborhood:       (neighborhood: string, count: number) => gauge('shops_total', count, { neighborhood }),
  anthropicTokens:            (direction: 'input' | 'output', tokens: number) => {
    if (tokens > 0) increment('anthropic_tokens_total', { direction }, tokens)
  },
}
