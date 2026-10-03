'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight, Sparkles } from 'lucide-react'

interface FeaturedCollection {
  id: number
  title: string
  subtitle: string
  origin: string
  count: string
  image: string
  href: string
  tag: string
  description: string
}

const collections: FeaturedCollection[] = [
  {
    id: 1,
    title: 'Terracotta Atelier',
    subtitle: 'Earth & Sacred Fire',
    origin: 'Bishnupur & Bankura',
    count: '124 Pieces',
    image: '/images/collection-terracotta.jpg',
    href: '/collections/terracotta',
    tag: 'GI Certified Craft',
    description: 'Scorched red earthen vessels, temple relief plaques, and iconic Bankura horses shaped by generational clay masters.',
  },
  {
    id: 2,
    title: 'Folk Art & Patachitra',
    subtitle: 'Mythological Scrolls',
    origin: 'Pingla, Midnapore',
    count: '89 Pieces',
    image: '/images/category-folk-art.jpg',
    href: '/collections/folk-art',
    tag: 'Natural Mineral Dyes',
    description: 'Ancient scroll narratives hand-painted on handmade rag paper using extracted stone, conch shell, and petal pigments.',
  },
  {
    id: 3,
    title: 'Ethnic Sanctuary',
    subtitle: 'Sacred Living & Decor',
    origin: 'Santiniketan Guilds',
    count: '210 Pieces',
    image: '/images/collection-decor.jpg',
    href: '/collections/decor',
    tag: 'Heirloom Keepsakes',
    description: 'Intricate brass ritual lighting, wheel-thrown studio earthenware, and sanctuary artifacts shaped for mindful luxury.',
  },
]

export default function FeaturedCollections() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.18 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: 'easeOut' as const } },
  }

  return (
    <section className="py-24 sm:py-32 bg-[#F8F4EE] relative overflow-hidden" ref={ref}>
      {/* Decorative subtle ambient glows */}
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-[#C89B3C]/[0.06] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#6B3E26]/[0.05] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#6B3E26]/8 border border-[#6B3E26]/20 text-[#6B3E26] text-[10px] font-sans tracking-[0.25em] uppercase mb-4 font-medium">
            <Sparkles className="w-3 h-3 text-[#C89B3C]" />
            <span>Curated Selections · Living Heritage</span>
          </div>

          <h2
            className="text-[#1E1A17] leading-tight mb-4"
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 300,
            }}
          >
            Featured <em className="text-[#C89B3C]" style={{ fontStyle: 'italic', fontWeight: 400 }}>Collections</em>
          </h2>

          <p className="text-[#5B4B3F] font-sans text-xs sm:text-sm leading-relaxed max-w-lg mx-auto tracking-wide">
            Thoughtfully curated groupings of India&apos;s most celebrated craft traditions, sculpted by master artisan lineages.
          </p>
        </motion.div>

        {/* Premium Collection Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
        >
          {collections.map((col) => (
            <motion.div key={col.id} variants={itemVariants} className="group">
              <Link
                href={col.href}
                className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#C89B3C]/25 bg-[#1E1A17] p-6 sm:p-8 transition-all duration-700 hover:-translate-y-2 hover:border-[#C89B3C] hover:shadow-[0_25px_50px_rgba(200,155,60,0.18)] min-h-[480px] sm:min-h-[510px]"
              >
                {/* Background Image with Zoom */}
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                />

                {/* Layered Vignette Overlays for deep luxury contrast and readable typography */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#120B07] via-[#1E1A17]/65 to-black/25 transition-opacity duration-500 group-hover:via-[#1E1A17]/50" />
                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/0 transition-colors duration-500" />
                <div className="absolute inset-0 border border-[#C89B3C]/0 group-hover:border-[#C89B3C]/40 transition-colors duration-500 rounded-2xl pointer-events-none" />

                {/* Top Row: Origin & Count Badges */}
                <div className="relative z-10 flex items-start justify-between gap-3">
                  <span className="px-3 py-1 rounded-full bg-[#241710]/85 backdrop-blur-md border border-[#C89B3C]/35 text-[#C89B3C] text-[10px] font-sans tracking-[0.2em] uppercase font-medium">
                    {col.origin}
                  </span>

                  <span className="shrink-0 px-3 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-[#F8F4EE] text-[10px] font-sans tracking-widest uppercase">
                    {col.count}
                  </span>
                </div>

                {/* Bottom Content Area */}
                <div className="relative z-10 pt-16">
                  <div className="mb-2">
                    <span className="block text-[#C89B3C] text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-sans font-medium mb-1.5">
                      ✦ {col.subtitle}
                    </span>

                    <h3
                      className="text-[#F8F4EE] leading-[1.15] mb-2.5 transition-colors duration-300 group-hover:text-white"
                      style={{
                        fontFamily: 'var(--font-cormorant), serif',
                        fontSize: 'clamp(1.75rem, 2.5vw, 2.2rem)',
                        fontWeight: 400,
                      }}
                    >
                      {col.title}
                    </h3>

                    <p className="text-[#D4C4B0]/80 font-sans text-xs sm:text-[13px] leading-relaxed line-clamp-2 mb-4 group-hover:text-[#F8F4EE] transition-colors duration-300">
                      {col.description}
                    </p>

                    {/* Expanding Gold Hairline Accent */}
                    <div className="h-px w-12 group-hover:w-full bg-gradient-to-r from-[#C89B3C] to-transparent transition-all duration-500 mb-4" />
                  </div>

                  {/* Action Link & Circular Arrow Button */}
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-sans text-[10px] tracking-[0.22em] uppercase text-[#F8F4EE]/90 group-hover:text-[#C89B3C] transition-colors duration-300 font-medium">
                      Explore Collection
                    </span>

                    <div className="shrink-0 w-10 h-10 rounded-full bg-[#C89B3C]/20 border border-[#C89B3C]/50 text-[#C89B3C] flex items-center justify-center transition-all duration-300 group-hover:bg-[#C89B3C] group-hover:text-[#171311] group-hover:scale-110 shadow-md">
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
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
