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
      className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
    >
      <BadgeCheck className="size-4" />
      Claim this shop
    </Link>
  )
}
