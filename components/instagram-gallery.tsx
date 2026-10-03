'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { Instagram, ArrowUpRight } from 'lucide-react'

interface JourneyCard {
  id: number
  src: string
  alt: string
  location: string
  title: string
  subtitle: string
  href: string
}

const journeyCards: JourneyCard[] = [
  {
    id: 1,
    src: '/images/artisan-portrait.jpg',
    alt: 'Master artisan sculpting clay at dawn',
    location: 'Bishnupur',
    title: 'The Potter’s Wheel at Dawn',
    subtitle: 'Hand-turned terracotta clay',
    href: 'https://instagram.com/rupakar.india',
  },
  {
    id: 2,
    src: '/images/gallery-1.jpg',
    alt: 'Natural mineral and petal pigment extraction',
    location: 'Pingla Village',
    title: 'Mineral & Petal Alchemy',
    subtitle: 'Crushed stone & leaf dyes',
    href: 'https://instagram.com/rupakar.india',
  },
  {
    id: 3,
    src: '/images/collection-terracotta.jpg',
    alt: 'Iconic Bankura terracotta horses cooling after kiln firing',
    location: 'Bankura',
    title: 'The Living Kiln Fire',
    subtitle: 'Low-oxygen wood-fired patina',
    href: 'https://instagram.com/rupakar.india',
  },
  {
    id: 4,
    src: '/images/gallery-2.jpg',
    alt: 'Handloom textile warp under natural courtyard light',
    location: 'Santiniketan',
    title: 'Heritage Loom Rhythm',
    subtitle: 'Hand-spun raw tussar & cotton',
    href: 'https://instagram.com/rupakar.india',
  },
]

export default function InstagramGallery() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-24 sm:py-32 bg-[#FAF7F2] relative overflow-hidden">
      {/* Subtle ambient luxury backdrop glows */}
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-[#C89B3C]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#6B3E26]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#6B3E26]/8 border border-[#6B3E26]/15 text-[#6B3E26] text-[10px] font-sans tracking-[0.25em] uppercase mb-4 font-medium">
            <Instagram className="w-3.5 h-3.5 text-[#C89B3C]" />
            <span>@rupakar.india · Visual Journal</span>
          </div>

          <h2
            className="text-[#1E1A17] leading-tight mb-4"
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
              fontWeight: 300,
            }}
          >
            Follow the <em className="text-[#C89B3C]" style={{ fontStyle: 'italic', fontWeight: 400 }}>Journey</em>
          </h2>

          <p className="text-[#5B4B3F] font-sans text-xs sm:text-sm tracking-wide max-w-md mx-auto leading-relaxed">
            Unfiltered glimpses into the generational ateliers, clay pits, and sacred looms of Bengal.
          </p>
        </motion.div>

        {/* Spacious 4-Card Editorial Portrait Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {journeyCards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 35 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 0.45, 0.36, 1] }}
            >
              <a
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl border border-[#D4C4B0]/60 bg-[#1E1A17] transition-all duration-500 hover:-translate-y-2 hover:border-[#C89B3C] hover:shadow-[0_25px_50px_rgba(107,62,38,0.18)]"
              >
                {/* Background Photography with Zoom */}
                <Image
                  src={card.src}
                  alt={card.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-108"
                />

                {/* Gentle gradient overlay: keeps image bright and clear while guaranteeing text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#120D0A]/90 via-[#1E1A17]/30 to-transparent transition-opacity duration-500 group-hover:via-[#1E1A17]/40" />

                {/* Top Location Pill */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full bg-[#1E1A17]/75 backdrop-blur-md border border-[#C89B3C]/35 text-[#C89B3C] text-[10px] font-sans tracking-[0.2em] uppercase font-medium shadow-sm">
                    {card.location}
                  </span>
                </div>

                {/* Top-Right Instagram Indicator (Reveals/Highlights on Hover) */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1E1A17]/75 backdrop-blur-md border border-white/20 text-[#F8F4EE] transition-all duration-300 group-hover:bg-[#C89B3C] group-hover:text-[#1E1A17] group-hover:scale-110 shadow-sm">
                    <Instagram className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Bottom Title & Subtitle with Arrow */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <span className="block text-[#C89B3C] text-[10px] uppercase tracking-[0.2em] font-sans mb-1 font-medium">
                        {card.subtitle}
                      </span>
                      <h3
                        className="text-[#F8F4EE] leading-snug transition-colors duration-300 group-hover:text-white"
                        style={{
                          fontFamily: 'var(--font-cormorant), serif',
                          fontSize: '1.35rem',
                          fontWeight: 400,
                        }}
                      >
                        {card.title}
                      </h3>
                    </div>

                    {/* Circular Action Badge */}
                    <div className="shrink-0 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[#F8F4EE] flex items-center justify-center transition-all duration-300 group-hover:bg-[#C89B3C] group-hover:text-[#1E1A17] group-hover:border-[#C89B3C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shadow-md">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-14 sm:mt-18 text-center"
        >
          <a
            href="https://instagram.com/rupakar.india"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#1E1A17] hover:bg-[#3A2418] text-[#F8F4EE] border border-[#C89B3C]/50 hover:border-[#C89B3C] shadow-lg shadow-black/15 transition-all duration-300 hover:scale-105 active:scale-95 text-xs font-sans tracking-[0.2em] uppercase font-medium"
          >
            <Instagram className="w-4 h-4 text-[#C89B3C] transition-transform duration-300 group-hover:rotate-6" />
            <span>Join 45,000+ Patrons on Instagram</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
