import PlausibleProvider from 'next-plausible'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/app/components/Nav'
import { FaroInit } from '@/app/components/FaroInit'
import { ServiceWorkerRegister } from '@/app/components/ServiceWorkerRegister'
import { AuthProvider } from '@/app/components/AuthProvider'
import { SITE_URL, buildOrganizationJsonLd, buildWebsiteJsonLd, jsonLdToString } from '@/app/utils/seo'

const inter = Inter({ subsets: ['latin'] })

const organizationJsonLd = buildOrganizationJsonLd()
const websiteJsonLd = buildWebsiteJsonLd()

const siteDescription =
  "A guide to independent coffee in Pittsburgh, PA. Explore shops across the city's neighborhoods and track your visits with a coffee passport."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'pgh.coffee',
  description: siteDescription,
  // No images here: app/opengraph-image.tsx provides the site-default og:image
  // for routes that don't define their own openGraph. It does NOT survive a
  // child route's openGraph object (that replaces the parent's wholesale, images
  // included) — which is why segments defining openGraph either set an image or
  // re-export the default via their own opengraph-image.tsx.
  openGraph: {
    siteName: 'pgh.coffee',
    title: 'pgh.coffee',
    description: siteDescription,
  },
  // Card type only: title/description/image intentionally unset so X falls back
  // to the og:* tags, letting per-route openGraph (and file-based opengraph-image)
  // drive Twitter cards instead of this layout's static values leaking everywhere.
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  themeColor: '#FDE047',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="overscroll-none">
      <head>
        <PlausibleProvider domain="pgh.coffee" trackOutboundLinks />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdToString(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdToString(websiteJsonLd) }} />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <FaroInit />
          <ServiceWorkerRegister />
          <Nav />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
