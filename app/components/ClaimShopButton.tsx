import Link from 'next/link'
import { BadgeCheck } from 'lucide-react'

interface ClaimShopButtonProps {
  shopUUID: string
  shopName: string
}

export default function ClaimShopButton({ shopUUID, shopName }: ClaimShopButtonProps) {
  const href = `/claim?shop=${encodeURIComponent(shopUUID)}&name=${encodeURIComponent(shopName)}`

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-800 px-4 py-2.5 rounded-3xl text-sm font-medium border border-stone-200 transition-colors"
    >
      <BadgeCheck className="size-4" />
      Claim this shop
    </Link>
  )
}
