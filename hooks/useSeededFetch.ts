import { useEffect, useState } from 'react'

const seeds = new Map<string, unknown>()

export const seedPanel = (key: string, data: unknown) => {
  seeds.set(key, data)
}

const fetchJson = (url: string) => fetch(url).then(res => (res.ok ? res.json() : null))

export function useSeededFetch<T>(seedKey: string, url: string) {
  const [state, setState] = useState(() => {
    const seeded = seeds.get(seedKey) as T | undefined
    return { data: seeded ?? null, loading: !seeded }
  })

  useEffect(() => {
    const seeded = seeds.get(seedKey) as T | undefined
    if (seeded) return setState({ data: seeded, loading: false })

    let live = true
    setState({ data: null, loading: true })
    fetchJson(url)
      .catch(() => null)
      .then(data => live && setState({ data, loading: false }))
    return () => {
      live = false
    }
  }, [seedKey, url])

  return state
}
