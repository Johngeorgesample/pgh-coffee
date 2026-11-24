'use client'

import { useLayoutEffect } from 'react'
import { ORDER_KEY } from '@/app/components/advent/AdventRoute'
import { storageGet } from '@/app/utils/storage'

const ATTRIBUTE = 'data-advent-returning'

const BEFORE_PAINT = `try{localStorage.getItem('${ORDER_KEY}')&&document.documentElement.setAttribute('${ATTRIBUTE}','')}catch(e){}`

export default function ReturningFlag() {
  useLayoutEffect(() => {
    if (storageGet(ORDER_KEY)) document.documentElement.setAttribute(ATTRIBUTE, '')
  }, [])
  return <script dangerouslySetInnerHTML={{ __html: BEFORE_PAINT }} />
}
