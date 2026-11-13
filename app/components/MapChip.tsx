interface MapChipProps {
  on: boolean
  onClick: () => void
  children: React.ReactNode
}

export default function MapChip({ on, onClick, children }: MapChipProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium shadow-lg transition ease-out active:scale-95 ${
        on ? 'bg-yellow-300 text-stone-900' : 'bg-white text-stone-800 hover:bg-stone-50'
      }`}
    >
      {children}
    </button>
  )
}
