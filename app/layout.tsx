import PlausibleProvider from 'next-plausible'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/app/components/Nav'
import { FaroInit } from '@/app/components/FaroInit'
import { AuthProvider } from '@/app/components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
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

export const viewport: Viewport = {
  themeColor: '#FDE047',
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="overscroll-none">
      <head>
        <PlausibleProvider domain="pgh.coffee" trackOutboundLinks />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <FaroInit />
          <Nav />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
