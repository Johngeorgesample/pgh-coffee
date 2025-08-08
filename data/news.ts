import { NewsItem } from '@/types/news-types'

export const data: NewsItem[] = [
  {
    date: '2025-08-07',
    entries: [
      {
        type: 'site',
        title: 'Site redesign',
        description: 'It looks different',
      },
    ],
  },
  {
    date: '2025-08-06',
    entries: [
      {
        type: 'shop',
        tags: ['closure'],
        title: 'Removed Cafe 102 (permanently closed)',
      },
    ],
  },
]
