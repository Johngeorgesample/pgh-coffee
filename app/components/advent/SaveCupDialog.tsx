'use client'

import Image from 'next/image'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { X } from 'lucide-react'
import AuthForm from '@/app/components/AuthForm'

type Props = { open: boolean; onClose: () => void; onSaved: () => void; day: number; returnTo: string }

const Mark = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-[linear-gradient(transparent_55%,#fde047_55%)] px-0.5">{children}</span>
)

export default function SaveCupDialog({ open, onClose, onSaved, day, returnTo }: Props) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop transition className="fixed inset-0 bg-gray-950/40 transition-opacity duration-200 ease-out data-closed:opacity-0" />
      <div className="fixed inset-0 flex items-end justify-center sm:items-center sm:p-4">
        <DialogPanel
          transition
          className="max-h-full w-full max-w-lg overflow-y-auto rounded-t-2xl border-4 border-b-0 border-gray-950 bg-white p-5 pb-8 shadow-[6px_6px_0_#030712] transition duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] data-closed:opacity-0 motion-safe:data-closed:translate-y-6 sm:rounded-2xl sm:border-b-4 sm:p-7 sm:motion-safe:data-closed:scale-[0.98]"
        >
          <div className="flex items-center gap-4">
            <span className="block size-14 shrink-0 overflow-hidden rounded-full border-4 border-gray-950">
              <Image src={`/advent/labels/${day}.webp`} alt="" width={112} height={112} className="size-full" />
            </span>
            <DialogTitle className="flex-1 font-serif text-2xl leading-tight tracking-tight text-gray-950">Save your cup.</DialogTitle>
            <button type="button" onClick={onClose} aria-label="Close" className="-m-2 self-start rounded-lg p-2 text-gray-950 hover:bg-gray-100">
              <X className="size-5" strokeWidth={2.5} />
            </button>
          </div>
          <p className="mt-4 mb-6 font-serif text-xl leading-snug text-gray-950 text-pretty">
            Your account also keeps your <Mark>favorite shops</Mark>, the <Mark>cafés you’ve visited</Mark>, and a <Mark>coffee passport</Mark> you
            can share.
          </p>
          <AuthForm onSuccess={onSaved} next={returnTo} initialMode="signup" idPrefix="save-cup" />
        </DialogPanel>
      </div>
    </Dialog>
  )
}
