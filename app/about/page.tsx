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
      <Bio />
      <InTheMedia />
      <JoinTheCommunity />
      <GetInTouch />
      <FrequentlyAskedQuestions />
      <SubmitAShopCTA />
      <Footer />
    </div>
  )
}
