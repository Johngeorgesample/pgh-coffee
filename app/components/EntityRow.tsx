import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import type { TSearchEntity } from '@/hooks/useMatchedEntities'

export default function EntityRow({ entity, href, icon }: { entity: TSearchEntity; href: string; icon: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-3 transition-colors hover:border-stone-300 hover:bg-stone-50 active:bg-stone-100"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-300 text-gray-950">
          {icon}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900">{entity.name}</span>
        <ChevronRightIcon className="h-4 w-4 shrink-0 text-gray-400 transition-colors group-hover:text-gray-600" />
      </Link>
    </li>
  )
}
