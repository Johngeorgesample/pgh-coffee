export default function Hero() {
  return (
    <header className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">Pittsburgh coffee starts here.</h1>

          <p className="text-xl md:text-2xl text-slate-600 font-light leading-relaxed max-w-xl">A guide to Pittsburgh&apos;s independent coffee shops. Built by a local coffee-obsessed software engineer who wanted a better way to find great spots across the city.</p>
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
