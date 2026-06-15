'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Coffee } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <Coffee className="h-12 w-12 text-gray-300 mb-4" />
      <h2 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-gray-500 max-w-sm mb-6">
        We hit a snag loading this page. Please try again.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg py-3 px-4 text-sm font-semibold text-black bg-yellow-300 hover:bg-yellow-400"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
