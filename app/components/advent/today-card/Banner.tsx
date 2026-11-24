import Image from 'next/image'
import top from '@/public/advent/top.webp'

const Banner = ({ day, jar }: { day: number; jar: number }) => (
  <div className="relative border-b-4 border-gray-950">
    <Image
      src={top}
      alt=""
      sizes="(min-width: 1024px) 760px, 100vw"
      className="h-16 w-full rounded-t-xl object-cover object-left"
    />
    <span className="absolute bottom-0 left-5 flex translate-y-1/2 items-center gap-3">
      <span
        data-reveal
        className="block size-24 animate-stamp overflow-hidden rounded-full border-4 border-gray-950 shadow-[4px_4px_0_#030712] motion-reduce:animate-none"
      >
        <Image
          src={`/advent/labels/${jar}.webp`}
          alt={`Jar ${jar}`}
          width={240}
          height={240}
          sizes="96px"
          className="size-full"
        />
      </span>
      <span className="mt-12 -rotate-2 rounded-lg border-4 border-gray-950 bg-yellow-300 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-950 shadow-[3px_3px_0_#030712]">
        Today · Day {String(day).padStart(2, '0')}
      </span>
    </span>
  </div>
)

export default Banner
