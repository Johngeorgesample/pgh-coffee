import type { Faro } from '@grafana/faro-web-sdk'

let instance: Faro | null = null

export function setFaro(faro: Faro) {
  instance = faro
}

export function getFaro(): Faro | null {
  return instance
}
