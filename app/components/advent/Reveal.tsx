'use client'

import { useEffect } from 'react'

const PENDING = '[data-reveal]:not([data-revealed])'

const revealWhenSeen = () =>
  new IntersectionObserver(
    (entries, observer) =>
      entries
        .filter(entry => entry.isIntersecting)
        .forEach(({ target }) => {
          target.setAttribute('data-revealed', '')
          observer.unobserve(target)
        }),
    { rootMargin: '0px 0px -20% 0px' },
  )

const observePending = (observer: IntersectionObserver) => document.querySelectorAll(PENDING).forEach(el => observer.observe(el))

export default function Reveal() {
  useEffect(() => {
    const seen = revealWhenSeen()
    const added = new MutationObserver(() => observePending(seen))
    observePending(seen)
    added.observe(document.body, { childList: true, subtree: true })
    document.documentElement.setAttribute('data-reveal-ready', '')
    return () => {
      document.documentElement.removeAttribute('data-reveal-ready')
      added.disconnect()
      seen.disconnect()
    }
  }, [])
  return null
}
