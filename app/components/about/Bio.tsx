export default function Bio() {
  return (
    <article className="flex flex-col md:flex-row gap-12 items-center">
      <div className="flex-1 space-y-6">
        <h2 className="text-3xl font-display font-bold">The Visionary</h2>

        <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          Hi, I&apos;m John-George. For almost a decade, I&apos;ve been captivated by the
          city&apos;s coffee scene. My goal was simple: find every hidden gem and share it with
          people who appreciate a great roast as much as I do.
        </p>

        <div className="flex items-center gap-4">
          <img
            alt="Portrait of John-George"
            className="w-12 h-12 rounded-full border-2 border-primary"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqUP7XOzxtI7Qrqs8TmcqVG2mqee1yN7oxVA7Yb8Y0-8blqbQkvHdK-ibDSuxNvugkx0zx1TmD6Jea6dk7AjYD3n-yg9_f4U3v1k3X_yTDwJaXrPyPsN13VHBirKWkolxT6B405yjKprg2fBJojhVNomVGPoLl4Cno0ze3J6OYn5LEr8FiPA8TCC9-SyQ7ZXn0cgRiMsrZ8Yvd7gRKBE-No6P7MRLB09jaF8v2h9RROXVPHURcGvl7S5qvkzCbQTwNjKNSE9S-SCM"
          />
          <div>
            <p className="font-bold text-sm">John-George</p>
            <p className="text-xs text-slate-500">Founder &amp; Curator</p>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <img
          alt="Coffee beans being roasted"
          className="rounded-xl grayscale hover:grayscale-0 transition-all duration-500"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvI4jXfSc8QtaQBS4jjNAAzzqvngnbzjwSQtZi-MHhNkAPF4AfgSceEdzx65roWUPdnbcx3HSFIIxerBcVFpfwacf-VwrSM58mnXbs9JMgtCTkHdfEQbPajwa77-wYDsl97iJ1krIUdkpaAT5D81rwF4W1UeqWWoMhpskUOB7aJBYrOjg726Y1QauHjS4e_gdN3UW5MzPkp0GFccYthe1kwn-JLlHd02KaAhTR30hnm_bm8rdygwX9kHPdtUkCmrkxjIAP3kdg3xM"
        />
      </div>
    </article>
  )
}
