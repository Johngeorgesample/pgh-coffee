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

const submit = () => fireEvent.click(screen.getByRole('button', { name: /submit/i }))
const choose = (label: RegExp) => fireEvent.click(screen.getByLabelText(label))

describe('IssueForm', () => {
  const onSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', vi.fn())
  })

  const mockResponse = (ok: boolean) =>
    vi.mocked(fetch).mockResolvedValueOnce({ ok, json: () => Promise.resolve({}) } as Response)

  it('reveals the website input only for a website report', () => {
    render(<IssueForm shop={mockShop} onSuccess={onSuccess} />)

    expect(screen.queryByLabelText(/^website$/i)).not.toBeInTheDocument()

    choose(/the website is wrong/i)

    expect(screen.getByLabelText(/^website$/i)).toHaveValue('https://testshop.com')
  })

  it('reveals no input at all for a permanently-closed report', () => {
    render(<IssueForm shop={mockShop} onSuccess={onSuccess} />)

    choose(/permanently closed/i)

    expect(screen.queryByLabelText(/details/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/^website$/i)).not.toBeInTheDocument()
  })

  it('submits an hours report with its details', async () => {
    mockResponse(true)
    render(<IssueForm shop={mockShop} onSuccess={onSuccess} />)

    fireEvent.change(screen.getByLabelText(/details/i), { target: { value: 'Closes at 3pm Sundays' } })
    submit()

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/shops/report', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          shop_id: 'shop-uuid-123',
          report_type: 'hours',
          details: 'Closes at 3pm Sundays',
          reported_website: null,
        }),
      }))
    })
    expect(onSuccess).toHaveBeenCalled()
  })

  it('submits a closed report with no free text', async () => {
    mockResponse(true)
    render(<IssueForm shop={mockShop} onSuccess={onSuccess} />)

    choose(/permanently closed/i)
    submit()

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/shops/report', expect.objectContaining({
        body: JSON.stringify({
          shop_id: 'shop-uuid-123',
          report_type: 'closed',
          details: null,
          reported_website: null,
        }),
      }))
    })
  })

  it('blocks submission when a report that needs details has none', async () => {
    render(<IssueForm shop={mockShop} onSuccess={onSuccess} />)

    fireEvent.change(screen.getByLabelText(/details/i), { target: { value: '   ' } })
    submit()

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Please tell us what to fix.')
    })
    expect(fetch).not.toHaveBeenCalled()
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('shows an error and re-enables submit when the server rejects it', async () => {
    mockResponse(false)
    render(<IssueForm shop={mockShop} onSuccess={onSuccess} />)

    choose(/permanently closed/i)
    submit()

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/something went wrong/i)
    })
    expect(onSuccess).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: /^submit$/i })).not.toBeDisabled()
  })

  it('shows an error when the request throws', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))
    render(<IssueForm shop={mockShop} onSuccess={onSuccess} />)

    choose(/permanently closed/i)
    submit()

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/something went wrong/i)
    })
    expect(onSuccess).not.toHaveBeenCalled()
  })
})
