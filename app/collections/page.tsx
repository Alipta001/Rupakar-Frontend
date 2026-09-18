import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import CollectionsGrid from '@/components/collections-grid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Collections — Rupakar',
  description: 'Explore our curated collections of handcrafted Indian terracotta, folk art, and ethnic decor.',
}

export default function CollectionsPage() {
  return (
    <main>
      <Navbar />
      <CollectionsGrid />
      <Footer />
    </main>
  )
}
