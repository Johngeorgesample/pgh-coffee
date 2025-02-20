import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'pgh.coffee',
    short_name: 'pgh.coffee',
    description: 'A guide to coffee in Pittsburgh, PA',
    start_url: '/',
    display: 'standalone',
    background_color: '#FDE047',
    theme_color: '#FDE047',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
