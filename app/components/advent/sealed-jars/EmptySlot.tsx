export default function EmptySlot({ className = '' }: { className?: string }) {
  return (
    <span
      className={`block aspect-square w-full rounded-full border-2 border-dashed border-gray-950/30 ${className}`}
    />
  )
}
