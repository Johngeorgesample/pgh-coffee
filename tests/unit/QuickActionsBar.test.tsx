import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import QuickActionsBar from '@/app/components/QuickActionsBar'
import type { TShop } from '@/types/shop-types'

vi.mock('next-plausible', () => ({
  usePlausible: () => vi.fn(),
}))

vi.mock('@/app/components/AuthProvider', () => ({
  useAuth: () => ({ user: null, loading: false }),
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signInWithOAuth: vi.fn(),
    },
  }),
}))

const shopA: TShop = {
  type: 'shop',
  properties: {
    company: null,
    name: 'Shop A',
    neighborhood: 'Downtown',
    address: '1 First St, Pittsburgh, PA',
    website: 'https://shop-a.example',
    uuid: 'shop-a-uuid',
  },
  geometry: { type: 'Point', coordinates: [-79.9, 40.4] },
}

const shopB: TShop = {
  type: 'shop',
  properties: {
    company: null,
    name: 'Shop B',
    neighborhood: 'Lower Lawrenceville',
    address: '2 Second St, Pittsburgh, PA',
    website: 'https://shop-b.example',
    uuid: 'shop-b-uuid',
  },
  geometry: { type: 'Point', coordinates: [-79.95, 40.46] },
}

const openReportModal = () => fireEvent.click(screen.getByRole('button', { name: /report an issue/i }))
const submitEmptyReport = () => fireEvent.click(screen.getByRole('button', { name: /^submit$/i }))

describe('QuickActionsBar report modal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Regression for S11b: the modal wasn't keyed to the selected shop, so a
  // React re-render for a shop switch reused the same modal instance instead
  // of remounting it — a validation error left over from Shop A's report
  // form kept showing after the panel moved on to Shop B.
  it('does not carry a validation error over when the panel switches to a different shop', async () => {
    const { rerender } = render(<QuickActionsBar shop={shopA} />)

    openReportModal()
    submitEmptyReport() // no details entered for the default "hours" report type
    expect(await screen.findByRole('alert')).toHaveTextContent('Please tell us what to fix.')

    // The panel switching shops without the user closing the modal first —
    // e.g. selecting a different shop on the map while it's open.
    rerender(<QuickActionsBar shop={shopB} />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  // The details textarea is uncontrolled, so a reset that only cleared React
  // state (and left the same DOM node mounted) would have missed this.
  it('does not carry typed-but-unsubmitted details over when the panel switches to a different shop', () => {
    const { rerender } = render(<QuickActionsBar shop={shopA} />)

    openReportModal()
    fireEvent.change(screen.getByLabelText(/details/i), { target: { value: "Shop A's hours are wrong" } })

    // The modal is left open (not dismissed) across the switch, same as above.
    rerender(<QuickActionsBar shop={shopB} />)

    expect(screen.getByLabelText(/details/i)).toHaveValue('')
  })
})
