'use client'

import Nav from '@/app/components/Nav'
import QAndA from '@/app/components/QAndA'
export default function About() {
  return (
    <>
      <Nav />
      <div className="max-w-4xl mx-auto px-6 md:px-8">
        <p className="mb-5">
        This project&apos;s first iteration was a spreadsheet. I tracked what coffee shops I had been to, where I still needed to visit, and general thoughts on my experience. Then I had the thought every developer has had - &quot;what if I turn the niche thing I care about into a side project?&quot; This site is the result of that thought.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-8">
        <h3>FAQ</h3>

        <QAndA
          question="I&apos;d like to help! How can I contribute?"
          answer="Pull requests are welcome."
        />

        <QAndA
          question="I found something wrong"
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


        {/*<p>You can buy me a coffee if you see me around Pittsburgh. If you&apos;re not local, I also acccept digital coffee! <a className="underline text-blue-700" href="https://buymeacoffee.com/johngeorgesample">https://buymeacoffee.com/johngeorgesample</a></p>*/}

        <QAndA
          question="How can I support your work?"
          answer=""
        />

      </div>
    </>
  )
}
