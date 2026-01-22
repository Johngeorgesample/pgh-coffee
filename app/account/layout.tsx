import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from './components/Sidebar'

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 bg-gray-50">
        <div className="p-4 sm:p-6 md:p-8">{children}</div>
      </div>
    </div>
  )
}
