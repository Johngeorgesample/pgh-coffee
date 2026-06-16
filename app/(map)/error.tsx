'use client'

import { useEffect } from 'react'

export default function MapError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Surfaced to Grafana Faro RUM, which captures console errors.
    console.error('Map route error', error)
  }, [error])

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
      <div>
        <p className="text-lg font-medium">Something went wrong loading this shop.</p>
        <p className="text-sm text-gray-500">Please try again in a moment.</p>
      </div>
      <button
        type="button"
        onClick={reset}
        className="rounded-full bg-yellow-300 px-5 py-2 text-sm font-medium text-black hover:bg-yellow-400"
      >
        Try again
      </button>
    </div>
  )
}
