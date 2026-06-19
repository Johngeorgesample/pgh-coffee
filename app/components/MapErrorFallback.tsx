'use client'

interface MapErrorFallbackProps {
  onRetry: () => void
}

export default function MapErrorFallback({ onRetry }: MapErrorFallbackProps) {
  return (
    <div
      role="alert"
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#191a1a] px-6 text-center text-white"
    >
      <p className="max-w-sm text-sm text-gray-300">
        We couldn’t load the coffee shops right now. Please check your connection
        and try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-md bg-yellow-300 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-200"
      >
        Try again
      </button>
    </div>
  )
}
