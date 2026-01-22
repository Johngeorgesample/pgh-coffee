import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LoginPromptModal from '@/app/components/LoginPromptModal'

// Mock Supabase client (required by AuthForm)
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signInWithOAuth: vi.fn(),
    },
  }),
}))

describe('LoginPromptModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('visibility', () => {
    it('renders when isOpen is true', () => {
      render(<LoginPromptModal {...defaultProps} />)
      expect(screen.getByText('Sign in to save favorites')).toBeInTheDocument()
    })

    it('does not render when isOpen is false', () => {
      render(<LoginPromptModal {...defaultProps} isOpen={false} />)
      expect(screen.queryByText('Sign in to save favorites')).not.toBeInTheDocument()
    })
  })

  describe('content', () => {
    it('displays modal title', () => {
      render(<LoginPromptModal {...defaultProps} />)
      expect(screen.getByText('Sign in to save favorites')).toBeInTheDocument()
    })

    it('displays helpful description', () => {
      render(<LoginPromptModal {...defaultProps} />)
      expect(
        screen.getByText(/create a free account to save your favorite coffee shops/i)
      ).toBeInTheDocument()
    })

    it('displays cancel button', () => {
      render(<LoginPromptModal {...defaultProps} />)
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })

    it('renders AuthForm with login id prefix', () => {
      render(<LoginPromptModal {...defaultProps} />)
      // AuthForm should use login- prefix for IDs
      expect(screen.getByLabelText(/email/i)).toHaveAttribute('id', 'login-email')
      expect(screen.getByLabelText(/password/i)).toHaveAttribute('id', 'login-password')
    })
  })

  describe('cancel behavior', () => {
    it('calls onClose when clicking cancel', () => {
      render(<LoginPromptModal {...defaultProps} />)
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
      expect(defaultProps.onClose).toHaveBeenCalled()
    })
  })
})
