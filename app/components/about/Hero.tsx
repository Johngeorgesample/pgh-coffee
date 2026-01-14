export default function Hero() {
  return (
    <header className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block px-4 py-1 rounded-full bg-primary/20 text-yellow-700 dark:text-primary font-bold text-sm mb-6 uppercase tracking-widest">
            Our Story
          </span>

          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-8">
            Brewing a{' '}
            <span className="italic text-primary drop-shadow-sm">connected</span> community.
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-light leading-relaxed max-w-xl">
            What started as a personal quest to explore every shop in Pittsburgh became a mission
            to unite the city&apos;s coffee lovers.
          </p>
        </div>

        <div className="relative">
          <img
            alt="Top down view of latte art in a cozy cafe"
            className="rounded-2xl editorial-shadow object-cover h-[500px] w-full"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiElTwJDy_pMD4iMmUWtB0UXtBiLG6NsalYuRxUNE1YPbVsL8g7Ngxce6Ill2IMiXGT6HnHSoGjOh5aA6Ed3XRL2mBnTGYTPqbqUYwqxNluX_jWWTXkx19vUqvuVYvfvzKS46eB29hN0n3bY5jdW_9oXwa_zVDN6XlOxr5lgYXv6JKoosFIjmwl0HHAmHFk5s_0eeHstU418990JqnyLp55IFBbNZSDqYq6JmwhJeDg8LoDIeNDK_c0hs1dtR0NmcQmzheTZ53E9E"
          />
        </div>
      </div>
    </header>
  )
}
