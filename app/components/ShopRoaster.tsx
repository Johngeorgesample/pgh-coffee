import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { Flame } from 'lucide-react'
import Link from 'next/link'
import { TShopRoaster } from '@/types/shop-types'

export default function ShopRoaster({ roaster }: { roaster: TShopRoaster }) {
  return (
    <Link
      href={`/roasters/${roaster.slug}`}
      className="group flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-3 transition-colors hover:border-stone-300 hover:bg-stone-50"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-300 text-gray-950">
        <Flame className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          {roaster.inHouse ? 'Roasts in-house' : 'Coffee by'}
        </span>
        <span className="block truncate text-sm font-medium text-gray-900">{roaster.name}</span>
      </span>
      <ChevronRightIcon className="h-4 w-4 shrink-0 text-gray-400 transition-colors group-hover:text-gray-600" />
    </Link>
  )
}
