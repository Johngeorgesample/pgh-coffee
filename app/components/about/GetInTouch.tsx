import { HeartPlus, Instagram, Mail } from 'lucide-react'

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
          href="mailto:johngeorgesample@gmail.com"
          target="_blank"
        >
          <Mail />
          Email John-George
        </a>
        <a
          className="flex-1 flex items-center justify-center gap-3 bg-yellow-400 text-black py-4 px-8 rounded-2xl font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20"
          href="https://www.instagram.com/pgh.coffee/"
          target="_blank"
        >
          <Instagram />
          Follow on Instagram
        </a>
        <a
          className="flex-1 flex items-center justify-center gap-3 border-2 border-gray-300 text-gray-700 py-4 px-8 rounded-2xl font-bold hover:scale-[1.02] transition-transform"
          href="https://buymeacoffee.com/johngeorgesample"
          target="_blank"
        >
          <HeartPlus />
          Support the project
        </a>
      </div>
    </section>
  )
}
