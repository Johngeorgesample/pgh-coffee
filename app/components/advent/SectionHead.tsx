export default function SectionHead({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b-2 border-gray-950 pb-2">
      <h3 className="font-serif text-2xl tracking-tight text-gray-950">{title}</h3>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">{count} jars</p>
    </div>
  )
}
