import { ORDERS, Order } from '@/data/advent-orders'

type Props = { order: Order; onChange: (order: Order) => void }

export default function OrderPicker({ order, onChange }: Props) {
  return (
    <div>
      <h2 className="font-serif text-3xl tracking-tight text-gray-950">{order.label} order</h2>
      <fieldset className="mt-4 inline-flex overflow-hidden rounded-xl border-2 border-gray-950 bg-white text-sm shadow-[3px_3px_0_#030712]">
        <legend className="sr-only">Order</legend>
        {ORDERS.map(o => {
          const active = o.id === order.id
          return (
            <button
              key={o.id}
              aria-pressed={active}
              onClick={() => onChange(o)}
              className={`border-gray-950 px-4 py-2 font-semibold transition-colors duration-150 ease-out not-last:border-r-2 ${
                active ? 'bg-yellow-300 text-gray-950' : 'text-gray-600 hover:bg-yellow-50 hover:text-gray-950'
              }`}
            >
              {o.label}
            </button>
          )
        })}
      </fieldset>
      <p key={order.id} className="mt-3 max-w-xl animate-rise text-sm leading-relaxed text-gray-700 motion-reduce:animate-none">
        {order.blurb}
      </p>
    </div>
  )
}
