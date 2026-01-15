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
      <div className="max-w-5xl mx-auto px-6 mb-32">
        <Bio />
      </div>
      <div className="max-w-4xl mx-auto px-6 space-y-16 mb-32">
        <InTheMedia />
      </div>
      <JoinTheCommunity />
      <div className="space-y-12 mx-6 px-6 py-20">
        <GetInTouch />
      </div>
      <div className="max-w-4xl mx-auto px-6 space-y-16 mb-32">
        <FrequentlyAskedQuestions />
      </div>
      <SubmitAShopCTA />
      <Footer />
    </div>
  )
}
