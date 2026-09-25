import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { ProductDetailSkeleton } from '@/components/skeletons'

export default function Loading() {
  return (
    <main>
      <Navbar />
      <ProductDetailSkeleton />
      <Footer />
    </main>
  )
}
