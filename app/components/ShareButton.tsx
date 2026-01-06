import { ShareIcon } from '@heroicons/react/24/outline'

interface ShareButtonProps {
  onClick: () => void
}

export default function ShareButton({ onClick }: ShareButtonProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-50
                 text-stone-800 px-4 py-2.5 rounded-lg text-sm font-medium
                 border border-stone-200 transition-colors"
    >
      <ShareIcon className="w-4 h-4" />
      Share
    </button>
  )
}
