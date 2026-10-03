'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck, HeartHandshake, PackageCheck, Quote } from 'lucide-react'
import { RatingStars } from '@/components/ui/rating-stars'

interface Testimonial {
  id: number
  name: string
  location: string
  initials: string
  rating: number
  text: string
  product: string
  productImage: string
  productHref: string
  badge: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Priya Krishnamurthy',
    location: 'Mumbai, Maharashtra',
    initials: 'PK',
    rating: 5,
    text: 'Rupakar is unlike anything I have experienced. My vase arrived wrapped in hand-pressed seed paper with a personal letter from the artisan herself. You can feel the living soul of the earth in every curve.',
    product: 'Madhubani Terracotta Vase',
    productImage: '/images/product-vase.jpg',
    productHref: '/collections/terracotta',
    badge: 'Verified Patron · Bishnupur Clay',
  },
  {
    id: 2,
    name: 'Arjun Mehta',
    location: 'New Delhi',
    initials: 'AM',
    rating: 5,
    text: 'The heirloom quality is breathtaking. Every painted geometric line tells a tribal story that machine manufacturing could never replicate. My living room feels like a museum pavilion.',
    product: 'Tribal Hand-Painted Bowl Set',
    productImage: '/images/product-bowl.jpg',
    productHref: '/collections/folk-art',
    badge: 'Verified Patron · Folk Art Guild',
  },
  {
    id: 3,
    name: 'Sneha Patel',
    location: 'Bengaluru, Karnataka',
    initials: 'SP',
    rating: 5,
    text: 'I gifted these Pattachitra plates for a royal wedding. The couple called in tears — they had never witnessed such raw, devotional brushwork. The museum-grade archival packaging alone is an art form.',
    product: 'Pattachitra Wall Plates',
    productImage: '/images/product-plate.jpg',
    productHref: '/collections/folk-art',
    badge: 'Verified Collector · Pingla Heritage',
  },
  {
    id: 4,
    name: 'Rahul Sharma',
    location: 'Jaipur, Rajasthan',
    initials: 'RS',
    rating: 5,
    text: 'Watching potters work in my ancestral village, seeing Rupakar honor these craftspeople with such luxury, fair remittance, and international dignity is deeply moving. True patrons of culture.',
    product: 'Terracotta Sanctuary Figurine',
    productImage: '/images/product-figurine.jpg',
    productHref: '/collections/terracotta',
    badge: 'Verified Patron · Wood Kiln Fired',
  },
  {
    id: 5,
    name: 'Ananya Sen',
    location: 'Kolkata, West Bengal',
    initials: 'AS',
    rating: 5,
    text: 'The weight and rustic antique patina of the Dokra bell metal is mesmerizing. Knowing this craft has remained unchanged for 4,000 years makes every evening lighting feel sacred.',
    product: 'Dokra Ritual Diya Lamp',
    productImage: '/images/product-lamp.jpg',
    productHref: '/collections/decor',
    badge: 'Verified Collector · Lost-Wax Bronze',
  },
  {
    id: 6,
    name: 'Vikramaditya Roy',
    location: 'London & South Mumbai',
    initials: 'VR',
    rating: 5,
    text: 'From dispatch to international arrival, the craftsmanship and packaging were flawless. This Bankura horse stands proudly in my study as an eternal ambassador of Bengal\'s artistic genius.',
    product: 'Heritage Bankura Horse Replica',
    productImage: '/images/collection-terracotta.jpg',
    productHref: '/collections/terracotta',
    badge: 'Verified Patron · Master Atelier',
  },
]

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [page, setPage] = useState(0)

  // Display 3 cards per page on desktop, 6 items total = 2 pages
  const itemsPerPage = 3
  const totalPages = Math.ceil(testimonials.length / itemsPerPage)

  const nextPage = () => setPage((p) => (p + 1) % totalPages)
  const prevPage = () => setPage((p) => (p - 1 + totalPages) % totalPages)

  const currentBatch = testimonials.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage)

  return (
    <section ref={ref} className="py-24 sm:py-32 bg-[#241710] text-[#F8F4EE] relative overflow-hidden">
      {/* Decorative ambient background glows matching footer */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#C89B3C]/[0.04] blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#6B3E26]/15 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Header with warm footer-matching styling */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-14 sm:mb-18"
        >
          {/* Trust rating badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C89B3C]/10 border border-[#C89B3C]/30 text-[#C89B3C] text-[10px] font-sans tracking-[0.25em] uppercase mb-4 font-medium">
            <span>★ 4.98 / 5.0 Rating from 1,400+ Collectors</span>
          </div>

          <h2
            className="text-[#F8F4EE] leading-tight mb-4"
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 'clamp(2.3rem, 4.5vw, 3.8rem)',
              fontWeight: 300,
            }}
          >
            What Our <em className="text-[#C89B3C]" style={{ fontStyle: 'italic', fontWeight: 400 }}>Community Says</em>
          </h2>

          <p className="text-[#F8F4EE]/70 font-sans text-xs sm:text-sm tracking-wide max-w-lg mx-auto leading-relaxed">
            Reflections from patrons whose homes are illuminated by authentic Indian craft traditions and generational artisan partnerships.
          </p>
        </motion.div>

        {/* 3-Column Luxury Testimonial Grid on Warm Brown Background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {currentBatch.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#C89B3C]/20 bg-[#2B1D15]/85 p-7 sm:p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-1.5 hover:border-[#C89B3C] hover:bg-[#2B1D15] hover:shadow-[0_20px_45px_rgba(0,0,0,0.45)]"
              >
                {/* Decorative background watermark quote */}
                <Quote className="absolute top-6 right-6 w-12 h-12 text-[#C89B3C]/10 pointer-events-none transition-colors duration-300 group-hover:text-[#C89B3C]/25" />

                <div>
                  {/* Rating Stars & Verified Badge */}
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <RatingStars rating={item.rating} size={13} showNumber={false} showCount={false} />
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#C89B3C]/10 border border-[#C89B3C]/25 text-[10px] font-sans text-[#C89B3C] tracking-wide font-medium">
                      <CheckCircle2 className="w-3 h-3 text-[#C89B3C] shrink-0" />
                      <span>Verified Patron</span>
                    </span>
                  </div>

                  {/* Testimonial Quote */}
                  <p
                    className="text-[#F8F4EE]/90 leading-relaxed mb-6"
                    style={{
                      fontFamily: 'var(--font-cormorant), serif',
                      fontSize: '1.2rem',
                      fontStyle: 'italic',
                      lineHeight: 1.6,
                    }}
                  >
                    &ldquo;{item.text}&rdquo;
                  </p>
                </div>

                {/* Footer: Author Info & Collected Product Preview */}
                <div className="pt-5 border-t border-[#C89B3C]/15">
                  <div className="flex items-center justify-between gap-3">
                    {/* Author Details */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C89B3C] to-[#8B5A3C] text-[#F8F4EE] font-sans font-semibold text-xs flex items-center justify-center shadow-md shrink-0">
                        {item.initials}
                      </div>

                      <div>
                        <h4
                          className="text-[#F8F4EE] leading-tight font-medium"
                          style={{
                            fontFamily: 'var(--font-cormorant), serif',
                            fontSize: '1.15rem',
                          }}
                        >
                          {item.name}
                        </h4>
                        <span className="block text-[#C89B3C] text-[10px] font-sans tracking-wide font-medium">
                          {item.location}
                        </span>
                      </div>
                    </div>

                    {/* Collected Product Thumbnail */}
                    <Link
                      href={item.productHref}
                      className="group/product flex items-center gap-2 p-1.5 rounded-lg bg-[#241710] hover:bg-[#C89B3C]/20 border border-[#C89B3C]/25 hover:border-[#C89B3C] transition-all duration-200"
                      title={`Collected: ${item.product}`}
                    >
                      <div className="relative w-8 h-8 rounded-md overflow-hidden shrink-0 border border-[#C89B3C]/30">
                        <Image
                          src={item.productImage}
                          alt={item.product}
                          fill
                          className="object-cover transition-transform duration-300 group-hover/product:scale-110"
                        />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Carousel Navigation Bar */}
        <div className="flex items-center justify-center gap-6 mt-12 sm:mt-14">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevPage}
            className="w-10 h-10 rounded-full border border-[#C89B3C]/30 hover:border-[#C89B3C] bg-[#2B1D15] hover:bg-[#C89B3C] text-[#C89B3C] hover:text-[#241710] flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer"
            aria-label="Previous testimonials page"
          >
            <ChevronLeft size={16} />
          </motion.button>

          {/* Pagination Indicators */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  i === page ? 'w-8 h-2 bg-[#C89B3C]' : 'w-2 h-2 bg-[#C89B3C]/25 hover:bg-[#C89B3C]/60'
                }`}
                aria-label={`Go to testimonials page ${i + 1}`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextPage}
            className="w-10 h-10 rounded-full border border-[#C89B3C]/30 hover:border-[#C89B3C] bg-[#2B1D15] hover:bg-[#C89B3C] text-[#C89B3C] hover:text-[#241710] flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer"
            aria-label="Next testimonials page"
          >
            <ChevronRight size={16} />
          </motion.button>
        </div>

        {/* Trust & Artisan Promise Badges */}
        <div className="mt-16 sm:mt-20 pt-10 border-t border-[#C89B3C]/15 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C89B3C]/10 border border-[#C89B3C]/25 text-[#C89B3C] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h5 className="font-sans font-medium text-xs text-[#F8F4EE] uppercase tracking-wider">100% Certified Handcrafted</h5>
              <p className="font-sans text-[11px] text-[#F8F4EE]/65">Zero factory moulds; authentic Bengal soil</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C89B3C]/10 border border-[#C89B3C]/25 text-[#C89B3C] flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h5 className="font-sans font-medium text-xs text-[#F8F4EE] uppercase tracking-wider">Direct Fair Remittance</h5>
              <p className="font-sans text-[11px] text-[#F8F4EE]/65">Empowering 240+ rural master families</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C89B3C]/10 border border-[#C89B3C]/25 text-[#C89B3C] flex items-center justify-center shrink-0">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h5 className="font-sans font-medium text-xs text-[#F8F4EE] uppercase tracking-wider">Museum-Grade Packaging</h5>
              <p className="font-sans text-[11px] text-[#F8F4EE]/65">Archival protection & insured delivery</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
