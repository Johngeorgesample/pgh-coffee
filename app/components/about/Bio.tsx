import Image from 'next/image'

export default function Bio() {
  return (
    <section className="max-w-5xl mx-auto px-6 mb-32 grid md:grid-cols-2 gap-12 items-center">
      <div className="relative group">
        <div className="absolute -inset-4 bg-yellow-300 rounded-3xl transform rotate-3 group-hover:rotate-1 transition-transform"></div>
        <div className="relative w-full aspect-square">
          <Image
            alt="John-George sitting at a table with a laptop and latte"
            className="rounded-2xl object-cover shadow-2xl"
            src="/me.jpg"
            fill
            sizes="(max-width: 768px) 100vw, 500px"
          />
        </div>
      </div>
      <div className="space-y-6">
        <div className="inline-block bg-yellow-300 px-4 py-1 rounded-full text-black font-bold text-sm tracking-wider uppercase">
          The Founder
        </div>
        <h2 className="text-4xl font-black tracking-tight">Meet John-George</h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          Hi, I&apos;m John-George, a coffee lover and software developer from Pittsburgh. For over a decade, I&apos;ve been captivated
          by the city&apos;s coffee scene. What started as a personal quest to explore every shop soon became a mission to
          connect the community and share my discoveries.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          This project has helped thousands of users discover new spots and support Pittsburgh&apos;s small businesses.
          Whether it&apos;s suggesting a favorite shop or providing feedback, your contributions make this project better
          every day.
        </p>
      </div>
    </section>
  )
}
