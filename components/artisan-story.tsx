'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Sparkles, ArrowRight, Quote, Award } from 'lucide-react'

interface MasterArtisan {
  name: string
  role: string
  craft: string
  region: string
  lineage: string
  experience: string
  quote: string
  story: string
  techniques: string[]
  image: string
  href: string
}

const artisans: MasterArtisan[] = [
  {
    name: 'Ramkumar Prajapati',
    role: 'Master Clay Sculptor',
    craft: 'Terracotta & Temple Plaques',
    region: 'Bishnupur, Bankura',
    lineage: '6th Generation Guild Master',
    experience: '42 Years of Soil Mastery',
    quote: 'Every handful of riverbed clay carries the memory of our ancestors. In our wood-fired kilns, we do not merely shape earth—we give eternity a vessel.',
    story: 'Prajapati’s scorched-earthen Bankura horses and sacred terracotta relief murals have been curated by heritage archives across Europe and national cultural museums.',
    techniques: ['Alluvial Riverbed Clay', 'Wood-Fired Pit Kiln', 'Hand-Coiled Relief'],
    image: '/images/artisan-portrait.jpg',
    href: '/artisans',
  },
  {
    name: 'Savitri Devi & Guild',
    role: 'Master Madhubani & Scroll Painter',
    craft: 'Folk Art & Ancient Patachitra',
    region: 'Madhubani & Pingla',
    lineage: 'National Heritage Craft Guild',
    experience: '35 Years of Sacred Artistry',
    quote: 'Our brush never touches synthetic pigments. The black is pure lamp soot, the yellow from crushed turmeric, and the crimson from fresh pomegranate rind.',
    story: 'Leading a collective of 28 rural women painters, Devi transforms handmade rag paper into devotional tapestries celebrating cosmic balance and harvest hymns.',
    techniques: ['Natural Petal & Mineral Dyes', 'Handmade Rag Paper', 'Twig & Reed Brushwork'],
    image: '/images/gallery-1.jpg',
    href: '/artisans',
  },
]

