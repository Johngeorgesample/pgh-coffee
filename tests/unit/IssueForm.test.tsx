import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import IssueForm from '@/app/components/IssueForm'
import { TShop } from '@/types/shop-types'

const mockShop: TShop = {
  type: 'shop',
  properties: {
    company: null,
    name: 'Test Shop',
    neighborhood: 'Downtown',
    address: '456 Murray Ave, Pittsburgh, PA 15217',
    website: 'https://testshop.com',
    uuid: 'shop-uuid-123',
  },
  geometry: {
    type: 'Point',
    coordinates: [-79.925, 40.4363],
  },
}

describe('IssueForm', () => {
  const onSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', vi.fn())
  })

  it('renders fields prefilled with the shop’s current values', () => {
    render(<IssueForm shop={mockShop} onSuccess={onSuccess} />)

    expect(screen.getByLabelText(/name/i)).toHaveValue('Test Shop')
    expect(screen.getByLabelText(/address/i)).toHaveValue('456 Murray Ave, Pittsburgh, PA 15217')
    expect(screen.getByLabelText(/neighborhood/i)).toHaveValue('Downtown')
    expect(screen.getByLabelText(/website/i)).toHaveValue('https://testshop.com')
  })

  it('shows an error and does not submit when nothing changed', async () => {
    render(<IssueForm shop={mockShop} onSuccess={onSuccess} />)

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByText('Please change at least one field to report a correction.')).toBeInTheDocument()
    })

    expect(fetch).not.toHaveBeenCalled()
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('submits only the changed fields', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    } as Response)

    render(<IssueForm shop={mockShop} onSuccess={onSuccess} />)

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'New Name' } })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/shops/report', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ shop_id: 'shop-uuid-123', reported_name: 'New Name' }),
      }))
    })
  })

  it('calls onSuccess when the submission succeeds', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    } as Response)

    render(<IssueForm shop={mockShop} onSuccess={onSuccess} />)

    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: 'New Address' } })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled()
    })
  })

  it('shows an error message when the server rejects the submission', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Shop not found' }),
    } as Response)

    render(<IssueForm shop={mockShop} onSuccess={onSuccess} />)

    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: 'New Address' } })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByText(/something went wrong submitting your correction/i)).toBeInTheDocument()
    })

    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('shows an error message when the request throws', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

    render(<IssueForm shop={mockShop} onSuccess={onSuccess} />)

    fireEvent.change(screen.getByLabelText(/website/i), { target: { value: 'https://new.example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByText(/something went wrong submitting your correction/i)).toBeInTheDocument()
    })

    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('re-enables the submit button after a failed submission', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Shop not found' }),
    } as Response)

    render(<IssueForm shop={mockShop} onSuccess={onSuccess} />)

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'New Name' } })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^submit$/i })).not.toBeDisabled()
    })
  })
})
