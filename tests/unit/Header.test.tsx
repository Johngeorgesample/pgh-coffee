import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Header from '@/app/components/Header'

describe('Header', () => {
  it('renders correctly with all expected elements', () => {
    render(<Header />)
    expect(screen.getByText('pgh.coffee')).toBeInTheDocument()
    expect(screen.getByText('A guide to every coffee shop in Pittsburgh, PA')).toBeInTheDocument()
  })
})
