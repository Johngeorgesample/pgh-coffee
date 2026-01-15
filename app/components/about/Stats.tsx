export default function Stats() {
  return (
    <section className="bg-slate-100 py-24 my-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-6xl md:text-7xl font-black text-black mb-4 tracking-tighter">
              8,000+
            </div>
            <p className="text-slate-500 font-medium uppercase tracking-widest text-sm">coffee lovers reached</p>
          </div>

          <div>
            <div className="text-6xl md:text-7xl font-black text-black mb-4 tracking-tighter">
              150+
            </div>
            <p className="text-slate-500 font-medium uppercase tracking-widest text-sm">Local Coffee Shops</p>
          </div>

          <div>
            <div className="text-6xl md:text-7xl font-black text-black mb-4 tracking-tighter">
              10 yrs
            </div>
            <p className="text-slate-500 font-medium uppercase tracking-widest text-sm">Exploring the City</p>
          </div>
        </div>
      </div>
    </section>
  )
}
