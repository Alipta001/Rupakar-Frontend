import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { ProductGridSkeleton } from '@/components/skeletons'

export default function Loading() {
  return (
    <main>
      <Navbar />
      <section className="min-h-screen bg-[#F8F4EE] pt-28">
        <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
          <div className="h-10 bg-[#D4C4B0]/30 rounded w-1/3 mx-auto animate-pulse" />
          <div className="h-12 bg-[#D4C4B0]/20 rounded w-full animate-pulse" />
          <ProductGridSkeleton count={8} />
        </div>
      </section>
      <Footer />
    </main>
  )
}
