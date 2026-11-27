import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AuthForm from '@/app/components/AuthForm'

// Mock Supabase client
const mockSignInWithPassword = vi.fn()
const mockSignUp = vi.fn()
const mockSignInWithOAuth = vi.fn()

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signUp: mockSignUp,
      signInWithOAuth: mockSignInWithOAuth,
    },
  }),
}))

describe('AuthForm', () => {
  const defaultProps = {
    onSuccess: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
  })

  describe('content', () => {
    it('displays Google sign-in button', () => {
      render(<AuthForm {...defaultProps} />)
      expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument()
    })

    it('displays email input field', () => {
      render(<AuthForm {...defaultProps} />)
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    })

    it('displays password input field', () => {
      render(<AuthForm {...defaultProps} />)
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    })

    it('displays sign in button by default', () => {
      render(<AuthForm {...defaultProps} />)
      expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument()
    })

    it('uses custom id prefix when provided', () => {
      render(<AuthForm {...defaultProps} idPrefix="custom" />)
      expect(screen.getByLabelText(/email/i)).toHaveAttribute('id', 'custom-email')
      expect(screen.getByLabelText(/^password$/i)).toHaveAttribute('id', 'custom-password')
    })
  })

  describe('mode toggle', () => {
    it('shows sign up link when in sign in mode', () => {
      render(<AuthForm {...defaultProps} />)
      expect(screen.getByText("Don't have an account?")).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^sign up$/i })).toBeInTheDocument()
    })

    it('switches to sign up mode when clicking sign up link', () => {
      render(<AuthForm {...defaultProps} />)
      fireEvent.click(screen.getByRole('button', { name: /^sign up$/i }))
      expect(screen.getByText('Already have an account?')).toBeInTheDocument()
    })
  })

  describe('email sign in', () => {
    it('calls signInWithPassword on form submit', async () => {
      mockSignInWithPassword.mockResolvedValueOnce({ error: null })

      render(<AuthForm {...defaultProps} />)

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/^password$/i), {
        target: { value: 'password123' },
      })

      const submitButton = screen.getByRole('button', { name: /^sign in$/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockSignInWithPassword).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        })
      })
    })

    it('calls onSuccess on successful sign in', async () => {
      mockSignInWithPassword.mockResolvedValueOnce({ error: null })

      render(<AuthForm {...defaultProps} />)

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/^password$/i), {
        target: { value: 'password123' },
      })

      const submitButton = screen.getByRole('button', { name: /^sign in$/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(defaultProps.onSuccess).toHaveBeenCalled()
      })
    })

    it('displays error message on sign in failure', async () => {
      mockSignInWithPassword.mockResolvedValueOnce({
        error: { message: 'Invalid login credentials' },
      })

      render(<AuthForm {...defaultProps} />)

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/^password$/i), {
        target: { value: 'wrongpassword' },
      })

      const submitButton = screen.getByRole('button', { name: /^sign in$/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Invalid login credentials')).toBeInTheDocument()
      })
    })
  })

  describe('email sign up', () => {
    beforeEach(() => {
      render(<AuthForm {...defaultProps} />)
      fireEvent.click(screen.getByRole('button', { name: /^sign up$/i }))
    })

    it('calls signUp on form submit in sign up mode', async () => {
      mockSignUp.mockResolvedValueOnce({
        data: { user: { id: 'user-123', identities: [{}] }, session: {} },
        error: null,
      })

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'newuser@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/^password$/i), {
        target: { value: 'newpassword123' },
      })

      const submitButton = screen.getAllByRole('button').find(
        btn => btn.textContent === 'Sign up' && btn.getAttribute('type') === 'submit'
      )
      fireEvent.click(submitButton!)

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith({
          email: 'newuser@example.com',
          password: 'newpassword123',
          options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=%2F` },
        })
      })
    })

    it('shows error when email already exists', async () => {
      mockSignUp.mockResolvedValueOnce({
        data: { user: { id: 'user-123', identities: [] }, session: null },
        error: null,
      })

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'existing@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/^password$/i), {
        target: { value: 'password123' },
      })

      const submitButton = screen.getAllByRole('button').find(
        btn => btn.textContent === 'Sign up' && btn.getAttribute('type') === 'submit'
      )
      fireEvent.click(submitButton!)

      await waitFor(() => {
        expect(
          screen.getByText(/an account with this email already exists/i)
        ).toBeInTheDocument()
      })
    })

    it('shows email confirmation message when needed', async () => {
      mockSignUp.mockResolvedValueOnce({
        data: { user: { id: 'user-123', identities: [{}] }, session: null },
        error: null,
      })

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'newuser@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/^password$/i), {
        target: { value: 'password123' },
      })

      const submitButton = screen.getAllByRole('button').find(
        btn => btn.textContent === 'Sign up' && btn.getAttribute('type') === 'submit'
      )
      fireEvent.click(submitButton!)

      await waitFor(() => {
        expect(
          screen.getByText(/please check your email to confirm/i)
        ).toBeInTheDocument()
      })
    })
  })

  describe('Google OAuth', () => {
    it('calls signInWithOAuth when clicking Google button', async () => {
      mockSignInWithOAuth.mockResolvedValueOnce({ error: null })

      render(<AuthForm {...defaultProps} />)

      fireEvent.click(screen.getByRole('button', { name: /continue with google/i }))

      await waitFor(() => {
        expect(mockSignInWithOAuth).toHaveBeenCalledWith({
          provider: 'google',
          options: {
            redirectTo: expect.stringContaining('/auth/callback'),
          },
        })
      })
    })

    it('displays error on OAuth failure', async () => {
      mockSignInWithOAuth.mockResolvedValueOnce({
        error: { message: 'OAuth error' },
      })

      render(<AuthForm {...defaultProps} />)

      fireEvent.click(screen.getByRole('button', { name: /continue with google/i }))

      await waitFor(() => {
        expect(screen.getByText('OAuth error')).toBeInTheDocument()
      })
    })
  })

  describe('google-first compact mode & UX helpers', () => {
    it('collapses email fields until Continue with email is clicked', () => {
      render(
        <AuthForm
          {...defaultProps}
          variant="advent"
          collapseEmail
          googleLabel="Continue with Google & save"
          submitLabels={{ signin: 'Sign in & save cup', signup: 'Create account & save' }}
          initialMode="signup"
        />
      )

      expect(screen.getByRole('button', { name: 'Continue with Google & save' })).toBeInTheDocument()
      expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument()

      fireEvent.click(screen.getByRole('button', { name: /continue with email/i }))

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Continue with Google' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Create account & save' })).toBeInTheDocument()
    })

    it('toggles password visibility', () => {
      render(<AuthForm {...defaultProps} />)
      const passwordInput = screen.getByLabelText(/^password$/i)
      expect(passwordInput).toHaveAttribute('type', 'password')

      fireEvent.click(screen.getByRole('button', { name: 'Show password' }))
      expect(passwordInput).toHaveAttribute('type', 'text')

      fireEvent.click(screen.getByRole('button', { name: 'Hide password' }))
      expect(passwordInput).toHaveAttribute('type', 'password')
    })

    it('renders confirmation message as a status notice and lets existing users switch to sign in in one click', async () => {
      mockSignUp.mockResolvedValueOnce({
        data: { user: { id: 'user-123', identities: [] }, session: null },
        error: null,
      })

      render(<AuthForm {...defaultProps} initialMode="signup" />)

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'existing@example.com' } })
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } })
      fireEvent.click(screen.getByRole('button', { name: /^sign up$/i }))

      const switchBtn = await screen.findByRole('button', { name: /sign in instead/i })
      fireEvent.click(switchBtn)

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument()
    })
  })
})
