import { ReactNode } from 'react'

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section>
    <h2 className="mb-4 font-serif text-4xl tracking-tight text-gray-950">{title}</h2>
    {children}
  </section>
)

export default Section
