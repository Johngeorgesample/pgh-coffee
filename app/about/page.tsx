'use client'

import Nav from '@/app/components/Nav'
import QAndA from '@/app/components/QAndA'

export default function About() {
  return (
    <>
      <div className="max-w-4xl mx-auto px-6 md:px-8 mt-16">
        <a href="#about">
          <h1 className="text-base font-semibold leading-7 text-gray-900" id="about">
            About
          </h1>
        </a>
        <p className="mt-1 mb-5 text-sm leading-6">
          Hi, I’m John-George, a coffee lover and developer from Pittsburgh. For almost a decade, I’ve been captivated
          by the city’s coffee scene. What started as a personal quest to explore every shop soon became a mission to
          connect the community and share my discoveries.
        </p>

        <p className="mt-1 mb-5 text-sm leading-6">
          This project has helped thousands of users discover new spots and support Pittsburgh’s small businesses.
          Whether it’s suggesting a favorite shop or providing feedback, your contributions make this project better
          every day.
        </p>

        <p className="mt-1 mb-5 text-sm leading-6">
          I hope this site helps you find your next favorite coffee spot. Feel free to explore, share your
          recommendations, or simply enjoy the journey!
        </p>
      </div>

      {/* Press Section */}
      <div className="max-w-4xl mx-auto mb-4 px-6 md:px-8">
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

      {/* Contact Section */}
      <div className="max-w-4xl mx-auto mb-4 px-6 md:px-8">
        <a href="#contact">
          <h3 className="text-base font-semibold leading-7 text-gray-900" id="contact">
            Contact
          </h3>
        </a>
        <p className="mt-2 text-sm">
          I'd love to hear from you! Whether you have feedback, suggestions, or just want to chat about coffee, don’t
          hesitate to reach out.
        </p>

        <ul className="list-disc ml-8">
          <li>
            <div className="mt-6">
              <p className="font-semibold">Email</p>
              <p className="text-sm leading-6">
                If you have questions, feedback, or ideas, feel free to email me directly at{' '}
                <a href="mailto:johngeorgesample@gmail.com" className="underline text-blue-700">
                  johngeorgesample@gmail.com
                </a>
                . I do my best to respond as quickly as possible!
              </p>
            </div>
          </li>

          <li>
            <div className="mt-6">
              <p className="font-semibold">Social Media</p>
              <p className="text-sm leading-6">
                For quick updates, coffee recommendations, and more, follow{' '}
                <a href="https://www.instagram.com/pgh.coffee" target="_blank" className="underline text-blue-700">
                  @pgh.coffee
                </a>{' '}
                on Instagram. You can also send a DM if you have a coffee-related inquiry or want to share your favorite
                spot!
              </p>
            </div>
          </li>

          <li>
            <div className="mt-6">
              <p className="font-semibold">Submit a Shop</p>
              <p className="text-sm leading-6">
                Want to suggest a new coffee shop to feature? You can submit your recommendations through the{' '}
                <a href="/submit-a-shop" className="underline text-blue-700">
                  Submit a Shop
                </a>{' '}
                page.
              </p>
            </div>
          </li>

          <li>
            <div className="mt-6">
              <p className="font-semibold">Press/Collaborations</p>
              <p className="text-sm leading-6">
                If you're interested in collaborating, media inquiries, or partnership opportunities, feel free to reach
                out to me via email at{' '}
                <a href="mailto:johngeorgesample@gmail.com" className="underline text-blue-700">
                  johngeorgesample@gmail.com
                </a>
                .
              </p>
              <p className="mt-2 text-sm leading-6">
                Whether you're looking to feature the site in your publication, discuss potential partnerships with
                local coffee shops, or collaborate on a project that highlights Pittsburgh’s coffee culture, I'd love to
                hear from you. Let's connect and explore how we can work together to make Pittsburgh's coffee scene even
                more vibrant and accessible!
              </p>
            </div>
          </li>
        </ul>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-6 md:px-8">
        <a href="#faq">
          <h3 className="text-base font-semibold leading-7 text-gray-900" id="faq">
            FAQ
          </h3>
        </a>

        <div className="ml-8">
          <QAndA
            question="Why is my favorite coffee shop missing?"
            answer="As one person, it’s a challenge to keep track of every new shop in the city—there’s always something new popping up! I’m actively working on adding more, and if your favorite spot is missing, feel free to let me know, and I’ll make sure to add it soon!"
          />

          <div className="mb-2 text-sm leading-6">
            <p className="font-semibold">How can I contribute to the site?</p>
            <p>
              I’d love your help! You can submit new shops through the{' '}
              <a className="underline text-blue-700" href="/submit-a-shop">
                Submit a Shop
              </a>{' '}
              page. If you have feedback, suggestions, or corrections, I’m always open to improving the experience with
              the community’s input.
            </p>
          </div>

          <QAndA
            question="Can I use the coffee shop dataset for my project?"
            answer="Absolutely! The entire dataset is licensed under MIT, so you’re free to use it as you like. Just be sure to credit the source if applicable."
          />

          <QAndA
            question="Where do the photos come from?"
            answer="Most of the photos on the site were taken by me to ensure there are no copyright issues. However, if you’re a photographer and would like to contribute, I’d be happy to credit your work!"
          />

          <div className="mb-2 text-sm leading-6">
            <p className="font-semibold">How can I support this project?</p>
            <p>
              If you see me around Pittsburgh, you can buy me a cortado! Otherwise, you can{' '}
              <a className="underline text-blue-700" href="https://buymeacoffee.com/johngeorgesample" target="_blank">
                buy me a digital coffee
              </a>
              . Want to stay in the loop? Follow the site’s Instagram account at{' '}
              <a className="underline text-blue-700" href="https://www.instagram.com/pgh.coffee/" target="_blank">
                @pgh.coffee
              </a>
              . Your support means the world!
            </p>
          </div>

          <div className="mb-2 text-sm leading-6">
            <p className="font-semibold">What’s next for the site?</p>
            <p>
              I’m always working to improve the site. In the future, I hope to add more features, like user accounts so
              you can track your favorite spots and share reviews. Stay tuned!
            </p>
          </div>
        </div>
      </div>
      {/* Press Section */}
      <div className="max-w-4xl mx-auto mb-4 px-6 md:px-8">
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
                Submit a Coffee Shop: If you know a hidden gem that’s not yet featured, let me know!
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
    </>
  )
}
