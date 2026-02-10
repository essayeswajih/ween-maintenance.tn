import React from "react"
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/context/auth-context'
import { DevisProvider } from '@/context/devis-context'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { CartProvider } from '@/context/cart-context'

const _geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://ween-maintenance.tn'),
  title: {
    default: 'Ween Maintenance | Services & Produits de Maintenance en Tunisie',
    template: '%s | Ween-Maintenance.tn'
  },
  alternates: {
    canonical: 'https://ween-maintenance.tn/',
  },
  description: 'Ween Maintenance propose en Tunisie des services professionnels de plomberie, électricité, chauffage et chaudière, ainsi que la vente de produits de maintenance.',
  keywords: [
    'maintenance Tunisie',
    'maintenance industrielle',
    'maintenance plomberie',
    'maintenance électricité',
    'maintenance chauffage',
    'chaudière Tunisie',
    'produits de maintenance',
    'services de maintenance',
    'service climatisation'
  ],
  icons: {
    icon: [
      {
        url: '/WEEN-maintenance.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/WEEN-maintenance.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.png',
        type: 'image/png',
      },
    ],
    apple: '/apple-icon.png',
  },
  generator: 'softhub.tn',
  applicationName: 'Ween Maintenance',
  authors: [{ name: 'Ween Maintenance Team' }],
  creator: 'Ween Maintenance',
  publisher: 'Ween Maintenance',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_TN',
    url: 'https://ween-maintenance.tn',
    siteName: 'Ween Maintenance',
    title: 'Ween Maintenance | Services & Produits de Maintenance en Tunisie',
    description: 'Ween Maintenance propose à Tunis des services de plomberie, électricité, chaudière et la vente de produits de maintenance pour particuliers et professionnels.',
    images: [
      {
        url: '/WEEN-maintenance.png',
        width: 1200,
        height: 630,
        alt: 'Ween Maintenance Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ween Maintenance | Services & Produits de Maintenance en Tunisie',
    description: 'Ween Maintenance propose à Tunis des services de plomberie, électricité, chaudière et la vente de produits de maintenance pour particuliers et professionnels.',
    images: ['/WEEN-maintenance.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script />
      </head>
      <body className={`${_geist.className} antialiased`}>
        <AuthProvider>
          <DevisProvider>
            <CartProvider>
              <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
                <div className="flex flex-col min-h-screen bg-background text-foreground">
                  <Navigation />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
              </ThemeProvider>
            </CartProvider>
          </DevisProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
