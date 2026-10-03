'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight, Sparkles } from 'lucide-react'

interface CraftCategory {
  name: string
  subtitle: string
  origin: string
  image: string
  count: number
  href: string
  description: string
  tag?: string
  gridClass: string
  minHeightClass: string
}

const crafts: CraftCategory[] = [
  {
    name: 'Terracotta & Temple Clay',
    subtitle: 'Earth & Fire Legacy',
    origin: 'Bishnupur & Bankura',
    image: '/images/collection-terracotta.jpg',
    count: 156,
    href: '/collections/terracotta',
    description: 'Sacred relief plaques, burnt clay vessels, and iconic Bankura horses sculpted by master clay-shapers.',
    tag: 'GI Certified Heritage',
    gridClass: 'col-span-12 lg:col-span-7',
    minHeightClass: 'min-h-[380px] sm:min-h-[420px]',
  },
  {
    name: 'Folk Art & Patachitra',
    subtitle: 'Ancient Village Scrolls',
    origin: 'Pingla, West Midnapore',
    image: '/images/category-folk-art.jpg',
    count: 89,
    href: '/collections/folk-art',
    description: 'Mythological scroll art hand-painted on handmade paper with crushed stone & petal dyes.',
    tag: 'Natural Pigments',
    gridClass: 'col-span-12 lg:col-span-5',
    minHeightClass: 'min-h-[380px] sm:min-h-[420px]',
  },
  {
    name: 'Studio Pottery & Ceramics',
    subtitle: 'Contemporary Earthenware',
    origin: 'Santiniketan Atelier',
    image: '/images/category-pottery.jpg',
    count: 124,
    href: '/collections/pottery',
    description: 'Wheel-thrown earthenware and organic glazed tableware fired in traditional wood kilns.',
    tag: 'Wood-Fired',
    gridClass: 'col-span-12 sm:col-span-6 lg:col-span-4',
    minHeightClass: 'min-h-[340px] sm:min-h-[360px]',
  },
  {
    name: 'Dokra & Bell Metalcraft',
    subtitle: '4,000-Year Lost Wax',
    origin: 'Bikna & Dariapur',
    image: '/images/category-decor.jpg',
    count: 210,
    href: '/collections/decor',
    description: 'Non-ferrous antique brass figurines and sacred temple artifacts forged with lost-wax casting.',
    tag: 'Tribal Metallurgy',
    gridClass: 'col-span-12 sm:col-span-6 lg:col-span-4',
    minHeightClass: 'min-h-[340px] sm:min-h-[360px]',
  },
  {
    name: 'Artisan Ethnic Jewelry',
    subtitle: 'Hand-Etched Adornments',
    origin: 'Murshidabad & Birbhum',
    image: '/images/category-jewelry.jpg',
    count: 67,
    href: '/collections/jewelry',
    description: 'Terracotta bead necklaces, hand-beaten brass chokers, and festive heritage earrings.',
    tag: 'Wearable Art',
    gridClass: 'col-span-12 sm:col-span-12 lg:col-span-4',
    minHeightClass: 'min-h-[340px] sm:min-h-[360px]',
  },
  {
    name: 'Village Crafts & Sholapith Weaves',
    subtitle: 'Rural Bengal Artisans Collective',
    origin: 'Bardhaman & Nadia',
    image: '/images/heritage-craft.jpg',
    count: 98,
    href: '/collections/village-crafts',
    description: 'Intricate reed pith carvings, handloom jute tapestries, and village sanctuary artifacts shaped by over 40 generational craft guilds.',
    tag: 'Master Artisan Guilds',
    gridClass: 'col-span-12',
    minHeightClass: 'min-h-[280px] sm:min-h-[320px]',
  },
]

