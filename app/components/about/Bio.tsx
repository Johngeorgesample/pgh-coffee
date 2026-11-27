export default function Bio() {
  return (
    <section className="max-w-5xl mx-auto px-6 mb-32 grid md:grid-cols-2 gap-12 items-center">
      <div className="relative group">
        <div className="absolute -inset-4 bg-yellow-300 rounded-3xl transform rotate-3 group-hover:rotate-1 transition-transform"></div>
        <img
          alt="John-George sitting at a table with a laptop and latte"
          className="relative rounded-2xl w-full aspect-square object-cover shadow-2xl"
          src="/me.jpg"
        />
      </div>
      <div className="space-y-6">
        <h2 className="text-4xl font-black tracking-tight">About me</h2>
        <p className="text-lg text-slate-600 leading-relaxed">
Hi, I'm John-George, a software engineer, home barista, and longtime Pittsburgh coffee drinker. Over the past decade, I've spent countless mornings hopping between neighborhoods, tasting coffees, and tracking down newer shops that fly under the radar. What started as a spreadsheet of places to try turned into pgh.coffee: a living directory of 170+ independent shops across Allegheny county and a resource used by more than 12,000 coffee lovers.
        </p>
      </div>
    </section>
  )
}
