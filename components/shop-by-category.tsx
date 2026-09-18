'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'

const categories = [
  { name: 'Pottery & Ceramics', image: '/images/category-pottery.jpg', count: 124, href: '/collections/pottery' },
  { name: 'Folk Art', image: '/images/category-folk-art.jpg', count: 89, href: '/collections/folk-art' },
  { name: 'Home Decor', image: '/images/category-decor.jpg', count: 210, href: '/collections/decor' },
  { name: 'Artisan Jewelry', image: '/images/category-jewelry.jpg', count: 67, href: '/collections/jewelry' },
  { name: 'Terracotta', image: '/images/collection-terracotta.jpg', count: 156, href: '/collections/terracotta' },
  { name: 'Village Crafts', image: '/images/gallery-3.jpg', count: 98, href: '/collections/village-crafts' },
]

export default function ShopByCategory() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-28 bg-[#1E1A17]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <div className="ornament-divider mb-5">
            <span className="text-[#C89B3C] font-sans text-[10px] tracking-[0.3em] uppercase">
              Browse By
            </span>
          </div>
          <h2
            className="text-[#F8F4EE] leading-tight"
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 300,
            }}
          >
            Shop by <em className="text-[#C89B3C]" style={{ fontStyle: 'italic' }}>Craft</em>
          </h2>
        </motion.div>

        {/* Bento-style grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className={i === 0 ? 'row-span-2 md:col-span-1' : ''}
            >
              <Link href={cat.href} className="group block relative overflow-hidden" style={{ height: i === 0 ? '100%' : '200px', minHeight: i === 0 ? '300px' : '200px' }}>
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#1E1A17]/40 group-hover:bg-[#1E1A17]/60 transition-colors duration-500" />
                <div className="absolute inset-0 border border-[#C89B3C]/0 group-hover:border-[#C89B3C]/40 transition-colors duration-500" />

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="text-[#C89B3C] font-sans text-[9px] tracking-[0.25em] uppercase mb-1">
                    {cat.count} Pieces
                  </div>
                  <h3
                    className="text-[#F8F4EE] leading-tight"
                    style={{
                      fontFamily: 'var(--font-cormorant), serif',
                      fontSize: i === 0 ? '1.8rem' : '1.2rem',
                      fontWeight: 400,
                    }}
                  >
                    {cat.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
