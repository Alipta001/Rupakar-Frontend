'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function EmailVerificationSuccessPage() {
  return (
    <main className="min-h-screen bg-[#F8F4EE] text-[#1E1A17]">
      <Navbar />
      <section className="relative overflow-hidden bg-[#F8F4EE] py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(200,155,60,0.18),_transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(107,62,38,0.16),_transparent_18%)]" />
        <div className="relative mx-auto flex min-h-[calc(100vh-120px)] max-w-6xl flex-col items-center justify-center px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-full overflow-hidden rounded-[2rem] border border-[#D4C4B0]/65 bg-white/90 p-10 shadow-[0_30px_90px_-40px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-14"
          >
            <div className="absolute -right-16 top-10 h-36 w-36 rounded-full bg-[#C89B3C]/10 blur-3xl" />
            <div className="relative space-y-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#C89B3C]/10 text-[#C89B3C] shadow-sm">
                <CheckCircle size={40} />
              </div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#C89B3C] font-sans">Email confirmed</p>
              <h1 className="text-4xl font-[var(--font-cormorant)] tracking-[-0.04em] text-[#1E1A17] md:text-5xl">
                Your account is ready to explore
              </h1>
              <p className="mx-auto max-w-2xl text-sm leading-8 text-[#5B4B3F]">
                Your email has been verified. Return to the market to discover exclusive terracotta collections, artisan stories, and handcrafted pieces made just for you.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full bg-[#1E1A17] px-10 py-4 text-xs uppercase tracking-[0.22em] text-[#F8F4EE] transition-colors duration-300 hover:bg-[#6B3E26]"
                >
                  Continue shopping
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border border-[#D4C4B0] bg-[#F8F4EE] px-10 py-4 text-xs uppercase tracking-[0.22em] text-[#6B3E26] transition-colors duration-300 hover:border-[#C89B3C] hover:text-[#C89B3C]"
                >
                  Sign in again
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
