export const EASE = 'ease-[cubic-bezier(0.23,1,0.32,1)]'

export const PRESS = `transition-transform duration-150 ${EASE} active:scale-[0.97] motion-reduce:transition-none`

export const pad = (n: number) => String(n).padStart(2, '0')
