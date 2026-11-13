import { Flag } from 'lucide-react'

interface ReportIssueButtonProps {
  onClick: () => void
}

export default function ReportIssueButton({ onClick }: ReportIssueButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Report an issue"
      title="Report an issue"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 transition ease-out active:scale-95"
    >
      <Flag className="size-[18px]" />
    </button>
  )
}
