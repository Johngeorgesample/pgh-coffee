'use client'

import { usePlausible } from 'next-plausible'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface IProps {
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export default function SearchFAB({ handleClick }: IProps) {
  const plausible = usePlausible()

  const handleFABClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    plausible('SearchFABClick')
    handleClick(event)
  }

  return (
    <button
      aria-label="Search shops"
      className="absolute bottom-[15%] right-[5%] bg-yellow-300 hover:bg-yellow-400 rounded-full h-18 w-18 flex justify-center items-center z-10"
      onClick={handleFABClick}
    >
      <MagnifyingGlassIcon className="h-8 w-8" />
    </button>
  )
}
