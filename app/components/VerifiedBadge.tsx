import { CheckBadgeIcon } from '@heroicons/react/24/solid'

interface IProps {
  className?: string
}

export default function VerifiedBadge({ className = '' }: IProps) {
  return (
    <span title="Verified by pgh.coffee" className={`inline-flex shrink-0 ${className}`}>
      <CheckBadgeIcon className="size-5 text-yellow-300 drop-shadow" />
      <span className="sr-only">Verified</span>
    </span>
  )
}
