import { notFound } from 'next/navigation'
import { getRoasterBySlug } from '@/app/utils/roasters'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function RoasterPage({ params }: Props) {
  const { slug } = await params
  const roaster = await getRoasterBySlug(slug)

  if (!roaster) notFound()

  return null
}
