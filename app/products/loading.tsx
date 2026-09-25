import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { ProductGridSkeleton } from '@/components/skeletons'

export default function Loading() {
  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-[#F8F4EE] pt-28 max-w-7xl mx-auto px-6 py-10">
        <ProductGridSkeleton count={8} />
      </div>
      <Footer />
    </main>
  )
}
