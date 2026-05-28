import Image from 'next/image'

export default function Hero() {
  return (
    <header className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">Pittsburgh coffee starts here.</h1>

          <p className="text-xl md:text-2xl text-slate-600 font-light leading-relaxed max-w-xl">Discover Pittsburgh&apos;s best independent coffee shops.</p>
        </div>

        <div className="relative h-[500px] w-full">
          <Image
            alt="Top down view of latte art in a coffee shop"
            className="rounded-2xl shadow-2xl object-cover"
            src="/hero.png"
            fill
            sizes="(max-width: 1024px) 100vw, 600px"
            priority
          />
        </div>
      </div>
    </header>
  )
}
