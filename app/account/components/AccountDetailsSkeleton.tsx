export default function AccountDetailsSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 animate-pulse">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0" />
        <div className="space-y-2">
          <div className="h-5 w-48 rounded bg-gray-200" />
          <div className="h-4 w-32 rounded bg-gray-200" />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 space-y-4">
        <div className="space-y-2">
          <div className="h-4 w-16 rounded bg-gray-200" />
          <div className="h-5 w-52 rounded bg-gray-200" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-16 rounded bg-gray-200" />
          <div className="h-5 w-40 rounded bg-gray-200" />
        </div>
      </div>

      <div className="border-t border-gray-200 mt-6 pt-6">
        <div className="h-11 w-24 rounded-lg bg-gray-200" />
      </div>
    </div>
  )
}
