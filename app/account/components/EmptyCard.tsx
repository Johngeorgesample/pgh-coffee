import type { LucideIcon } from 'lucide-react'

export default function EmptyCard({
  icon: Icon,
  title,
  body,
  children,
}: {
  icon: LucideIcon
  title: string
  body: string
  children?: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Icon className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 max-w-sm">{body}</p>
        {children}
      </div>
    </div>
  )
}
