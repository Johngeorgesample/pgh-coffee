import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, Coffee } from 'lucide-react'
import { Footer } from '@/app/components/about'

export const metadata: Metadata = {
  title: 'Stickers | pgh.coffee',
  description: 'Free pgh.coffee stickers. Grab one at a participating shop, or have one mailed to you.',
}

const MAILTO = `mailto:johngeorgesample@gmail.com?subject=${encodeURIComponent('pgh.coffee sticker')}&body=${encodeURIComponent(
  "Mailing address:\n\n\nHow many:\n\n\nAnything else you want to say about Pittsburgh coffee:\n"
)}`

export default function Stickers() {
  return (
    <div>
      <header className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">Stickers.</h1>

            <p className="text-xl md:text-2xl text-slate-600 font-light leading-relaxed max-w-xl">
              A small thank-you for anyone who cares about Pittsburgh coffee. Free. I&apos;ll mail one anywhere.
            </p>
          </div>

          <div className="relative">
            {/* ponytail: placeholder until a real sticker photo exists — swap the src, keep the frame */}
            <img
              alt="pgh.coffee sticker"
              className="rounded-2xl shadow-2xl object-cover h-[500px] w-full"
              src="/logo_with_background_with_text.jpeg"
            />
          </div>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 pb-20 space-y-12">
        <div className="text-center">
          <h2 className="text-4xl font-black tracking-tight mb-4">How to get one</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border-2 border-gray-200 rounded-2xl p-8 space-y-4">
            <Coffee className="text-yellow-500" size={32} />
            <h3 className="text-2xl font-bold">Find one in the wild</h3>
            <p className="text-slate-600 leading-relaxed">
              A growing number of shops keep a stack by the register. Order something, ask nicely, take one.
            </p>
            <Link className="inline-block font-bold underline underline-offset-4 hover:text-yellow-600" href="/">
              Browse the map
            </Link>
          </div>

          <div className="border-2 border-gray-200 rounded-2xl p-8 space-y-4">
            <Mail className="text-yellow-500" size={32} />
            <h3 className="text-2xl font-bold">Have one mailed to you</h3>
            <p className="text-slate-600 leading-relaxed">
              Anywhere in the world, no charge, no catch. Send me an address and I&apos;ll put one in an envelope. I only
              use it to mail the sticker.
            </p>
            <a className="inline-block font-bold underline underline-offset-4 hover:text-yellow-600" href={MAILTO}>
              Email me an address
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
