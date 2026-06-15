import HomeClient from '@/app/components/HomeClient'

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <HomeClient />
    </>
  )
}
