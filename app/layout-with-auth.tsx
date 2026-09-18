import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Playfair_Display, Inter, Italiana } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const italiana = Italiana({
  subsets: ['latin'],
  variable: '--font-italiana',
  weight: ['400'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Rupakar — Luxury Indian Handcrafted Marketplace',
  description: 'Discover India\'s finest handcrafted treasures — terracotta pottery, folk art, artisan collectibles, and ethnic decor. Each piece tells a story of ancient heritage and timeless craftsmanship.',
  keywords: ['Indian handicrafts', 'terracotta pottery', 'folk art', 'artisan marketplace', 'handmade decor', 'Indian heritage crafts'],
  authors: [{ name: 'Rupakar' }],
  openGraph: {
    title: 'Rupakar — Luxury Indian Handcrafted Marketplace',
    description: 'Discover India\'s finest handcrafted treasures — terracotta pottery, folk art, artisan collectibles, and ethnic decor.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#6B3E26',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} ${playfair.variable} ${italiana.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
