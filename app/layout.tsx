import PlausibleProvider from 'next-plausible'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/app/components/Nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PGH Coffee',
  description: 'Coffee shops in Pittsburgh, PA',
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
