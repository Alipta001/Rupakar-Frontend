import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function NotFound() {
  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-[#F8F4EE] flex items-center justify-center px-6">
        <div className="text-center">
          <div
            className="text-[#C89B3C]/20 leading-none mb-4 select-none"
            style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(8rem, 20vw, 16rem)', fontWeight: 300 }}
            aria-hidden="true"
          >
            404
          </div>
          <div className="ornament-divider mb-5">
            <span className="text-[#C89B3C] font-sans text-[10px] tracking-[0.3em] uppercase">Lost</span>
          </div>
          <h1
            className="text-[#1E1A17] mb-4"
            style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '2.5rem', fontWeight: 300 }}
          >
            This page has wandered off
          </h1>
          <p className="text-[#5B4B3F] font-sans text-sm mb-10 max-w-sm mx-auto" style={{ letterSpacing: '0.04em' }}>
            Like an artisan&apos;s unfinished clay — this page is still taking shape.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#6B3E26] text-[#F8F4EE] px-8 py-4 font-sans text-xs tracking-[0.2em] uppercase hover:bg-[#4A2C1A] transition-colors duration-300"
          >
            Return Home
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  )
}
