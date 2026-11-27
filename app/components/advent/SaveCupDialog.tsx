'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { Star, X } from 'lucide-react'
import AuthForm from '@/app/components/AuthForm'
import { pad } from './ui'

export type CupDraft = {
  rating: number
  method: string
  tastedCount: number
  hasNotes: boolean
}

type Props = {
  open: boolean
  onClose: () => void
  onSaved: () => void
  day: number
  returnTo: string
  draft?: CupDraft
}

const Mark = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-[linear-gradient(transparent_55%,#fde047_55%)] px-0.5 font-medium text-gray-950">{children}</span>
)

const draftSummary = (draft: CupDraft) => {
  const parts: string[] = []
  if (draft.method) parts.push(draft.method)
  if (draft.tastedCount > 0) parts.push(`${draft.tastedCount} ${draft.tastedCount === 1 ? 'tasting note' : 'tasting notes'}`)
  else if (draft.hasNotes) parts.push('Personal note')
  return parts.join(' · ')
}

export default function SaveCupDialog({ open, onClose, onSaved, day, returnTo, draft }: Props) {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup')
  const details = draft ? draftSummary(draft) : ''

  const handleClose = () => {
    setAuthMode('signup')
    onClose()
  }

  const handleSaved = () => {
    setAuthMode('signup')
    onSaved()
  }

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <DialogBackdrop transition className="fixed inset-0 bg-gray-950/40 transition-opacity duration-200 ease-out data-closed:opacity-0" />
      <div className="fixed inset-0 flex items-end justify-center sm:items-center sm:p-4">
        <DialogPanel
          transition
          className="max-h-full w-full max-w-lg overflow-y-auto rounded-t-2xl border-4 border-b-0 border-gray-950 bg-white p-5 pb-8 shadow-[6px_6px_0_#030712] transition duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] data-closed:opacity-0 motion-safe:data-closed:translate-y-6 sm:rounded-2xl sm:border-b-4 sm:p-7 sm:motion-safe:data-closed:scale-[0.98]"
        >
          <div className="flex items-center gap-3.5">
            <span className="block size-12 shrink-0 overflow-hidden rounded-full border-4 border-gray-950 sm:size-14">
              <Image src={`/advent/labels/${day}.webp`} alt="" width={112} height={112} className="size-full" />
            </span>
            <DialogTitle className="flex-1 font-serif text-xl leading-tight tracking-tight text-gray-950 sm:text-2xl">
              {authMode === 'signin' ? 'Welcome back.' : 'Save your cup.'}
            </DialogTitle>
            <button type="button" onClick={handleClose} aria-label="Close" className="-m-2 rounded-lg p-2 text-gray-950 hover:bg-gray-100">
              <X className="size-5" strokeWidth={2.5} />
            </button>
          </div>

          {draft && draft.rating > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border-2 border-gray-950 bg-yellow-50 px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-950">Jar #{pad(day)} draft</span>
                <span className="text-gray-400" aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-0.5" aria-label={`${draft.rating} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <Star
                      key={n}
                      strokeWidth={2.5}
                      aria-hidden="true"
                      className={`size-3.5 text-gray-950 ${n <= draft.rating ? 'fill-yellow-300' : 'fill-white'}`}
                    />
                  ))}
                </span>
              </div>
              {details && <span className="text-xs font-medium text-gray-800">{details}</span>}
            </div>
          )}

          <p className="mt-3.5 mb-5 text-sm leading-relaxed text-gray-700 text-pretty">
            Your notes stay safe while you sign in. Your free account also tracks your favorite shops and a shareable{' '}
            <Mark>coffee passport</Mark>.
          </p>

          <AuthForm
            onSuccess={handleSaved}
            next={returnTo}
            initialMode="signup"
            idPrefix="save-cup"
            variant="advent"
            collapseEmail
            googleLabel="Continue with Google & save"
            submitLabels={{ signin: 'Sign in & save cup', signup: 'Create account & save' }}
            confirmDetail={`Your Day ${day} notes are safely kept here and will save automatically once you click the link.`}
            onModeChange={setAuthMode}
          />
        </DialogPanel>
      </div>
    </Dialog>
  )
}
