import { agtronPercent, beanShade } from '@/app/utils/advent'

export default function RoastMeter({ agtron, roast }: { agtron: number; roast?: string }) {
  const darkness = Math.round((1 - agtronPercent(agtron)) * 100)
  const left = `${darkness}%`
  return (
    <div>
      <span aria-hidden className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Roast</span>
      <div
        role="meter"
        aria-label="Roast level"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={darkness}
        aria-valuetext={`${roast ? `${roast}, ` : ''}Agtron ${agtron} (lower is darker)`}
        className="relative mt-2.5 h-3 rounded-full border-2 border-gray-950"
        style={{ background: `linear-gradient(to left, ${beanShade(40)}, ${beanShade(100)})` }}
      >
        <span
          className="absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gray-950 shadow-[2px_2px_0_#030712]"
          style={{ left, background: beanShade(agtron) }}
        />
      </div>
      <div aria-hidden className="relative mt-1.5 h-5 text-xs">
        <span className="absolute left-0 font-semibold text-gray-900">Light</span>
        <span className="absolute right-0 font-semibold text-gray-900">Dark</span>
        {roast && (
          <span
            className="absolute -translate-x-1/2 rounded-md bg-gray-950 px-1.5 py-0.5 font-bold whitespace-nowrap text-white"
            style={{ left: `clamp(2.5rem, ${left}, calc(100% - 2.5rem))` }}
          >
            {roast}
          </span>
        )}
      </div>
    </div>
  )
}
