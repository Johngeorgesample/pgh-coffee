import Image from 'next/image'
import top from '@/public/advent/top.webp'
import right from '@/public/advent/right.webp'
import bottom from '@/public/advent/bottom.webp'
import left from '@/public/advent/left.webp'

const ROWS = [
  { sides: [top, right, bottom, left], className: '-translate-x-[8%]' },
  { sides: [right, bottom, left, top], className: '-translate-x-[31%]' },
]

export default function Wallpaper() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 flex flex-col">
      {ROWS.map(({ sides, className }, row) => (
        <div key={className} className={`flex-1 ${className}`}>
          <div
            className={`flex h-full w-max md:motion-safe:animate-marquee [animation-duration:150s] motion-reduce:animate-none ${row % 2 ? '[animation-direction:reverse]' : ''}`}
          >
            {[...sides, ...sides].map((side, i) => (
              <Image
                key={i}
                src={side}
                alt=""
                sizes="(min-width: 1024px) 1400px, 1000px"
                className={`h-full w-auto shrink-0 ${i >= sides.length ? 'max-md:hidden' : ''}`}
              />
            ))}
          </div>
        </div>
      ))}
      <div className="absolute inset-0 bg-white/75" />
    </div>
  )
}
