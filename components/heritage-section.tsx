'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

const pillars = [
  {
    number: '01',
    title: 'Ancient Techniques',
    description: 'Methods unchanged for millennia — kiln firing, natural dyes, hand-coiling — preserved through generations of master craftspeople.',
  },
  {
    number: '02',
    title: 'Artisan Empowerment',
    description: 'We work directly with village artisans, ensuring fair compensation and preserving traditional livelihoods that sustain entire communities.',
  },
  {
    number: '03',
    title: 'Material Purity',
    description: 'No synthetic materials. Every piece is created from locally sourced natural materials — clay, natural pigments, and organic fibers.',
  },
  {
    number: '04',
    title: 'Heritage Documentation',
    description: 'Each product comes with a certificate of authenticity, the artisan\'s name, and the documented history of the craft tradition.',
  },
]

export default function HeritageSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const yImg = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  return (
    <section ref={sectionRef} className="py-28 bg-[#F8F4EE] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Top headline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="text-center mb-20"
        >
          <div className="ornament-divider mb-5">
            <span className="text-[#C89B3C] font-sans text-[10px] tracking-[0.3em] uppercase">
              Our Philosophy
            </span>
          </div>
          <h2
            className="text-[#1E1A17] leading-tight max-w-3xl mx-auto"
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 300,
              lineHeight: 1.1,
            }}
          >
            Heritage is Not the Past.<br />
            <em className="text-[#6B3E26]" style={{ fontStyle: 'italic' }}>It is the Living Present.</em>
          </h2>
        </motion.div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image with parallax */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
            className="relative"
          >
            <motion.div style={{ y: yImg }} className="relative h-[500px] lg:h-[600px] overflow-hidden">
              <Image
                src="/images/heritage-craft.jpg"
                alt="Heritage Indian craft workshop"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E1A17]/30 to-transparent" />
            </motion.div>

            {/* Overlaid quote box */}
            <div className="absolute -bottom-6 -right-6 bg-[#6B3E26] p-8 max-w-xs hidden md:block">
              <p
                className="text-[#F8F4EE] leading-relaxed"
                style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.2rem', fontStyle: 'italic' }}
              >
                &quot;Every purchase from Rupakar is an act of cultural preservation.&quot;
              </p>
              <div className="w-8 h-px bg-[#C89B3C] mt-4" />
              <span className="text-[#C89B3C] font-sans text-[9px] tracking-[0.2em] uppercase mt-2 block">
                Rupakar Manifesto
              </span>
            </div>
          </motion.div>

          {/* Pillars */}
          <div className="space-y-8 lg:pt-4">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.number}
                initial={{ opacity: 0, x: 40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                className="group flex gap-6 p-6 border border-[#D4C4B0] hover:border-[#C89B3C] transition-colors duration-400"
              >
                <div
                  className="text-[#C89B3C] opacity-40 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0 leading-none"
                  style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '3rem', fontWeight: 300 }}
                >
                  {pillar.number}
                </div>
                <div>
                  <h3
                    className="text-[#1E1A17] mb-2"
                    style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.3rem', fontWeight: 500 }}
                  >
                    {pillar.title}
                  </h3>
                  <p className="text-[#5B4B3F] font-sans text-xs leading-relaxed" style={{ letterSpacing: '0.03em' }}>
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
