'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Coffee } from 'lucide-react'
import usePanelStore from '@/stores/panelStore'

export default function NotFound() {
  const setHidden = usePanelStore(s => s.setHidden)

  // A 404 under /shops, /roasters, /companies, /news or /events renders inside
  // the map layout, so HomeClient would otherwise mount the map and panel too.
  useEffect(() => {
    setHidden(true)
    return () => setHidden(false)
  }, [setHidden])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <Coffee className="h-12 w-12 text-gray-300 mb-4" />
      <h2 className="text-lg font-medium text-gray-900 mb-2">Page not found</h2>
      <p className="text-gray-500 max-w-sm mb-6">
        We couldn&apos;t find that one. It may have moved or closed up shop.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg py-3 px-4 text-sm font-semibold text-black bg-yellow-300 hover:bg-yellow-400"
      >
        Go home
      </Link>
    </div>
  )
}
