'use client'

import { Copy, ExternalLink } from 'lucide-react'
import { useCopyToClipboard } from '@/hooks'
import CopyLinkToast from '@/app/components/CopyLinkToast'

export default function ShareLink({ url }: { url: string }) {
  const { showToast, share, closeToast } = useCopyToClipboard()

  return (
    <div className="flex items-center gap-2">
      <code className="flex-1 truncate rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
        {url}
      </code>
      <button
        type="button"
        onClick={() => share(url)}
        className="inline-flex items-center gap-1 rounded-lg py-2 px-3 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        <Copy className="h-4 w-4" />
        Copy
      </button>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 rounded-lg py-2 px-3 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        <ExternalLink className="h-4 w-4" />
        View
      </a>
      <CopyLinkToast isOpen={showToast} onClose={closeToast} />
    </div>
  )
}
