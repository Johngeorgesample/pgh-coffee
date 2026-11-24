import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import Reveal from '@/app/components/advent/Reveal'

let fireIntersection: (target: Element) => void = () => {}

vi.stubGlobal(
  'IntersectionObserver',
  class {
    constructor(callback: IntersectionObserverCallback) {
      fireIntersection = target => callback([{ target, isIntersecting: true } as IntersectionObserverEntry], this as never)
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  },
)

const renderSection = () =>
  render(
    <>
      <section data-reveal data-testid="section">
        <button>Open</button>
      </section>
      <Reveal />
    </>,
  )

describe('Reveal', () => {
  afterEach(() => document.documentElement.removeAttribute('data-reveal-ready'))

  it('reveals a section once it scrolls into view', () => {
    renderSection()
    fireIntersection(screen.getByTestId('section'))
    expect(screen.getByTestId('section')).toHaveAttribute('data-revealed')
  })

  it('reveals a section as soon as keyboard focus lands inside it', () => {
    renderSection()
    fireEvent.focusIn(screen.getByRole('button'))
    expect(screen.getByTestId('section')).toHaveAttribute('data-revealed')
  })
})
