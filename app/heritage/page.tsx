'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function HeritgePage() {
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
              className="text-[#1E1A17] mb-12 text-center"
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: '3rem',
                fontWeight: 300,
              }}
            >
              India&apos;s Craft Heritage
            </h1>

            <div className="prose max-w-none space-y-12 text-[#5B4B3F] font-sans text-sm leading-relaxed">
              <div className="relative h-96 mb-8 -mx-6">
                <Image
                  src="/images/heritage-craft.jpg"
                  alt="Traditional Indian craft workshop"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1A17]/30 to-transparent" />
              </div>

              <div>
                <h2
                  className="text-[#1E1A17] text-2xl mb-4"
                  style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.8rem' }}
                >
                  A Living Tradition
                </h2>
                <p>
                  India&apos;s craft heritage spans thousands of years, with techniques passed down through generations. From
                  the clay pots of Khurja to the painted walls of Madhubani, each tradition tells a story of cultural pride
                  and artistic excellence.
                </p>
              </div>

              <div>
                <h2
                  className="text-[#1E1A17] text-2xl mb-4"
                  style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.8rem' }}
                >
                  Preserving the Past
                </h2>
                <p>
                  Today, many traditional crafts face extinction due to industrialization and changing markets. At Rupakar,
                  we believe these ancient arts deserve to be celebrated and preserved. By supporting artisan communities, we
                  ensure these traditions survive for future generations.
                </p>
              </div>

              <div>
                <h2
                  className="text-[#1E1A17] text-2xl mb-4"
                  style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.8rem' }}
                >
                  Craft Traditions We Celebrate
                </h2>
                <ul className="space-y-3">
                  <li>• <strong>Madhubani Painting:</strong> Bihar folk art depicting mythological scenes</li>
                  <li>• <strong>Terracotta Pottery:</strong> Hand-thrown clay vessels from across India</li>
                  <li>• <strong>Pattachitra:</strong> Odisha&apos;s classical narrative scroll paintings</li>
                  <li>• <strong>Warli Art:</strong> Tribal geometric patterns from Maharashtra</li>
                  <li>• <strong>Handwoven Textiles:</strong> Traditional weaving from Rajasthan and Bengal</li>
                  <li>• <strong>Brass Craftsmanship:</strong> Metal work from Rajasthan and Madhya Pradesh</li>
                </ul>
              </div>

              <div className="bg-[#EFE3D3] p-8 rounded border border-[#D4C4B0]">
                <h3
                  className="text-[#1E1A17] mb-4"
                  style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.3rem' }}
                >
                  Every Purchase Makes a Difference
                </h3>
                <p>
                  When you buy from Rupakar, you&apos;re not just acquiring a beautiful handcrafted piece. You&apos;re directly
                  supporting artisan families, preserving ancient techniques, and ensuring these traditions thrive for generations
                  to come.
                </p>
              </div>

              <div className="text-center pt-8">
                <Link href="/collections" className="text-[#C89B3C] hover:underline font-semibold">
                  Explore our collections →
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
