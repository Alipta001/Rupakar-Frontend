'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const collections = [
  {
    id: 1,
    title: 'Terracotta Atelier',
    subtitle: 'Earth & Fire Collection',
    count: '124 Pieces',
    image: '/images/collection-terracotta.jpg',
    href: '/collections/terracotta',
    accent: '#C89B3C',
  },
  {
    id: 2,
    title: 'Folk Heritage',
    subtitle: 'Painted Village Stories',
    count: '89 Pieces',
    image: '/images/category-folk-art.jpg',
    href: '/collections/folk-art',
    accent: '#A64521',
  },
  {
    id: 3,
    title: 'Ethnic Sanctuary',
    subtitle: 'Home & Sacred Decor',
    count: '210 Pieces',
    image: '/images/collection-decor.jpg',
    href: '/collections/decor',
    accent: '#C89B3C',
  },
]

export default function FeaturedCollections() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: 'easeOut' as const } },
  }

  return (
    <section className="py-28 bg-[#F8F4EE]" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="ornament-divider mb-5">
            <span className="text-[#C89B3C] font-sans text-[10px] tracking-[0.3em] uppercase">
              Curated Selections
            </span>
          </div>
          <h2
            className="text-[#1E1A17] leading-tight"
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 300,
            }}
          >
            Featured Collections
          </h2>
          <p className="text-[#5B4B3F] font-sans text-sm leading-relaxed max-w-md mx-auto mt-4" style={{ letterSpacing: '0.03em' }}>
            Thoughtfully curated groupings of India&apos;s most celebrated craft traditions
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {collections.map((col, i) => (
            <motion.div key={col.id} variants={itemVariants}>
              <Link href={col.href} className="group block">
                <div className="relative overflow-hidden aspect-[3/4]">
                  <Image
                    src={col.image}
                    alt={col.title}
                    fill
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E1A17]/80 via-[#1E1A17]/20 to-transparent" />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#6B3E26]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Count badge */}
                  <div className="absolute top-5 right-5 border border-[#C89B3C]/60 px-3 py-1">
                    <span className="text-[#C89B3C] font-sans text-[9px] tracking-[0.2em] uppercase">
                      {col.count}
                    </span>
                  </div>

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="text-[#C89B3C] font-sans text-[9px] tracking-[0.2em] uppercase mb-2">
                      {col.subtitle}
                    </div>
                    <h3
                      className="text-[#F8F4EE] mb-4 leading-tight"
                      style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.75rem', fontWeight: 400 }}
                    >
                      {col.title}
                    </h3>
                    <motion.div
                      className="flex items-center gap-2 text-[#F8F4EE]/70 group-hover:text-[#C89B3C] transition-colors duration-300"
                      initial={{ x: 0 }}
                      whileHover={{ x: 4 }}
                    >
                      <span className="font-sans text-[10px] tracking-[0.2em] uppercase">Explore</span>
                      <ArrowRight size={12} />
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
