'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

const artisans = [
  {
    name: 'Ramkumar Prajapati',
    craft: 'Terracotta Master',
    region: 'Rajasthan',
    story: 'Sixth-generation potter whose clay work has been exhibited in museums across Europe.',
    image: '/images/artisan-portrait.jpg',
  },
  {
    name: 'Savitri Devi',
    craft: 'Madhubani Painter',
    region: 'Bihar',
    story: 'Her intricate paintings narrate ancient Maithili myths passed down through women for centuries.',
    image: '/images/gallery-1.jpg',
  },
]

export default function ArtisanStory() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const yBg = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])

  return (
    <section ref={sectionRef} className="relative py-28 bg-[#F4E8D8] overflow-hidden">
      {/* Parallax background texture */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 opacity-10">
        <Image src="/images/heritage-craft.jpg" alt="" fill className="object-cover" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="ornament-divider mb-5">
            <span className="text-[#C89B3C] font-sans text-[10px] tracking-[0.3em] uppercase">
              Human Stories
            </span>
          </div>
          <h2
            className="text-[#1E1A17] leading-tight"
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 300,
            }}
          >
            Behind Every Piece,<br />
            <em className="text-[#6B3E26]" style={{ fontStyle: 'italic' }}>A Living Tradition</em>
          </h2>
        </motion.div>

        {/* Artisan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {artisans.map((artisan, i) => (
            <motion.div
              key={artisan.name}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: i * 0.2 }}
              className="group"
            >
              <div className="grid grid-cols-5 gap-0 overflow-hidden">
                <div className="col-span-2 relative aspect-[2/3] overflow-hidden">
                  <Image
                    src={artisan.image}
                    alt={artisan.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#F4E8D8]/30" />
                </div>
                <div className="col-span-3 bg-[#1E1A17] p-8 flex flex-col justify-between">
                  <div>
                    <div className="text-[#C89B3C] font-sans text-[9px] tracking-[0.25em] uppercase mb-3">
                      {artisan.region} · {artisan.craft}
                    </div>
                    <h3
                      className="text-[#F8F4EE] leading-tight mb-4"
                      style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.6rem', fontWeight: 400, fontStyle: 'italic' }}
                    >
                      {artisan.name}
                    </h3>
                    <p className="text-[#F8F4EE]/60 font-sans text-xs leading-relaxed" style={{ letterSpacing: '0.03em' }}>
                      {artisan.story}
                    </p>
                  </div>
                  <Link
                    href="/artisans"
                    className="inline-flex items-center gap-2 text-[#C89B3C] hover:text-[#F8F4EE] font-sans text-[9px] tracking-[0.2em] uppercase transition-colors duration-300 mt-6 luxury-underline"
                  >
                    Read Story
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center"
        >
          <p
            className="text-[#3A2A20] mb-6"
            style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.4rem', fontStyle: 'italic' }}
          >
            &quot;We are not just selling crafts. We are archiving humanity.&quot;
          </p>
          <Link href="/artisans">
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="inline-flex items-center gap-3 bg-[#6B3E26] text-[#F8F4EE] px-8 py-4 font-sans text-xs tracking-[0.2em] uppercase hover:bg-[#4A2C1A] transition-colors duration-300"
            >
              Meet All Artisans
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
