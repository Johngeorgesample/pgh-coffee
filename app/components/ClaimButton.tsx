import Link from 'next/link'
import { BadgeCheck } from 'lucide-react'

interface ClaimButtonProps {
  href: string
  label: string
}

export default function ClaimButton({ href, label }: ClaimButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3.5 py-2 text-sm font-semibold text-stone-700 shadow-sm hover:bg-stone-50 hover:border-stone-400 active:scale-[0.98] transition-all"
    >
      <BadgeCheck className="size-4" />
      {label}
    </Link>
  )
}
