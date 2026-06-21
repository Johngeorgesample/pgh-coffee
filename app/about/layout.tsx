import type { Metadata } from 'next'

const description =
  "pgh.coffee is a hand-curated guide to Pittsburgh's independent coffee shops, built by a local coffee lover and software developer."

export const metadata: Metadata = {
  title: 'About | pgh.coffee',
  description,
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About | pgh.coffee',
    description,
    url: '/about',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