export default function ArtisanStory() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const yBg = useTransform(scrollYProgress, [0, 1], ['-4%', '4%'])

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 bg-[#F4E8D8] overflow-hidden">
      {/* Parallax background texture */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 opacity-15 pointer-events-none">
        <Image src="/images/heritage-craft.jpg" alt="" fill className="object-cover" />
      </motion.div>

      {/* Decorative ambient lighting glows */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-[#C89B3C]/[0.08] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#6B3E26]/[0.08] rounded-full blur-[150px] pointer-events-none" />

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
            <span>Master Artisan Guilds · Living Heritage</span>
          </div>

          <h2
            className="text-[#1E1A17] leading-tight mb-4"
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
              fontWeight: 300,
            }}
          >
            Behind Every Piece,<br />
            <em className="text-[#C89B3C]" style={{ fontStyle: 'italic', fontWeight: 400 }}>A Living Tradition</em>
          </h2>

          <p className="text-[#5B4B3F] font-sans text-xs sm:text-sm leading-relaxed max-w-lg mx-auto tracking-wide">
            Every artifact is signed by the hands of master creators upholding uncorrupted ancestral methods passed down across generations.
          </p>
        </motion.div>

        {/* Master Artisan Editorial Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mb-16 sm:mb-20">
          {artisans.map((artisan, i) => (
            <motion.div
              key={artisan.name}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: i * 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col justify-between rounded-3xl overflow-hidden border border-[#D4C4B0]/80 hover:border-[#C89B3C] bg-white/95 sm:bg-[#FAF6F0] p-6 sm:p-8 backdrop-blur-md shadow-lg transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(107,62,38,0.16)]"
            >
              {/* Decorative watermark quote mark */}
              <Quote className="absolute top-6 right-6 w-14 h-14 text-[#C89B3C]/10 pointer-events-none transition-colors duration-300 group-hover:text-[#C89B3C]/20" />

              <div>
                {/* Top Section: Portrait & Identity Details */}
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-7 items-start mb-6">
                  {/* Portrait with Framing & Heritage Seal */}
                  <div className="relative w-full sm:w-[210px] aspect-[4/5] rounded-2xl overflow-hidden shrink-0 border border-[#C89B3C]/30 shadow-md">
                    <Image
                      src={artisan.image}
                      alt={artisan.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 210px"
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    
                    {/* Heritage Lineage Pill Badge Overlaid on Portrait */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 px-2.5 py-1 rounded-full bg-[#1E1A17]/90 backdrop-blur-md border border-[#C89B3C]/35 text-[#C89B3C] text-[9px] font-sans tracking-[0.18em] uppercase text-center font-medium">
                      {artisan.lineage}
                    </div>
                  </div>

                  {/* Narrative Profile Details */}
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6B3E26]/8 border border-[#6B3E26]/20 text-[#6B3E26] text-[10px] font-sans uppercase tracking-[0.2em] font-medium mb-3">
                      <span>{artisan.region}</span>
                      <span className="text-[#C89B3C]">·</span>
                      <span>{artisan.craft}</span>
                    </div>

                    <h3
                      className="text-[#1E1A17] leading-tight font-serif text-2xl sm:text-3xl font-normal group-hover:text-[#6B3E26] transition-colors duration-300 mb-1.5"
                    >
                      {artisan.name}
                    </h3>

                    <div className="flex items-center gap-1.5 text-[#C89B3C] font-sans text-xs tracking-[0.15em] uppercase font-semibold mb-3">
                      <Award className="w-3.5 h-3.5 shrink-0 text-[#C89B3C]" />
                      <span>{artisan.experience}</span>
                    </div>

                    <p className="text-[#5B4B3F] font-sans text-xs sm:text-[13px] leading-relaxed">
                      {artisan.story}
                    </p>
                  </div>
                </div>

                {/* Artisan Quote Block with Luxury Serif Styling */}
                <div className="pl-4 border-l-2 border-[#C89B3C] my-4 py-0.5">
                  <p
                    className="text-[#241710] leading-relaxed italic"
                    style={{
                      fontFamily: 'var(--font-cormorant), serif',
                      fontSize: '1.15rem',
                      lineHeight: 1.55,
                    }}
                  >
                    &ldquo;{artisan.quote}&rdquo;
                  </p>
                </div>
              </div>

              {/* Bottom: Techniques Badges & Read Story Action */}
              <div className="pt-4 border-t border-[#D4C4B0]/60">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  {/* Techniques Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {artisan.techniques.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 rounded-full bg-[#EFE3D3]/60 text-[#5B4B3F] border border-[#D4C4B0]/60 text-[9px] font-sans tracking-wide font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Link with Hover Motion */}
                  <Link
                    href={artisan.href}
                    className="inline-flex items-center gap-1.5 text-[#C89B3C] hover:text-[#1E1A17] font-sans text-[10px] tracking-[0.2em] uppercase font-semibold transition-colors duration-300 group/link"
                  >
                    <span>Read Story</span>
                    <ArrowRight size={13} className="transition-transform duration-300 group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Heritage Manifesto Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative rounded-2xl overflow-hidden border border-[#C89B3C]/30 bg-gradient-to-r from-[#241710] via-[#2B1D15] to-[#241710] p-8 sm:p-12 text-center shadow-xl text-[#F8F4EE]"
        >
          {/* Subtle gold glow inside banner */}
          <div className="absolute inset-0 bg-[#C89B3C]/[0.03] pointer-events-none" />

          <p
            className="text-[#F8F4EE] mb-6 max-w-2xl mx-auto leading-snug"
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 'clamp(1.3rem, 3vw, 1.85rem)',
              fontStyle: 'italic',
              fontWeight: 300,
            }}
          >
            &ldquo;We are not merely presenting craft. We are safeguarding the living, breathing soul of human heritage.&rdquo;
          </p>

          <Link href="/artisans">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-[#C89B3C] to-[#B7792B] hover:from-[#B7792B] hover:to-[#A66B25] text-[#1E1A17] rounded-md font-sans text-xs tracking-[0.2em] uppercase font-semibold transition-all shadow-lg shadow-[#C89B3C]/20"
            >
              <span>Meet All Master Artisans</span>
              <ArrowRight size={14} strokeWidth={2} />
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
