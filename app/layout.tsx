import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SkipToContent } from '@/components/layout/skip-to-content'
import { Nav } from '@/components/layout/nav'
import { Footer } from '@/components/layout/footer'
import { ConsentBanner } from '@/components/consent-banner'
import { ConditionalLayout } from '@/components/layout/conditional-layout'
import { generateBaseMetadata, generateOrganizationJsonLd } from '@/lib/seo/metadata'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = generateBaseMetadata()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationJsonLd()),
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <SkipToContent />
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        <ConsentBanner />
        <Analytics />
      </body>
    </html>
  )
}