export default function ShopByCategory() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-24 sm:py-32 bg-[#241710] text-[#F8F4EE] relative overflow-hidden">
      {/* Decorative ambient background glows matching footer */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#C89B3C]/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#6B3E26]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-14 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C89B3C]/10 border border-[#C89B3C]/30 text-[#C89B3C] text-[10px] font-sans tracking-[0.25em] uppercase mb-4 font-medium">
            <Sparkles className="w-3 h-3 text-[#C89B3C]" />
            <span>Living Traditions of Bengal</span>
          </div>

          <h2
            className="text-[#F8F4EE] leading-tight mb-4"
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 300,
            }}
          >
            Shop by <em className="text-[#C89B3C]" style={{ fontStyle: 'italic', fontWeight: 400 }}>Craft & Heritage</em>
          </h2>

          <p className="text-[#F8F4EE]/70 font-sans text-xs sm:text-sm tracking-wide max-w-xl mx-auto leading-relaxed">
            Every creation is born from inherited soil, hand-sculpted by certified master artisans preserving over two millennia of indigenous artistry.
          </p>
        </motion.div>

        {/* Dynamic Architectural Bento Grid */}
        <div className="grid grid-cols-12 gap-4 sm:gap-6">
          {crafts.map((craft, i) => (
            <motion.div
              key={craft.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
              className={`${craft.gridClass} group`}
            >
              <Link
                href={craft.href}
                className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#C89B3C]/25 bg-[#2B1D15] p-6 sm:p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-[#C89B3C] hover:shadow-[0_22px_45px_rgba(200,155,60,0.14)] ${craft.minHeightClass}`}
              >
                {/* Background Image with Zoom */}
                <Image
                  src={craft.image}
                  alt={craft.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-108"
                />

                {/* Layered Vignette Overlays for deep contrast and typography readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#140E0A] via-[#1E1A17]/65 to-[#1E1A17]/25 transition-opacity duration-500 group-hover:via-[#1E1A17]/55" />
                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/0 transition-colors duration-500" />
                <div className="absolute inset-0 border border-[#C89B3C]/0 group-hover:border-[#C89B3C]/40 transition-colors duration-500 rounded-2xl pointer-events-none" />

                {/* Top Row: Origin & Tag Badges */}
                <div className="relative z-10 flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#241710]/85 backdrop-blur-md border border-[#C89B3C]/35 text-[#C89B3C] text-[10px] font-sans tracking-[0.2em] uppercase font-medium">
                      {craft.origin}
                    </span>
                    {craft.tag && (
                      <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#F8F4EE]/90 text-[10px] font-sans tracking-wider">
                        {craft.tag}
                      </span>
                    )}
                  </div>

                  <span className="shrink-0 px-2.5 py-1 rounded-full bg-[#241710]/80 backdrop-blur-md border border-white/10 text-[#F8F4EE]/80 text-[10px] font-sans tracking-widest uppercase">
                    {craft.count} Pieces
                  </span>
                </div>

                {/* Bottom Row: Typography, Description & Action Button */}
                <div className="relative z-10 pt-16">
                  <div className="flex items-end justify-between gap-4">
                    <div className="max-w-xl">
                      <span className="block text-[#C89B3C] text-[11px] uppercase tracking-[0.25em] font-sans mb-1.5 font-medium">
                        {craft.subtitle}
                      </span>
                      <h3
                        className="text-[#F8F4EE] leading-[1.15] mb-2 transition-colors duration-300 group-hover:text-white"
                        style={{
                          fontFamily: 'var(--font-cormorant), serif',
                          fontSize: craft.gridClass.includes('col-span-12')
                            ? 'clamp(1.75rem, 3vw, 2.3rem)'
                            : 'clamp(1.4rem, 2.4vw, 1.85rem)',
                          fontWeight: 400,
                        }}
                      >
                        {craft.name}
                      </h3>
                      <p className="text-[#D4C4B0]/80 font-sans text-xs sm:text-[13px] leading-relaxed line-clamp-2 sm:line-clamp-2 max-w-lg transition-colors group-hover:text-[#F8F4EE]">
                        {craft.description}
                      </p>
                    </div>

                    {/* Circular Action Badge with 45-degree hover rotation */}
                    <div className="shrink-0 w-11 h-11 rounded-full bg-[#C89B3C]/20 border border-[#C89B3C]/50 text-[#C89B3C] flex items-center justify-center transition-all duration-300 group-hover:bg-[#C89B3C] group-hover:text-[#171311] group-hover:scale-110 shadow-lg">
                      <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
