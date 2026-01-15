export default function FrequentlyAskedQuestions() {
  return (
    <section className="space-y-8">
      <h2 className="text-3xl font-display font-bold text-center">Frequently Asked</h2>

      <div className="grid gap-6">
        <div className="p-6 border border-slate-200  rounded-2xl hover:bg-slate-50  transition-colors">
          <h4 className="font-bold text-lg mb-2">How can I contribute to the site?</h4>
          <p className="text-slate-600">
            You can submit new shops through our submission form. We love hearing community
            suggestions!
          </p>
        </div>

        <div className="p-6 border border-slate-200  rounded-2xl hover:bg-slate-50  transition-colors">
          <h4 className="font-bold text-lg mb-2">Why is my favorite shop missing?</h4>
          <p className="text-slate-600">
            New spots pop up every week! If your favorite is missing, tell us and we&apos;ll add
            it to the map ASAP.
          </p>
        </div>

        <div className="p-6 border border-slate-200  rounded-2xl hover:bg-slate-50  transition-colors">
          <h4 className="font-bold text-lg mb-2">Does pgh.coffee have an app?</h4>
          <p className="text-slate-600">
            We&apos;re a web-first experience. You can &quot;Add to Home Screen&quot; on your
            mobile device for a seamless app-like feel.
          </p>
        </div>
      </div>
    </section>
  )
}
