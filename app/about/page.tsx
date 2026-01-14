'use client'

import {
  Hero,
  Stats,
  Bio,
  InTheMedia,
  JoinTheCommunity,
  GetInTouch,
  FrequentlyAskedQuestions,
  SubmitAShopCTA,
  Footer,
} from '@/app/components/about'

export default function About() {
  return (
    <div>
      <Hero />
      <Stats />
      <main className="max-w-4xl mx-auto px-6 space-y-16 mb-32">
        <Bio />
        <InTheMedia />
        <article className="grid md:grid-cols-2 gap-16">
          <JoinTheCommunity />
          <GetInTouch />
        </article>
        <FrequentlyAskedQuestions />
      </main>
      <SubmitAShopCTA />
      <Footer />
    </div>
  )
}
