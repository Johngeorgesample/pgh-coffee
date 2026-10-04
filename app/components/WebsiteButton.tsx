import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

interface WebsiteButtonProps {
  website: string
}

export default function WebsiteButton({ website }: WebsiteButtonProps) {
  return (
    <a
      href={website}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Website"
      title="Website"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 transition ease-out active:scale-95"
    >
      <ArrowTopRightOnSquareIcon className="size-[18px]" />
    </a>
  )
}
