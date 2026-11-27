import type { Metadata } from 'next'
import { Mail } from 'lucide-react'
import { Footer } from '@/app/components/about'
import CopyEmailButton from './CopyEmailButton'

const CONTACT_EMAIL = 'johngeorgesample@gmail.com'

const description = 'Free pgh.coffee stickers, mailed anywhere in the world.'

export const metadata: Metadata = {
  title: 'Stickers | pgh.coffee',
  description,
  alternates: { canonical: '/stickers' },
  openGraph: {
    siteName: 'pgh.coffee',
    title: 'Stickers | pgh.coffee',
    description,
    url: '/stickers',
    images: [{ url: '/stickers.jpg', alt: 'pgh.coffee stickers arranged around a latte' }],
  },
}

const MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('pgh.coffee sticker')}&body=${encodeURIComponent(
  "Mailing address:\n\n\nHow many:\n\n\nAnything else you want to say about Pittsburgh coffee:\n"
)}`

export default function Stickers() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex-1 flex items-center">
        <header className="w-full max-w-7xl mx-auto px-6 py-14 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-950 leading-tight mb-6">
                Stickers.
              </h1>

              <p className="text-xl md:text-2xl text-slate-600 font-light leading-relaxed max-w-xl">
                A small thank-you for anyone who cares about Pittsburgh coffee. Free — I&apos;ll mail one anywhere in the world.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={MAILTO}
                  className="inline-flex items-center justify-center gap-2.5 bg-slate-950 text-white px-6 py-3.5 rounded-xl font-semibold text-sm hover:bg-neutral-800 transition-colors shadow-sm"
                >
                  <Mail className="size-4" aria-hidden="true" />
                  Email me your address
                </a>

                <CopyEmailButton email={CONTACT_EMAIL} />
              </div>

              <p className="mt-4 text-sm text-slate-500 leading-relaxed max-w-md">
                No mail app? Copy <span className="font-mono text-slate-700">{CONTACT_EMAIL}</span> or DM{' '}
                <a
                  href="https://www.instagram.com/pgh.coffee/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-slate-700 underline underline-offset-4 hover:text-yellow-600"
                >
                  @pgh.coffee
                </a>{' '}
                on Instagram. I only use your address to mail the sticker.
              </p>
            </div>

            <div className="relative">
              <img
                alt="pgh.coffee stickers arranged around a latte"
                className="rounded-2xl shadow-2xl object-cover w-full aspect-[4/3] lg:h-[460px] lg:aspect-auto"
                src="/stickers.jpg"
              />
            </div>
          </div>
        </header>
      </div>

      <Footer />
    </div>
  )
}
