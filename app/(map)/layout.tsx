import { Suspense } from 'react'
import HomeClient from '@/app/components/HomeClient'

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {/* HomeClient reads useSearchParams (events/news list sync), which requires
          a Suspense boundary to keep the surrounding routes statically rendered. */}
      <Suspense>
        <HomeClient />
      </Suspense>
    </>
  )
}
