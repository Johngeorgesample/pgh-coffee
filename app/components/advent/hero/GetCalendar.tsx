import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import { DYNAMIC_SHOP_URL } from '@/app/utils/advent-links'

export default function GetCalendar() {
  return (
    <a
      href={DYNAMIC_SHOP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 font-semibold text-white transition-[transform,background-color] duration-150 ease-out hover:bg-gray-800 active:scale-[0.97]"
    >
      Get a calendar
      <ArrowUpRightIcon className="size-4" />
    </a>
  )
}
