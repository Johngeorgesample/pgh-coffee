'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import top from '@/public/advent/top.webp'
import SectionHead from '@/app/components/advent/SectionHead'
import { useAnalytics } from '@/hooks'
import { ORDERS, Order } from '@/data/advent-orders'

const PRESS = 'transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] motion-reduce:transition-none'

const pad = (n: number) => String(n).padStart(2, '0')

const summary = (order: Order) => `${order.blurb.split('.')[0]}.`

const Row = ({ order, checked, onPick }: { order: Order; checked: boolean; onPick: () => void }) => (
  <label
    className={`block cursor-pointer rounded-xl border-2 border-gray-950 p-3 transition-colors duration-150 ease-out has-focus-visible:outline-2 has-focus-visible:outline-offset-2 ${
      checked ? 'bg-yellow-300' : 'bg-white hover:bg-yellow-50'
    }`}
  >
    <input type="radio" name="advent-order" checked={checked} onChange={onPick} className="sr-only" />
    <span className="block font-serif text-lg leading-tight text-gray-950">{order.label}</span>
    <span className="block text-xs leading-snug text-gray-700">{summary(order)}</span>
  </label>
)

type TAskProps = { late: boolean; pick: Order; setPick: (order: Order) => void; onCancel: () => void; onConfirm: () => void }

const Ask = ({ late, pick, setPick, onCancel, onConfirm }: TAskProps) => (
  <div className="w-[min(26rem,calc(100vw-2rem))] p-5">
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-950">
      <span className="bg-yellow-300 px-1">Before your first jar</span>
    </p>
    <h2 className="mt-2 font-serif text-2xl leading-tight tracking-tight text-gray-950">Which order are you drinking in?</h2>
    <p className="mt-1.5 text-sm leading-snug text-gray-700">
      Pick an order and we&rsquo;ll point you to today&rsquo;s jar. It&rsquo;s locked in after that, so you never land on a jar
      you&rsquo;ve already opened.
    </p>
    {late && (
      <p className="mt-2 text-sm leading-snug font-semibold text-gray-950">Already opened some jars by number? That&rsquo;s {ORDERS[0].label}.</p>
    )}
    <fieldset className="mt-4 grid gap-2">
      <legend className="sr-only">Order</legend>
      {ORDERS.map(order => (
        <Row key={order.id} order={order} checked={order === pick} onPick={() => setPick(order)} />
      ))}
    </fieldset>
    <div className="mt-4 grid grid-cols-2 gap-2">
      <button onClick={onCancel} className={`rounded-xl border-2 border-gray-950 bg-white py-2 text-sm font-bold text-gray-950 ${PRESS}`}>
        Not yet
      </button>
      <button onClick={onConfirm} className={`rounded-xl border-2 border-gray-950 bg-gray-950 py-2 text-sm font-bold text-white ${PRESS}`}>
        Start {pick.label}
      </button>
    </div>
  </div>
)

const SealedToday = ({ step, onOpen }: { step: number; onOpen: () => void }) => (
  <div className="overflow-hidden rounded-2xl border-4 border-gray-950 bg-white shadow-[6px_6px_0_#030712]">
    <div className="relative border-b-4 border-gray-950">
      <Image src={top} alt="" sizes="(min-width: 1024px) 760px, 100vw" className="h-16 w-full object-cover object-left" />
      <span className="absolute bottom-0 left-5 translate-y-1/2 -rotate-2 rounded-lg border-4 border-gray-950 bg-yellow-300 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-950 shadow-[3px_3px_0_#030712]">
        Today · Day {pad(step)}
      </span>
    </div>
    <div className="flex flex-wrap items-end justify-between gap-4 p-5 pt-9">
      <h3 className="font-serif text-3xl leading-tight tracking-tight text-gray-950 text-balance">Your first jar is waiting.</h3>
      <button onClick={onOpen} className={`rounded-2xl bg-gray-950 px-5 py-3 font-semibold text-white hover:bg-gray-800 ${PRESS}`}>
        Open today&rsquo;s jar
      </button>
    </div>
  </div>
)

type TChooseOrderProps = { step: number; onChoose: (order: Order) => void }

export default function ChooseOrder({ step, onChoose }: TChooseOrderProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [pick, setPick] = useState(ORDERS[0])
  const track = useAnalytics()
  const confirm = () => {
    track('AdventOrderChosen', { props: { order: pick.id, step } })
    onChoose(pick)
  }
  return (
    <section className="mt-10 animate-rise motion-reduce:animate-none">
      <SectionHead title="Today's coffee" />
      <div className="mt-8">
        <SealedToday step={step} onOpen={() => dialog.current?.showModal()} />
      </div>
      <dialog
        ref={dialog}
        onClose={() => track('AdventOrderBackedOut', { props: { pick: pick.id, step } })}
        aria-label="Choose your order"
        className="m-auto rounded-2xl border-4 border-gray-950 bg-white shadow-[6px_6px_0_#030712] backdrop:bg-gray-950/40 open:animate-arm motion-reduce:open:animate-none"
      >
        <Ask late={step > 1} pick={pick} setPick={setPick} onCancel={() => dialog.current?.close()} onConfirm={confirm} />
      </dialog>
    </section>
  )
}
