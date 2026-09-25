import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { ProductGridSkeleton } from '@/components/skeletons'

export default function Loading() {
  return (
    <main>
      <Navbar />
      <section className="min-h-screen bg-[#F8F4EE] pt-32">
        <div className="max-w-6xl mx-auto px-6 py-20 space-y-8">
          <div className="h-10 bg-[#D4C4B0]/30 rounded w-1/4 animate-pulse" />
          <ProductGridSkeleton count={6} />
        </div>
      </section>
      <Footer />
    </main>
  )
}
