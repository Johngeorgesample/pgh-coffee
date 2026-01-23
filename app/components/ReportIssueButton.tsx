import { Flag } from 'lucide-react'

interface ReportIssueButtonProps {
  onClick: () => void
}

export default function ReportIssueButton({ onClick }: ReportIssueButtonProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-800 px-4 py-2.5 rounded-3xl text-sm font-medium border border-stone-200 transition-colors"
    >
      <Flag className="w-4 h-4" />
      Report
    </button>
  )
}
