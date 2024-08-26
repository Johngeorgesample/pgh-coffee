'use client'

import Nav from '@/app/components/Nav'
import QAndA from '@/app/components/QAndA'
export default function About() {
  return (
    <>
      <Nav />
      <div className="max-w-4xl mx-auto px-6 md:px-8 mt-16">
        <h1 className="text-2xl text-bold mb-2">About</h1>
        <p className="mb-5">
        This project&apos;s first iteration was a spreadsheet. I tracked what coffee shops I had been to, where I still needed to visit, and general thoughts on my experience. Then I had the thought every developer has had - &quot;what if I turn the niche thing I care about into a side project?&quot;
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-8">
        <h3 className="text-xl mb-2">FAQ</h3>

        <QAndA
          question="You&apos;re missing ${my_favorite_coffee_shop}"
          answer="I&apos;m focusing on shops in city proper right now."
        />

        <QAndA
          question="I&apos;d like to help! How can I contribute?"
          answer="Pull requests are welcome."
        />

        <QAndA
          question="I found something wrong."
          answer="That&apos;s not a question, but pull requests are welcome."
        />

        <QAndA
          question="Can I use the dataset for my project?"
          answer="Sure! Everything is licensed under MIT."
        />

        <QAndA
          question="Where do the photos come from?"
          answer="Every photo has been taken by me (so far) to ensure there isn&apos;t copyright infringement."
        />

      <p className="font-bold">How can I support your work?</p>
      <p>You can buy me a cortado if you see me around Pittsburgh. Otherwise, you can <a className="underline text-blue-700" href="https://buymeacoffee.com/johngeorgesample" target="_blank">buy me a digital coffee</a>!</p>

      </div>
    </>
  )
}
