import Link from 'next/link'
import { BadgeCheck } from 'lucide-react'

interface ClaimShopButtonProps {
  shopUUID: string
  shopName: string
  neighborhood?: string
  companyName?: string | null
}

export default function ClaimShopButton({ shopUUID, shopName, neighborhood, companyName }: ClaimShopButtonProps) {
  const params = new URLSearchParams({ shop: shopUUID, name: shopName })
  if (neighborhood) params.set('neighborhood', neighborhood)
  if (companyName) params.set('company', companyName)
  const href = `/claim?${params.toString()}`

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
