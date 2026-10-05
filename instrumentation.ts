export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.PYROSCOPE_URL) {
    await import('./instrumentation-node')
  }
}
