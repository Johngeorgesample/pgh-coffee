import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface IProps {
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export default function SearchFAB({ handleClick }: IProps) {
  return (
    <button
      aria-label="Search shops"
      className="absolute bottom-[5%] right-[5%] bg-yellow-300 hover:bg-yellow-400 rounded-full h-18 w-18 flex justify-center items-center z-10"
      onClick={handleClick}
    >
      <MagnifyingGlassIcon className="h-8 w-8" />
    </button>
  )
}
