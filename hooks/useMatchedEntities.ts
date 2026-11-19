import { useEffect, useState } from 'react'
import { doesShopMatchFilter } from '@/app/utils/utils'

export interface TSearchEntity {
  name: string
  slug: string
}

export interface TSearchEntities {
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
