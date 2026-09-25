import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { CategoryHeroSkeleton, ProductGridSkeleton } from '@/components/skeletons'

export default function Loading() {
  return (
    <main className="bg-[#F8F4EE]">
      <Navbar />
      <CategoryHeroSkeleton />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <ProductGridSkeleton count={8} />
      </div>
      <Footer />
    </main>
  )
}
