'use client'
// PROTOTYPE: floating variant switcher. Throwaway.

import { useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type Props = { variants: { key: string; name: string }[]; current: string }

export default function PrototypeSwitcher({ variants, current }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const index = Math.max(0, variants.findIndex((v) => v.key === current))

  const go = (delta: number) => {
    const next = variants[(index + delta + variants.length) % variants.length]
    const params = new URLSearchParams(searchParams.toString())
    params.set('variant', next.key)
    router.replace(`${pathname}?${params}`, { scroll: false })
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement
      if (el.closest('input, textarea, [contenteditable]')) return
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (process.env.NODE_ENV === 'production') return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-full bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-xl">
      <button type="button" onClick={() => go(-1)}>←</button>
      <span>
        {variants[index].key} ({variants[index].name})
      </span>
      <button type="button" onClick={() => go(1)}>→</button>
    </div>
  )
}
