'use client'

import Nav from '@/app/components/Nav'
import QAndA from '@/app/components/QAndA'
export default function About() {
  return (
    <>
      <div className="max-w-4xl mx-auto px-6 md:px-8 mt-16">
        <h1 className="text-base font-semibold leading-7 text-gray-900">About</h1>
        <p className="mt-1 mb-5 text-sm leading-6">
          This project&apos;s first iteration was a spreadsheet. I tracked what coffee shops I had been to, where I
          still needed to visit, and general thoughts on my experience. Then I had the thought every developer has had -
          &quot;what if I turn the niche thing I care about into a side project?&quot;
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-8">
        <h3 className="text-base font-semibold leading-7 text-gray-900">FAQ</h3>

        <QAndA
          question="You're missing ${my_favorite_coffee_shop}"
          answer="I'm actively working on adding shops in Allegheny county."
        />

        <QAndA question="I'd like to help! How can I contribute?" answer="Pull requests are welcome." />

        <QAndA question="I found something wrong." answer="That's not a question, but pull requests are welcome." />

        <QAndA question="Can I use the dataset for my project?" answer="Sure! Everything is licensed under MIT." />

        <QAndA
          question="Where do the photos come from?"
          answer="Almost every photo has been taken by me to ensure there isn't copyright infringement."
        />

        <div className="mb-2 text-sm leading-6">
          <p className="font-semibold">How can I support your work?</p>
          <p>
            You can buy me a cortado if you see me around Pittsburgh. Otherwise, you can{' '}
            <a className="underline text-blue-700" href="https://buymeacoffee.com/johngeorgesample" target="_blank">
              buy me a digital coffee
            </a>
            !
          </p>
        </div>
      </div>
    </>
  )
}
