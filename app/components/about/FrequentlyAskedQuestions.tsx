export default function FrequentlyAskedQuestions() {
  return (
    <section className="max-w-4xl mx-auto px-6 mb-32 space-y-8">
      <h2 className="text-3xl font-display font-bold text-center">Frequently Asked</h2>

      <div className="grid gap-6">
        <div className="p-6 border border-slate-200  rounded-2xl hover:bg-slate-50  transition-colors">
          <h4 className="font-bold text-lg mb-2">How can I contribute to the site?</h4>
          <p className="text-slate-600">
            You can submit new shops through the submission form. I love hearing community suggestions!
          </p>
        </div>

        <div className="p-6 border border-slate-200  rounded-2xl hover:bg-slate-50  transition-colors">
          <h4 className="font-bold text-lg mb-2">Why is my favorite shop missing?</h4>
          <p className="text-slate-600">
            New spots pop up every week! If your favorite is missing, tell me and I&apos;ll add it to the map ASAP.
          </p>
        </div>

        <div className="p-6 border border-slate-200  rounded-2xl hover:bg-slate-50  transition-colors">
          <h4 className="font-bold text-lg mb-2">Does pgh.coffee have an app?</h4>
          <p className="text-slate-600">
            The site is a web-first experience. You can &quot;Add to Home Screen&quot; on your mobile device for a
            seamless app-like feel.
          </p>
        </div>

        <div className="p-6 border border-slate-200  rounded-2xl hover:bg-slate-50  transition-colors">
          <h4 className="font-bold text-lg mb-2">Why should I use pgh.coffee instead of Google Maps?</h4>
          <p className="text-slate-600">
            Google Maps shows you almost any business if you search &quot;coffee&quot;, chains, gas stations, places that closed
            months ago. pgh.coffee is curated. Every shop is independently owned, and I track news about openings,
            closings, specials, and events that Maps won&apos;t surface. It&apos;s built by someone who&apos;s actually visited these
            places, not an algorithm.
          </p>
        </div>
      </div>
    </section>
  )
}
