import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { CartSkeleton } from '@/components/skeletons'

export default function Loading() {
  return (
    <main>
      <Navbar />
      <section className="min-h-screen bg-[#F8F4EE] pt-32">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <CartSkeleton />
        </div>
      </section>
      <Footer />
    </main>
  )
}
