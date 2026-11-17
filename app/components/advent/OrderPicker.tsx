import { ORDERS, Order } from '@/data/advent-orders'

type Props = { order: Order; onChange: (order: Order) => void }

export default function OrderPicker({ order, onChange }: Props) {
  return (
    <div>
      <h2 className="font-serif text-3xl tracking-tight text-slate-900">{order.label} order</h2>
      <fieldset className="mt-4 inline-flex rounded-full bg-stone-100 p-1 text-sm">
        <legend className="sr-only">Order</legend>
        {ORDERS.map(o => {
          const active = o.id === order.id
          return (
            <button
              key={o.id}
              aria-pressed={active}
              onClick={() => onChange(o)}
              className={`rounded-full px-3.5 py-1.5 font-medium transition-colors active:scale-[0.97] ${
                active ? 'bg-white text-slate-900 shadow-sm' : 'text-stone-500 hover:text-slate-900'
              }`}
            >
              {o.label}
            </button>
          )
        })}
      </fieldset>
      <p key={order.id} className="mt-3 max-w-xl animate-rise text-sm leading-relaxed text-stone-500 motion-reduce:animate-none">
        {order.blurb}
      </p>
    </div>
  )
}
