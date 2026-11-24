import { PRESS } from '@/app/components/advent/ui'
import { ORDERS, Order } from '@/data/advent-orders'

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

type TOrderPickerProps = {
  late: boolean
  pick: Order
  setPick: (order: Order) => void
  onCancel: () => void
  onConfirm: () => void
}

const OrderPicker = ({ late, pick, setPick, onCancel, onConfirm }: TOrderPickerProps) => (
  <div className="w-[min(26rem,calc(100vw-2rem))] p-5">
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-950">
      <span className="bg-yellow-300 px-1">Before your first jar</span>
    </p>
    <h2 className="mt-2 font-serif text-2xl leading-tight tracking-tight text-gray-950">
      Which order are you drinking in?
    </h2>
    <p className="mt-1.5 text-sm leading-snug text-gray-700">
      Pick an order and we&rsquo;ll point you to today&rsquo;s jar. It&rsquo;s locked in after that, so you never land
      on a jar you&rsquo;ve already opened.
    </p>
    {late && (
      <p className="mt-2 text-sm leading-snug font-semibold text-gray-950">
        Already opened some jars by number? That&rsquo;s {ORDERS[0].label}.
      </p>
    )}
    <fieldset className="mt-4 grid gap-2">
      <legend className="sr-only">Order</legend>
      {ORDERS.map(order => (
        <Row key={order.id} order={order} checked={order === pick} onPick={() => setPick(order)} />
      ))}
    </fieldset>
    <div className="mt-4 grid grid-cols-2 gap-2">
      <button
        onClick={onCancel}
        className={`rounded-xl border-2 border-gray-950 bg-white py-2 text-sm font-bold text-gray-950 ${PRESS}`}
      >
        Not yet
      </button>
      <button
        onClick={onConfirm}
        className={`rounded-xl border-2 border-gray-950 bg-gray-950 py-2 text-sm font-bold text-white ${PRESS}`}
      >
        Start {pick.label}
      </button>
    </div>
  </div>
)

export default OrderPicker
