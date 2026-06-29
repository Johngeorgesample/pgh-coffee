import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-slate-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <img src="/logo_with_no_text_transparent_108.png" width="36" height="36" alt="pgh.coffee logo" />
          <p className="flex items-center text-2xl">pgh.coffee</p>
        </div>

        <p className="text-xs text-slate-400 italic">© 2026 Crafted with ❤️ and ☕ in Pittsburgh.</p>
      </div>
    </footer>
  )
}
