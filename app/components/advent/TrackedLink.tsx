'use client'

import Link from 'next/link'
import { ComponentProps } from 'react'
import { useAnalytics } from '@/hooks'

type Props = ComponentProps<typeof Link> & { event: string; eventProps: Record<string, string | number> }

export default function TrackedLink({ event, eventProps, onClick, ...props }: Props) {
  const track = useAnalytics()
  return (
    <Link
      {...props}
      onClick={e => {
        track(event, { props: eventProps })
        onClick?.(e)
      }}
    />
  )
}
