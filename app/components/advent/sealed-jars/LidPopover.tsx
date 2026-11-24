import { ReactNode } from 'react'

export type Align = 'left' | 'center' | 'right'

const POPOVER_ALIGN: Record<Align, string> = {
  left: 'left-0 origin-bottom-left',
  center: 'left-1/2 -translate-x-1/2 origin-bottom',
  right: 'right-0 origin-bottom-right',
}

const BUTTON =
  'rounded-lg border-2 border-gray-950 py-1 [@media(pointer:coarse)]:py-3 text-xs font-bold uppercase tracking-wide text-gray-950 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]'

type TActionsProps = { accept: string; onCancel: () => void; onAccept: () => void }

const Actions = ({ accept, onCancel, onAccept }: TActionsProps) => (
  <div className="mt-2 grid grid-cols-2 gap-1.5 max-[374px]:grid-cols-1">
    <button onClick={onCancel} className={`bg-white ${BUTTON}`}>
      Nevermind
    </button>
    <button autoFocus onClick={onAccept} className={`bg-yellow-300 ${BUTTON}`}>
      {accept}
    </button>
  </div>
)

export const Ask = ({ step, onCancel, onNext }: { step: number; onCancel: () => void; onNext: () => void }) => (
  <>
    <p className="text-sm font-semibold leading-snug text-gray-950">Open Dec {step} early?</p>
    <Actions accept="Open it" onCancel={onCancel} onAccept={onNext} />
  </>
)

export const Warn = ({ onCancel, onAccept }: { onCancel: () => void; onAccept: () => void }) => (
  <>
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-950">
      <span className="bg-yellow-300 px-1">Spoiler ahead</span>
    </p>
    <p className="mt-1.5 text-sm leading-snug text-gray-950">
      No take-backs: the roaster and coffee are on the next page.
    </p>
    <Actions accept="Open anyway" onCancel={onCancel} onAccept={onAccept} />
  </>
)

export default function LidPopover({ align, children }: { align: Align; children: ReactNode }) {
  return (
    <div
      className={`absolute bottom-full z-20 mb-3 w-52 animate-arm max-[374px]:w-44 rounded-xl border-2 border-gray-950 bg-white p-3 shadow-[3px_3px_0_#030712] motion-reduce:animate-none ${POPOVER_ALIGN[align]}`}
    >
      {children}
    </div>
  )
}
