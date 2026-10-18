'use client'

import { Building2, Flame } from 'lucide-react'
import EntityRow from '@/app/components/EntityRow'
import EntitySection from '@/app/components/EntitySection'
import type { TSearchEntities } from '@/hooks/useMatchedEntities'

export default function EntitySearchResults({ roasters, companies }: TSearchEntities) {
  return (
    <>
      {roasters.length > 0 && (
        <EntitySection title="Roasters">
          {roasters.map(r => (
            <EntityRow key={r.slug} entity={r} href={`/roasters/${r.slug}`} icon={<Flame className="h-4 w-4" />} />
          ))}
        </EntitySection>
      )}
      {companies.length > 0 && (
        <EntitySection title="Companies">
          {companies.map(c => (
            <EntityRow key={c.slug} entity={c} href={`/companies/${c.slug}`} icon={<Building2 className="h-4 w-4" />} />
          ))}
        </EntitySection>
      )}
    </>
  )
}
