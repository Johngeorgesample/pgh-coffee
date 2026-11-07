import { expect } from 'vitest'

const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47]

// ImageResponse streams; a layout satori can't render still returns a 200
// whose stream throws on read, so the body has to be consumed to catch that.
const renderedBytes = async (response: Response) => new Uint8Array(await response.arrayBuffer())

export const expectPng = async (response: Response) => {
  const bytes = await renderedBytes(response)
  expect(Array.from(bytes.slice(0, 4))).toEqual(PNG_MAGIC)
}
