'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { Instagram } from 'lucide-react'

const galleryImages = [
  { src: '/images/gallery-1.jpg', alt: 'Terracotta painting process' },
  { src: '/images/product-vase.jpg', alt: 'Madhubani terracotta vase' },
  { src: '/images/gallery-2.jpg', alt: 'Handwoven textiles' },
  { src: '/images/artisan-portrait.jpg', alt: 'Master artisan at work' },
  { src: '/images/gallery-3.jpg', alt: 'Folk art collection' },
  { src: '/images/product-bowl.jpg', alt: 'Tribal painted bowl' },
  { src: '/images/collection-terracotta.jpg', alt: 'Terracotta collection' },
  { src: '/images/product-lamp.jpg', alt: 'Terracotta diya lamp' },
]

export default function InstagramGallery() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-28 bg-[#F4E8D8]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="ornament-divider mb-5">
            <span className="text-[#C89B3C] font-sans text-[10px] tracking-[0.3em] uppercase">
              @rupakar.india
            </span>
          </div>
          <h2
            className="text-[#1E1A17] leading-tight mb-3"
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 300,
            }}
          >
            Follow the Journey
          </h2>
          <p className="text-[#5B4B3F] font-sans text-xs tracking-[0.1em] max-w-sm mx-auto">
            Behind the scenes of India&apos;s most extraordinary craft traditions
          </p>
        </motion.div>

        {/* Gallery grid */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.07 }}
              className="group relative aspect-square overflow-hidden col-span-2"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[#1E1A17]/0 group-hover:bg-[#6B3E26]/60 transition-all duration-400 flex items-center justify-center">
                <Instagram
                  size={22}
                  className="text-[#F8F4EE] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  strokeWidth={1.5}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-10"
        >
          <a
            href="https://instagram.com/rupakar.india"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-[#6B3E26] text-[#6B3E26] hover:bg-[#6B3E26] hover:text-[#F8F4EE] px-8 py-3 font-sans text-xs tracking-[0.2em] uppercase transition-all duration-300"
          >
            <Instagram size={14} strokeWidth={1.5} />
            Follow on Instagram
          </a>
        </motion.div>
      </div>
    </section>
  )
}
