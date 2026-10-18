export default function EntitySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">{title}</h2>
      <ul className="flex flex-col gap-2">{children}</ul>
    </section>
  )
}
