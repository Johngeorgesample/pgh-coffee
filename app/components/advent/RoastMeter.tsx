import { agtronPercent, beanShade } from '@/app/utils/advent'

export default function RoastMeter({ agtron, roast }: { agtron: number; roast?: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-[11px] font-bold uppercase tracking-widest text-stone-500">
        <span>Roast</span>
        <span className="font-mono normal-case tracking-normal">Agtron {Math.round(agtron)}</span>
      </div>
      <div
        className="relative mt-2.5 h-2 rounded-full"
        style={{ background: `linear-gradient(to right, ${beanShade(40)}, ${beanShade(100)})` }}
      >
        <span
          className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full shadow ring-[3px] ring-white"
          style={{ left: `${agtronPercent(agtron) * 100}%`, background: beanShade(agtron) }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-xs text-stone-400">
        <span>Dark</span>
        {roast && <span className="font-semibold text-slate-900">{roast}</span>}
        <span>Light</span>
      </div>
    </div>
  )
}
