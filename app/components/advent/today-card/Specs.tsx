import { AdventDay } from '@/data/advent'

export const specs = (entry: AdventDay) =>
  [
    entry.notes.length > 0 && { label: 'Tasting notes', value: entry.notes.join(' · ') },
    entry.origin && { label: 'Origin', value: entry.origin },
    entry.varietal && { label: 'Varietal', value: entry.varietal },
    entry.process && { label: 'Process', value: entry.process },
  ].filter(Boolean) as { label: string; value: string }[]

const Specs = ({ entry }: { entry: AdventDay }) => (
  <dl className="flex flex-col border-y-2 border-gray-950 md:-my-5 md:-mt-7 md:-mr-5 md:border-y-0 md:border-l-2">
    {specs(entry).map(({ label, value }) => (
      <div
        key={label}
        className="flex flex-1 flex-col justify-center border-gray-950/20 py-3 not-last:border-b-2 md:px-5"
      >
        <dt className="text-[10px] font-bold uppercase tracking-widest text-gray-900">{label}</dt>
        <dd className="mt-0.5 text-sm text-gray-950">{value}</dd>
      </div>
    ))}
  </dl>
)

export default Specs
