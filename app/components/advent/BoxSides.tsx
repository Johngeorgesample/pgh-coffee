import Image from 'next/image'
import top from '@/public/advent/top.png'
import right from '@/public/advent/right.png'
import bottom from '@/public/advent/bottom.png'
import left from '@/public/advent/left.png'

const SIDES = [top, right, bottom, left]

const Strip = ({ hidden }: { hidden?: boolean }) => (
  <div aria-hidden={hidden} className="flex shrink-0">
    {SIDES.map(side => (
      <Image key={side.src} src={side} alt="" sizes="640px" className="h-32 w-auto md:h-44" />
    ))}
  </div>
)

export default function BoxSides() {
  return (
    <div className="overflow-hidden border-y-4 border-gray-950 bg-white">
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        <Strip />
        <Strip hidden />
      </div>
    </div>
  )
}
