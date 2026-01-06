import { Globe } from 'lucide-react'

interface WebsiteButtonProps {
  website: string
}

export default function WebsiteButton({ website }: WebsiteButtonProps) {
  return (
    <a
      href={website}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-50
                 text-stone-800 px-4 py-2.5 rounded-lg text-sm font-medium
                 border border-stone-200 transition-colors"
    >
      <Globe className="w-4 h-4" />
      Website
    </a>
  )
}
