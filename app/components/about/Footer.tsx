import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-slate-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-400 p-1.5 rounded">
            <span className="material-icons-outlined text-black text-sm">local_cafe</span>
          </div>
          <span className="font-extrabold tracking-tighter uppercase">pgh.coffee</span>
        </div>

        <div className="flex gap-8 text-sm font-medium text-slate-500">
          <Link className="hover:text-primary" href="/">
            Home
          </Link>
          <a className="hover:text-primary" href="#">
            Contact
          </a>
        </div>

        <p className="text-xs text-slate-400 italic">© 2024 Crafted with caffeine in Pittsburgh.</p>
      </div>
    </footer>
  )
}
