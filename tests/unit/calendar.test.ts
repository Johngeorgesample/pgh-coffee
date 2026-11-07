import { describe, expect, it } from 'vitest'
import { buildICS } from '@/app/utils/calendar'

describe('buildICS', () => {
  it('leaves no bare carriage returns inside a multi-line description', () => {
    const ics = buildICS({
      id: 'abc',
      title: 'Cupping',
      event_date: '2026-11-21',
      description: 'CRLF line\r\nCR line\rLF line\nend',
    })

    const description = ics.split('\r\n').find(line => line.startsWith('DESCRIPTION:'))
    expect(description).toBe('DESCRIPTION:CRLF line\\nCR line\\nLF line\\nend')
  })
})
