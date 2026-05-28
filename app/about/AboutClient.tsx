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

export default function AboutClient() {
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
