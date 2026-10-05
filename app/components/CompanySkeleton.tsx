export default function CompanySkeleton() {
  return (
    <div className="flex h-full flex-col overflow-y-auto animate-pulse">
      <div className="h-56 sm:h-64 bg-gray-200 shrink-0" />
      <div className="px-6 lg:px-4 py-6 flex flex-col">
        <div className="flex gap-2 mb-4">
          <div className="h-8 w-24 bg-gray-200 rounded-full" />
          <div className="h-8 w-24 bg-gray-200 rounded-full" />
        </div>
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}
