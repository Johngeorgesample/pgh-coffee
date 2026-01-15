import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-slate-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 250 250">
            <path
              fill="#000000"
              stroke="none"
              d="M34.94,10.53 l21.81,48.63 h-51.62 l60.37,180.31 h119 l60.37,-180.31 h-51.62 l21.81,-48.63 z"
            />
          </svg>
          <h1 className="flex items-center text-2xl">pgh.coffee</h1>
        </div>

        <p className="text-xs text-slate-400 italic">© 2026 Crafted with ❤️ and ☕ in Pittsburgh.</p>
      </div>
    </footer>
  )
}
