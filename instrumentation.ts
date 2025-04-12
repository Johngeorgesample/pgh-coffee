import { Context } from '@opentelemetry/api'
import { ReadableSpan, Span, SpanProcessor } from '@opentelemetry/sdk-trace-node'
import { registerOTel } from '@vercel/otel'

/**
 * Span processor to reduce cardinality of span names.
 *
 * Customize with care!
 */
class SpanNameProcessor implements SpanProcessor {
  forceFlush(): Promise<void> {
    return Promise.resolve()
  }
  onStart(span: Span, parentContext: Context): void {
    if (span.name.startsWith('GET /_next/static')) {
      span.updateName('GET /_next/static')
    } else if (span.name.startsWith('GET /_next/data')) {
      span.updateName('GET /_next/data')
    }
  }
  onEnd(span: ReadableSpan): void {}
  shutdown(): Promise<void> {
    return Promise.resolve()
  }
}

export function register() {
  registerOTel({
    serviceName: process.env.OTEL_SERVICE_NAME || 'unknown_service:node',
    spanProcessors: ['auto', new SpanNameProcessor()],
  })
}
