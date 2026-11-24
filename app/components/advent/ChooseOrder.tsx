'use client'

import { useRef, useState } from 'react'
import SectionHead from '@/app/components/advent/SectionHead'
import OrderPicker from '@/app/components/advent/choose-order/OrderPicker'
import SealedToday from '@/app/components/advent/choose-order/SealedToday'
import { useAnalytics } from '@/hooks'
import { ORDERS, Order } from '@/data/advent-orders'

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
    <section data-reveal className="mt-10 animate-rise motion-reduce:animate-none">
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
        <OrderPicker late={step > 1} pick={pick} setPick={setPick} onCancel={() => dialog.current?.close()} onConfirm={confirm} />
      </dialog>
    </section>
  )
}
