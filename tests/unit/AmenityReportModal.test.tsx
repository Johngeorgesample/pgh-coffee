import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AmenityReportModal from '@/app/components/AmenityReportModal'

describe('AmenityReportModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSuccess: vi.fn(),
    amenities: ['free_wifi'],
    shopId: 'shop-uuid-123',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', vi.fn())
  })

  it('does not render when isOpen is false', () => {
    render(<AmenityReportModal {...defaultProps} isOpen={false} />)
    expect(screen.queryByText("What's here?")).not.toBeInTheDocument()
  })

  it('renders the modal with amenity checkboxes', () => {
    render(<AmenityReportModal {...defaultProps} />)
    expect(screen.getByText("What's here?")).toBeInTheDocument()
    expect(screen.getAllByRole('checkbox').length).toBeGreaterThan(0)
  })

  it('pre-checks amenities already associated with the shop', () => {
    render(<AmenityReportModal {...defaultProps} />)
    expect(screen.getAllByRole('checkbox')[0]).toHaveAttribute('aria-checked', 'true')
  })

  it('submits the currently selected amenities and calls onSuccess/onClose', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true } as Response)

    render(<AmenityReportModal {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /^submit$/i }))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/shops/report-amenities', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ shop_id: 'shop-uuid-123', amenities: ['free_wifi'] }),
      }))
    })

    await waitFor(() => {
      expect(defaultProps.onSuccess).toHaveBeenCalled()
      expect(defaultProps.onClose).toHaveBeenCalled()
    })
  })

  it('shows an error message and does not close when the request fails', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false } as Response)

    render(<AmenityReportModal {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /^submit$/i }))

    await waitFor(() => {
      expect(screen.getByText(/something went wrong submitting your update/i)).toBeInTheDocument()
    })

    expect(defaultProps.onSuccess).not.toHaveBeenCalled()
    expect(defaultProps.onClose).not.toHaveBeenCalled()
  })

  it('shows an error message when the request throws', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

    render(<AmenityReportModal {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /^submit$/i }))

    await waitFor(() => {
      expect(screen.getByText(/something went wrong submitting your update/i)).toBeInTheDocument()
    })
  })

  it('re-enables the submit button after a failed submission', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false } as Response)

    render(<AmenityReportModal {...defaultProps} />)
    const button = screen.getByRole('button', { name: /^submit$/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(button).not.toBeDisabled()
    })
  })
})
