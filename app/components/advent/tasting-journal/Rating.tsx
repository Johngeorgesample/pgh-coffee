'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { Label } from './Field'

const Rating = ({ value, onChange }: { value: number; onChange: (n: number) => void }) => {
  const [tap, setTap] = useState({ star: 0, count: 0 })
  const rate = (n: number) => {
    setTap(prev => ({ star: n, count: prev.count + 1 }))
    onChange(n)
  }
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <Label>Your rating</Label>
        <p className="mt-1 font-serif text-3xl tracking-tight text-gray-950">
          {value || '—'}
          <span className="text-lg text-gray-500"> / 5</span>
        </p>
      </div>
      <div className="flex">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => rate(n)}
            aria-label={`${n} out of 5`}
            aria-pressed={n === value}
            className="p-2 transition-transform duration-150 ease-out active:scale-90"
          >
            <Star
              key={n === tap.star ? tap.count : 0}
              strokeWidth={2.5}
              className={`size-7 text-gray-950 ${n <= value ? 'fill-yellow-300' : 'fill-white'} ${
                n === tap.star ? 'animate-pop motion-reduce:animate-none' : ''
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default Rating
