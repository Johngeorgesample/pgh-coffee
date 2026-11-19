import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SubmitForm from '@/app/components/submit/SubmitForm'

vi.mock('@/lib/faro', () => ({ getFaro: () => null }))

const fill = () => {
  fireEvent.change(screen.getByLabelText(/shop name/i), { target: { value: 'Test Shop' } })
  fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Fake St' } })
}

const submit = () => fireEvent.click(screen.getByRole('button', { name: /submit shop/i }))

describe('SubmitForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', vi.fn())
  })

  it('shows the API error when the submission is rejected', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'That shop is already listed' }),
    } as Response)

    render(<SubmitForm />)
    fill()
    submit()

    expect(await screen.findByRole('alert')).toHaveTextContent('That shop is already listed')
  })

  it('shows a fallback message when the request never lands', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('offline'))

    render(<SubmitForm />)
    fill()
    submit()

    expect(await screen.findByRole('alert')).toHaveTextContent(/something went wrong/i)
  })

  it('re-enables the button so a failed submission can be retried', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, json: () => Promise.resolve({}) } as Response)

    render(<SubmitForm />)
    fill()
    submit()

    await waitFor(() => expect(screen.getByRole('button', { name: /submit shop/i })).toBeEnabled())
  })
})
