import PlausibleProvider from 'next-plausible'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PGH Coffee',
  description: 'Coffee shops in the steel city',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <PlausibleProvider domain="pgh.coffee" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
