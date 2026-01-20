import Sidebar from './components/Sidebar'

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 bg-gray-50">
        <div className="p-4 sm:p-6 md:p-8">{children}</div>
      </div>
    </div>
  )
}
