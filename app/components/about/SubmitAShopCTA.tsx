import { Coffee } from 'lucide-react'
import Link from 'next/link'

export default function SubmitAShopCTA() {
  return (
    <section className="bg-yellow-300 text-black py-24 text-center">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="font-serif text-4xl md:text-6xl font-bold mb-8">Know an independent shop that belongs on the map?</h2>
        <p className="text-xl mb-12 opacity-80 max-w-2xl mx-auto">Help keep Pittsburgh's coffee shop directory accurate and up to date.</p>
        <Link href="/submit-a-shop"
          className="w-fit bg-gray-950 text-white px-10 py-5 rounded-full text-xl font-bold hover:scale-105 transition-transform flex items-center gap-3 mx-auto shadow-xl"
        >
          <Coffee />
          Submit a Shop Now
        </Link>
      </div>
    </section>
  )
}
