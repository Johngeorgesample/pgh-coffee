import PlausibleProvider from 'next-plausible'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/app/components/Nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PGH Coffee',
  description: 'Coffee shops in Pittsburgh, PA',
  themeColor: "#ffdf20",
  openGraph: {
    title: 'pgh.coffee',
    description: 'A guide to coffee in Pittsburgh, PA',
    images: [
      {
        url: 'https://uljutxoijtvtcxvatqso.supabase.co/storage/v1/object/public/pgh-coffee-misc/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'A guide to coffee in Pittsburgh, PA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'pgh.coffee',
    description: 'A guide to coffee in Pittsburgh, PA',
    images: ['https://uljutxoijtvtcxvatqso.supabase.co/storage/v1/object/public/pgh-coffee-misc/twitter-image.png'],
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
