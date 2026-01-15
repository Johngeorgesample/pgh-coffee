import { Instagram, Mail } from 'lucide-react'

export default function GetInTouch() {
  return (
    <section className="max-w-4xl mx-auto space-y-12">
      <div className="text-center">
        <h2 className="text-4xl font-black tracking-tight mb-4">Get in Touch</h2>
        <p className="text-slate-600 text-lg">
          Whether you have feedback, suggestions, or just want to chat about coffee, don't hesitate to reach out.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <a
          className="flex-1 flex items-center justify-center gap-3 bg-slate-900  text-white  py-4 px-8 rounded-2xl font-bold hover:scale-[1.02] transition-transform"
          href="mailto:hello@pgh.coffee"
        >
          <Mail />
          Email John-George
        </a>
        <a
          className="flex-1 flex items-center justify-center gap-3 bg-yellow-400 text-black py-4 px-8 rounded-2xl font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20"
          href="#"
        >
          <Instagram />
          Follow on Instagram
        </a>
      </div>
    </section>
  )
}
