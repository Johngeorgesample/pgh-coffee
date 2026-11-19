export const storageGet = (key: string) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export const storageSet = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value)
  } catch {}
}

export const storageJSON = <T,>(key: string, fallback: T) => {
  try {
    return (JSON.parse(storageGet(key) ?? 'null') ?? fallback) as T
  } catch {
    return fallback
  }
}
