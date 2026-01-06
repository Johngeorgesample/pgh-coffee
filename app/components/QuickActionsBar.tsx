'use client'
import { useState } from 'react'
import { GlobeAltIcon, MapPinIcon, ShareIcon } from '@heroicons/react/24/outline'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

interface QuickActionsBarProps {
  coordinates: [number, number]
  website?: string
}

export const getGoogleMapsUrl = (coordinates: { latitude: number; longitude: number }) =>
  `https://www.google.com/maps?q=${coordinates.longitude},${coordinates.latitude}`

export default function QuickActionsBar({ coordinates, website }: QuickActionsBarProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <>
      <div className="flex gap-2 px-4 sm:px-6 py-4 bg-white border-b border-stone-200">
        <a
          href={getGoogleMapsUrl({
            latitude: coordinates[0],
            longitude: coordinates[1],
          })}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-800 px-4 py-2.5 rounded-lg text-sm font-medium border border-stone-200 transition-colors"
        >
          <MapPinIcon className="w-4 h-4" />
          Directions
        </a>
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-50
                       text-stone-800 px-4 py-2.5 rounded-lg text-sm font-medium
                       border border-stone-200 transition-colors"
          >
            <GlobeAltIcon className="w-4 h-4" />
            Website
          </a>
        )}
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-50
                     text-stone-800 px-4 py-2.5 rounded-lg text-sm font-medium
                     border border-stone-200 transition-colors"
        >
          <ShareIcon className="w-4 h-4" />
          Share
        </button>
      </div>

      <Dialog open={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="max-w-lg w-full bg-white rounded-xl p-6 shadow-xl">
            <DialogTitle className="text-lg font-semibold text-stone-900 mb-4">
              Share this shop
            </DialogTitle>
            <div className="space-y-4">
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 break-all text-sm text-stone-700">
                {currentUrl}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 bg-stone-800 hover:bg-stone-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
