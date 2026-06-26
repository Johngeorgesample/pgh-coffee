export default function ShopHoursSkeleton() {
  return (
    <section className="animate-pulse border-b border-stone-200 px-4 py-5 sm:px-6">
      <div className="mb-2 flex items-center justify-between">
        <div className="h-4 w-16 rounded bg-gray-200" />
        <div className="h-4 w-20 rounded bg-gray-200" />
      </div>
      <ul className="text-[15px]">
        {Array.from({ length: 7 }).map((_, i) => (
          <li key={i} className="flex items-center justify-between px-2 py-1.5">
            <div className="h-4 w-10 rounded bg-gray-200" />
            <div className="h-4 w-24 rounded bg-gray-200" />
          </li>
        ))}
      </ul>
    </section>
  )
}
