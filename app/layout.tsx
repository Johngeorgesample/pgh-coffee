import PlausibleProvider from 'next-plausible'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/app/components/Nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PGH Coffee',
  description: 'Coffee shops in Pittsburgh, PA',
  openGraph: {
    title: 'pgh.coffee',
    description: 'A guide to coffee in Pittsburgh, PA',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'A guide to coffee in Pittsburgh, PA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image', // You can also use 'summary' for smaller images
    title: 'Your Twitter Title',
    description: 'Your Twitter Description',
    images: ['/twitter-image.png'], // Path to the Twitter image
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <html lang="en">
        <head>
          <PlausibleProvider domain="pgh.coffee" trackOutboundLinks />
        </head>
        <body className={inter.className}>
          <Nav />
          <main>{children}</main>
        </body>
      </html>
    </>
  )
}
