export default function Stats() {
  return (
    <section className="bg-slate-50 dark:bg-slate-900/50 py-24 my-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-6xl md:text-7xl font-black text-primary mb-4 tracking-tighter">
              1,000s
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest text-sm">
              Active Monthly Users
            </p>
          </div>

          <div>
            <div className="text-6xl md:text-7xl font-black text-primary mb-4 tracking-tighter">
              100+
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest text-sm">
              Local Coffee Shops
            </p>
          </div>

          <div>
            <div className="text-6xl md:text-7xl font-black text-primary mb-4 tracking-tighter">
              10 yrs
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest text-sm">
              Exploring the City
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
