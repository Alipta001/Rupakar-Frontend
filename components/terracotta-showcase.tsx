'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function TerracottaShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const yImg = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section ref={sectionRef} className="bg-[#3A2418] py-28 overflow-hidden relative">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #C89B3C 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative h-[560px]"
          >
            {/* Main image */}
            <motion.div
              style={{ y: yImg }}
              className="absolute left-0 top-0 w-72 h-96 overflow-hidden border border-[#C89B3C]/20"
            >
              <Image src="/images/category-pottery.jpg" alt="Terracotta pottery collection" fill className="object-cover" />
              <div className="absolute inset-0 bg-[#3A2418]/20" />
            </motion.div>

            {/* Secondary image */}
            <div className="absolute right-0 bottom-0 w-64 h-72 overflow-hidden border border-[#C89B3C]/30">
              <Image src="/images/product-bowl.jpg" alt="Handcrafted pottery bowl" fill className="object-cover" />
            </div>

            {/* Gold label */}
            <div className="absolute left-60 top-1/2 -translate-y-1/2 bg-[#C89B3C] px-4 py-6 w-24 text-center">
              <span
                className="text-[#1E1A17] leading-tight block"
                style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.1rem', fontStyle: 'italic' }}
              >
                Pure<br />Earth
              </span>
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:pl-8"
          >
            <div className="ornament-divider justify-start mb-6">
              <span className="text-[#C89B3C] font-sans text-[10px] tracking-[0.3em] uppercase">
                The Terracotta Story
              </span>
            </div>

            <h2
              className="text-[#F8F4EE] leading-tight mb-6"
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                fontWeight: 300,
                lineHeight: 1.1,
              }}
            >
              Born from the<br />
              <em className="text-[#C89B3C]" style={{ fontStyle: 'italic' }}>Sacred Earth</em><br />
              of India
            </h2>

            <p className="text-[#F8F4EE]/60 font-sans text-sm leading-relaxed mb-4" style={{ letterSpacing: '0.03em' }}>
              Terracotta — &quot;baked earth&quot; in Latin — has been shaped by Indian hands for over 5,000 years.
              Our artisans from Rajasthan, Bengal, and Madhya Pradesh keep this ancient dialogue alive,
              each vessel a meditation between clay, fire, and human spirit.
            </p>
            <p className="text-[#F8F4EE]/50 font-sans text-sm leading-relaxed mb-8" style={{ letterSpacing: '0.03em' }}>
              No two pieces are identical. The variations in surface, texture, and tone are not imperfections —
              they are the signatures of the human hand.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-10">
              {[
                '100% natural clay from sacred Indian rivers',
                'Traditional kiln-fired at exact temperatures',
                'Hand-painted with mineral-based natural pigments',
              ].map((feat) => (
                <div key={feat} className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-[#C89B3C] rounded-full mt-2 flex-shrink-0" />
                  <span className="text-[#F8F4EE]/60 font-sans text-xs leading-relaxed" style={{ letterSpacing: '0.03em' }}>
                    {feat}
                  </span>
                </div>
              ))}
            </div>

            <Link href="/collections/terracotta">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center gap-3 border border-[#C89B3C] text-[#C89B3C] hover:bg-[#C89B3C] hover:text-[#1E1A17] px-8 py-4 font-sans text-xs tracking-[0.2em] uppercase transition-all duration-400 overflow-hidden"
              >
                Explore Terracotta
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
