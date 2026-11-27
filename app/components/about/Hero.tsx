export default function Hero() {
  return (
    <header className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">Your guide to Pittsburgh's independent coffee scene.</h1>

          <p className="text-xl md:text-2xl text-slate-600 font-light leading-relaxed max-w-xl">170+ local cafés, roasters, and neighborhood favorites. Tracked by a local, not an algorithm.</p>
        </div>

        <div className="relative">
          <img
            alt="Top down view of latte art in a coffee shop"
            className="rounded-2xl shadow-2xl object-cover h-[500px] w-full"
            src="/hero.png"
          />
        </div>
      </div>
    </header>
  )
}
