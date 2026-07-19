import type { Metadata } from 'next'
import Link from 'next/link'
import { Footer } from '@/app/components/about'
import { buildShopPath } from '@/app/utils/seo'

const STICKER_SHOPS = [
  { name: 'Dynamic Coffee: La Galeria', neighborhood: 'East Liberty', uuid: 'fa42ce7e-6cca-4f61-930f-f3a52bd6e015' },
]

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
            <img
              alt="pgh.coffee sticker"
              className="rounded-2xl shadow-2xl object-cover h-[500px] w-full"
              src="/stickers.jpg"
            />
          </div>
        </div>
      </header>

      <section className="max-w-2xl mx-auto px-6 pb-20 space-y-10">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Want one mailed to you?</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            <a className="font-bold text-slate-900 underline underline-offset-4 hover:text-yellow-600" href={MAILTO}>
              Send me an address.
            </a>{' '}
            Anywhere in the world, no charge. I only use it to mail the sticker.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Out and about?</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Order something and ask — stickers live by the register at:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            {STICKER_SHOPS.map(shop => (
              <li key={shop.uuid} className="text-lg text-slate-600 leading-relaxed">
                <Link
                  className="font-bold text-slate-900 underline underline-offset-4 hover:text-yellow-600"
                  href={buildShopPath(shop)}
                >
                  {shop.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </div>
  )
}
