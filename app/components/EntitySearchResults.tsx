'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { Building2, Flame } from 'lucide-react'
import { doesShopMatchFilter } from '@/app/utils/utils'

export interface TSearchEntity {
  name: string
  slug: string
}

interface TSearchEntities {
  roasters: TSearchEntity[]
  companies: TSearchEntity[]
}

const EMPTY: TSearchEntities = { roasters: [], companies: [] }

function useSearchEntities() {
  const [entities, setEntities] = useState(EMPTY)

  useEffect(() => {
    fetch('/api/search-entities')
      .then(res => (res.ok ? res.json() : EMPTY))
      .then(setEntities)
      .catch(() => setEntities(EMPTY))
  }, [])

  return entities
}

export function matchEntities(entities: TSearchEntity[], searchValue: string) {
  return entities.filter(entity => doesShopMatchFilter(entity.name, '', searchValue))
}

export function useMatchedEntities(searchValue: string) {
  const { roasters, companies } = useSearchEntities()
  return { roasters: matchEntities(roasters, searchValue), companies: matchEntities(companies, searchValue) }
}

function EntityRow({ entity, href, icon }: { entity: TSearchEntity; href: string; icon: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-3 transition-colors hover:border-stone-300 hover:bg-stone-50 active:bg-stone-100"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-300 text-gray-950">
          {icon}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900">{entity.name}</span>
        <ChevronRightIcon className="h-4 w-4 shrink-0 text-gray-400 transition-colors group-hover:text-gray-600" />
      </Link>
    </li>
  )
}

function EntitySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">{title}</h2>
      <ul className="flex flex-col gap-2">{children}</ul>
    </section>
  )
}

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
