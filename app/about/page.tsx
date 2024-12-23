'use client'

import Nav from '@/app/components/Nav'
import QAndA from '@/app/components/QAndA'

export default function About() {
  return (
    <div className="max-w-4xl mx-auto mb-12">
      <div className="px-6 md:px-8 mt-16">
        <a href="#about">
          <h1 className="text-base font-semibold leading-7 text-gray-900" id="about">
            About
          </h1>
        </a>
        <p className="mt-1 mb-3 text-sm leading-6">
          Hi, I’m John-George, a coffee lover and developer from Pittsburgh. For almost a decade, I’ve been captivated
          by the city’s coffee scene. What started as a personal quest to explore every shop soon became a mission to
          connect the community and share my discoveries.
        </p>

        <p className="mt-1 mb-3 text-sm leading-6">
          This project has helped thousands of users discover new spots and support Pittsburgh’s small businesses.
          Whether it’s suggesting a favorite shop or providing feedback, your contributions make this project better
          every day.
        </p>

        <p className="mt-1 mb-3 text-sm leading-6">
          I hope this site helps you find your next favorite coffee spot. Feel free to explore, share your
          recommendations, or simply enjoy the journey.
        </p>
      </div>

      {/* Press Section */}
      <div className="mb-4 px-6 md:px-8">
        <a href="#in-the-media">
          <h3 className="text-base font-semibold leading-7 text-gray-900" id="in-the-media">
            In the Media
          </h3>
        </a>
        <p className="text-sm leading-6">
          The project was recently featured in an article on{' '}
          <a
            className="underline text-blue-700"
            href="https://technical.ly/software-development/pittsburgh-coffee-shops-interactive-map-open-source/"
            target="_blank"
          >
            Technical.ly
          </a>
          , where I discussed how it’s helping Pittsburgh’s coffee culture thrive and connect the community.
        </p>
      </div>

      {/* Join the community section */}
      <div className="mb-4 px-6 md:px-8">
        <a href="#join-the-community">
          <h3 className="text-base font-semibold leading-7 text-gray-900" id="join-the-community">
            Join the community
          </h3>
        </a>
        <p className="text-sm leading-6">
          Want to help make Pittsburgh’s coffee scene even better? Here are a few ways you can get involved:
        </p>
        <ul className="list-disc ml-8">
          <li>
            <div className="mt-2">
              <p className="text-sm leading-6">
                Submit a Coffee Shop: If you know a hidden gem that’s not yet featured, let me know.
              </p>
            </div>
          </li>
          <li>
            <div className="mt-2">
              <p className="text-sm leading-6">
                Provide Feedback: Have an idea to improve the site? I’d love to hear it.
              </p>
            </div>
          </li>
          <li>
            <div className="mt-2">
              <p className="text-sm leading-6">
                Spread the Word: Share your favorite spots on social media and encourage others to explore the coffee
                culture in Pittsburgh.
              </p>
            </div>
          </li>
        </ul>
      </div>

      {/* Contact Section */}
      <div className="mb-4 px-6 md:px-8">
        <a href="#contact">
          <h3 className="text-base font-semibold leading-7 text-gray-900" id="contact">
            Contact
          </h3>
        </a>
        <p className="text-sm leading-6">
          I&apos;d love to hear from you. Whether you have feedback, suggestions, or just want to chat about coffee,
          don&apos;t hesitate to reach out.
        </p>

        <ul className="list-disc ml-8">
          <li>
            <div className="mt-4">
              <p className="font-semibold">Email</p>
              <ul className="list-disc ml-8">
                <li>
                  <p className="text-sm leading-6">
                    General inquiries:{' '}
                    <a className="underline text-blue-700" href="mailto:johngeorgesample@gmail.com">
                      johngeorgesample@gmail.com
                    </a>
                  </p>
                </li>
                <li>
                  <p className="text-sm leading-6">Press and partnership opportunities welcome</p>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <div className="mt-6">
              <p className="font-semibold">Social Media</p>
              <ul className="list-disc ml-8">
                <li>
                  <p className="text-sm leading-6">
                    Follow{' '}
                    <a className="underline text-blue-700" href="https://www.instagram.com/pgh.coffee/" target="_blank">
                      @pgh.coffee
                    </a>{' '}
                    on Instagram
                  </p>
                </li>
                <li>
                  <p className="text-sm leading-6">
                    Send a DM with coffee-related inquiries or to share your favorite spot
                  </p>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <div className="mt-6">
              <p className="font-semibold">Submit a Shop</p>
              <p className="text-sm leading-6">
                Discovered a great coffee shop? Use the{' '}
                <a className="underline text-blue-700" href="/submit-a-shop">
                  Submit a Shop
                </a>{' '}
                page to recommend new locations
              </p>
            </div>
          </li>
        </ul>
      </div>

      {/* FAQ Section */}
      <div className="mb-4 px-6 md:px-8">
        <a href="#faq">
          <h3 className="text-base font-semibold leading-7 text-gray-900" id="faq">
            FAQ
          </h3>
        </a>

        <div className="ml-8">
          <div className="mb-2 text-sm leading-6">
            <p className="font-semibold">How can I contribute to the site?</p>
            <p>
              I’d love your help. You can submit new shops through the{' '}
              <a className="underline text-blue-700" href="/submit-a-shop">
                Submit a Shop
              </a>{' '}
              page. If you have feedback, suggestions, or corrections, I’m always open to improving the experience with
              the community’s input.
            </p>
          </div>

          <QAndA
            question="Why is my favorite coffee shop missing?"
            answer="As one person, it’s a challenge to keep track of every new shop in the city—there’s always something new popping up. I’m actively working on adding more, and if your favorite spot is missing, feel free to let me know, and I’ll make sure to add it soon."
          />

          <div className="mb-2 text-sm leading-6">
            <p className="font-semibold">Does pgh.coffee have an app?</p>
            <p>
              While we’re not in the app store, you can pin pgh.coffee to your home screen for a seamless, app-like
              experience. Here’s how:
            </p>

            <ul className="list-disc ml-8">
              <li><span className="">For iPhone (Safari)</span>: Tap the Share button, then choose Add to Home Screen.</li>
              <li><span className="">For Android (Chrome)</span>: Tap the Menu (three dots), then select Add to Home Screen.</li>
            </ul>

            <p>It’s quick and easy, so you can keep exploring Pittsburgh’s coffee scene with just a tap. </p>
          </div>

          <QAndA
            question="Can I use the coffee shop dataset for my project?"
            answer="Absolutely. The entire dataset is licensed under MIT, so you’re free to use it as you like. Just be sure to credit the source if applicable."
          />

          <QAndA
            question="Where do the photos come from?"
            answer="Most of the photos on the site were taken by me to ensure there are no copyright issues. However, if you’re a photographer and would like to contribute, I’d be happy to credit your work."
          />

          <div className="mb-2 text-sm leading-6">
            <p className="font-semibold">What’s next for the site?</p>
            <p>
              Building on the site&apos;s open-source foundation, I&apos;m adding features that will transform
              pgh.coffee from a simple map to a living resource for Pittsburgh&apos;s coffee community. Expect user
              accounts, the ability to track your coffee discoveries, and ways to share your favorite local spots.
            </p>
          </div>

          <div className="mb-2 text-sm leading-6">
            <p className="font-semibold">How can I support this project?</p>
            <p>
              If you see me around Pittsburgh, you can buy me a cortado. Otherwise, you can{' '}
              <a className="underline text-blue-700" href="https://buymeacoffee.com/johngeorgesample" target="_blank">
                buy me a digital coffee
              </a>
              . Want to stay in the loop? Follow the site’s Instagram account at{' '}
              <a className="underline text-blue-700" href="https://www.instagram.com/pgh.coffee/" target="_blank">
                @pgh.coffee
              </a>
              . Your support means the world.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
