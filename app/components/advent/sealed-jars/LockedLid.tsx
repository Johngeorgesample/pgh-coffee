import Image from 'next/image'
import { ReactNode } from 'react'

export const LID =
  'block aspect-square w-full overflow-hidden rounded-full border-2 border-gray-950 shadow-[3px_3px_0_#030712]'

export const Label = ({ jar }: { jar: number }) => (
  <Image src={`/advent/labels/${jar}.webp`} alt="" width={240} height={240} sizes="96px" className="size-full" />
)

export default function LockedLid({
  jar,
  className = '',
  children,
}: {
  jar: number
  className?: string
  children?: ReactNode
}) {
  return (
    <span className={`${LID} ${className}`}>
      {children}
      <Label jar={jar} />
    </span>
  )
}
