import { MessagesSquare, Share2, Store } from 'lucide-react'
import Link from 'next/link'

export default function JoinTheCommunity() {
  return (
    <section className="space-y-12 bg-yellow-500/10 px-6 py-20 rounded-[3rem]">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <h2 className="text-4xl font-black tracking-tight">Join the Community</h2>
        <p className="text-slate-600 text-lg">pgh.coffee gets sharper when you pitch in. A few easy ways to help shape it:</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center gap-3">
            <div className="size-12 bg-yellow-300 rounded-xl flex items-center justify-center shrink-0">
              <Store />
            </div>
            <h3 className="font-bold text-xl">Submit a Shop</h3>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">Spot a new café, roaster, or neighborhood staple that isn't listed yet? Send it over so other locals can find it.</p>
          <Link href="/submit-a-shop" className="inline-block text-center w-full py-2 bg-yellow-300 text-black font-bold rounded-lg hover:opacity-90 transition-opacity">
            Tell me
          </Link>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center gap-3">
            <div className="size-12 bg-yellow-300 rounded-xl flex items-center justify-center shrink-0">
              <MessagesSquare />
            </div>
            <h3 className="font-bold text-xl">Provide Feedback</h3>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">Have a feature idea, a broken detail, or a way the directory could work better on your phone or laptop? Let me know.</p>
          <a href="mailto:johngeorgesample@gmail.com" target="_blank" rel="noopener noreferrer" className="inline-block text-center w-full py-2 bg-yellow-300 text-black font-bold rounded-lg hover:opacity-90 transition-opacity">
            Share ideas
          </a>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center gap-3">
            <div className="size-12 bg-yellow-300 rounded-xl flex items-center justify-center shrink-0">
              <Share2 />
            </div>
            <h3 className="font-bold text-xl">Spread the Word</h3>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">Pass the site along to a friend looking for a new weekend spot, follow along on Instagram, or <Link href="/stickers" className="text-center text-sm font-bold text-slate-600 underline underline-offset-4 hover:text-yellow-600">grab a free sticker</Link>.</p>
          <a
            href="https://www.instagram.com/pgh.coffee"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-center w-full py-2 bg-yellow-300 text-black font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  )
}
