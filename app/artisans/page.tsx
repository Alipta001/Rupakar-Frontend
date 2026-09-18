import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ArtisansShowcase from '@/components/artisans-showcase'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Artisans — Rupakar',
  description: 'Meet the master craftspeople behind every Rupakar piece — their stories, traditions, and the living heritage they carry.',
}

export default function ArtisansPage() {
  return (
    <main>
      <Navbar />
      <ArtisansShowcase />
      <Footer />
    </main>
  )
}
