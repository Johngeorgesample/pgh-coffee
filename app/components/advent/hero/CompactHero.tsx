import GetCalendar from './GetCalendar'
import { CARD, EYEBROW } from './styles'

export default function CompactHero() {
  return (
    <div className="mx-auto hidden max-w-6xl px-6 py-8 returning:block md:py-10">
      <div
        className={`flex -rotate-1 flex-wrap items-end justify-between gap-5 rounded-[2rem] bg-yellow-300 px-6 py-6 md:px-10 ${CARD}`}
      >
        <div>
          <p className={`mb-2 ${EYEBROW}`}>Pittsburgh Coffee Advent Calendar · 2026</p>
          <h1 className="font-serif text-3xl leading-tight tracking-tight text-gray-950 text-balance md:text-4xl">
            <span className="whitespace-nowrap">Twenty-five</span> days of Pittsburgh coffee.
          </h1>
        </div>
        <GetCalendar />
      </div>
    </div>
  )
}
