export default function Hero() {
  return (
    <header className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block px-4 py-1 rounded-full bg-yellow-400/20 text-yellow-700 font-bold text-sm mb-6 uppercase tracking-widest">
            My Story
          </span>

          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-8">
            Brewing a{' '}
            <span className="italic text-yellow-400">connected</span> community.
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 font-light leading-relaxed max-w-xl">
            What started as a personal quest to explore every shop in Pittsburgh became a mission
            to unite the city&apos;s coffee lovers.
          </p>
        </div>

        <div className="relative">
          <img
            alt="Top down view of latte art in a cozy cafe"
            className="rounded-2xl editorial-shadow object-cover h-[500px] w-full"
            src="/hero.png"
          />
        </div>
      </div>
    </header>
  )
}
