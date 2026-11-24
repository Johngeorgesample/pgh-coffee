import { AdventDay } from '@/data/advent'

export const specs = (entry: AdventDay) =>
  [
    ['Tasting notes', entry.notes.join(' · ')],
    ['Origin', entry.origin],
    ['Varietal', entry.varietal],
    ['Process', entry.process],
    ['Producer', entry.producer],
    ['Roaster since', entry.founded && String(entry.founded)],
  ].filter((pair): pair is [string, string] => Boolean(pair[1]))

const SpecList = ({ entry }: { entry: AdventDay }) => (
  <dl className="border-y-2 border-gray-950 text-sm">
    {specs(entry).map(([label, value]) => (
      <div key={label} className="flex justify-between gap-6 border-gray-950/20 py-2.5 not-last:border-b-2">
        <dt className="text-[10px] font-bold uppercase tracking-widest text-gray-900">{label}</dt>
        <dd className="text-right font-semibold text-gray-950">{value}</dd>
      </div>
    ))}
  </dl>
)

export default SpecList
