import { splitMarked } from '@/app/utils/advent'

export const prose = 'max-w-2xl text-lg leading-relaxed text-gray-800 text-pretty'

const Highlight = ({ text }: { text: string }) => (
  <mark className="relative isolate bg-transparent font-semibold whitespace-nowrap text-gray-950">
    <span
      data-reveal
      aria-hidden
      className="absolute -inset-x-0.5 top-1 bottom-0.5 -z-10 origin-left -rotate-1 animate-sweep rounded-sm [animation-delay:200ms] bg-yellow-300 motion-reduce:animate-none"
    />
    {text}
  </mark>
)

const Blurb = ({ text }: { text: string }) => (
  <p className={prose}>
    {splitMarked(text).map((part, i) => (part.marked ? <Highlight key={i} text={part.text} /> : part.text))}
  </p>
)

export default Blurb
