import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { CheckoutSkeleton } from '@/components/skeletons'

export default function Loading() {
  return (
    <main>
      <Navbar />
      <section className="min-h-screen bg-[#F8F4EE] pt-28">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <CheckoutSkeleton />
        </div>
      </section>
      <Footer />
    </main>
  )
}
