export default function FrequentlyAskedQuestions() {
  return (
    <section className="max-w-4xl mx-auto px-6 mb-32 space-y-8">
      <h2 className="text-3xl font-bold text-center">Frequently Asked</h2>

      <div className="grid gap-6">
        <div className="p-6 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors">
          <h4 className="font-bold text-lg mb-2">How can I contribute to the site?</h4>
          <p className="text-slate-600">Use the shop submission form to flag openings, updates, or overlooked cafés. Community tips are one of the fastest ways new spots make it onto the map.</p>
        </div>

        <div className="p-6 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors">
          <h4 className="font-bold text-lg mb-2">Why is my favorite shop missing?</h4>
          <p className="text-slate-600">Pittsburgh's coffee scene moves fast, and new shops open regularly. If a favorite independent café is missing, send the name and neighborhood and I'll get it added as soon as possible.</p>
        </div>

        <div className="p-6 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors">
          <h4 className="font-bold text-lg mb-2">Does pgh.coffee have an app?</h4>
          <p className="text-slate-600">pgh.coffee is built as a fast, web-first experience. On iOS or Android, tap Share and choose Add to Home Screen to launch it like a native app.</p>
        </div>

        <div className="p-6 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors">
          <h4 className="font-bold text-lg mb-2">Why should I use pgh.coffee instead of Google Maps?</h4>
          <p className="text-slate-600">Search "coffee" on Google Maps and you'll wade through national chains, convenience stops, and stale listings. pgh.coffee focuses strictly on independent shops, tracks openings, closings, and events, and is maintained by someone who actually pays attention to the Pittsburgh scene rather than relying on automated scraping.</p>
        </div>
      </div>
    </section>
  )
}
