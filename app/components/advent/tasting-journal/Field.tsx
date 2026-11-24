import { ReactNode } from 'react'

export const Label = ({ children }: { children: ReactNode }) => (
  <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-900">{children}</h3>
)

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col gap-3 border-t-2 border-gray-950 pt-5">
    <Label>{label}</Label>
    {children}
  </div>
)

export default Field
