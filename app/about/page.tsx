'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <section className="bg-[#F8F4EE] pt-32">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className="text-[#1E1A17] mb-6"
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: '3rem',
                fontWeight: 300,
              }}
            >
              About Rupakar
            </h1>

            <div className="prose max-w-none space-y-8 text-[#5B4B3F] font-sans text-sm leading-relaxed">
              <p>
                Rupakar is a luxury marketplace dedicated to celebrating India&apos;s finest handcrafted heritage. We believe
                that every piece tells a story — of ancient traditions, skilled artisans, and the soul of India.
              </p>

              <h2
                className="text-[#1E1A17] text-xl mt-8 mb-4"
                style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.8rem' }}
              >
                Our Mission
              </h2>
              <p>
                To preserve and celebrate India&apos;s rich craft heritage while directly supporting artisan communities. Every
                purchase through Rupakar goes directly to the craftspeople who create these masterpieces.
              </p>

              <h2
                className="text-[#1E1A17] text-xl mt-8 mb-4"
                style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.8rem' }}
              >
                Our Story
              </h2>
              <p>
                Founded in 2020, Rupakar connects discerning collectors with master artisans from across India. We work
                directly with 500+ artisan families, ensuring fair wages and preserving 18+ traditional craft forms.
              </p>

              <h2
                className="text-[#1E1A17] text-xl mt-8 mb-4"
                style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.8rem' }}
              >
                Our Values
              </h2>
              <ul className="space-y-3">
                <li>• <strong>Authenticity:</strong> Every piece is handcrafted by master artisans</li>
                <li>• <strong>Fairness:</strong> Direct partnerships ensuring artisans are fairly compensated</li>
                <li>• <strong>Sustainability:</strong> Traditional methods using natural, sustainable materials</li>
                <li>• <strong>Heritage:</strong> Preserving ancient craft traditions for future generations</li>
              </ul>

              <div className="mt-12 pt-12 border-t border-[#D4C4B0]">
                <Link href="/artisans" className="text-[#C89B3C] hover:underline font-semibold">
                  Meet our master artisans →
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
