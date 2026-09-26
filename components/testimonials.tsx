'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { RatingStars } from '@/components/ui/rating-stars'

const testimonials = [
  {
    name: 'Priya Krishnamurthy',
    location: 'Mumbai',
    rating: 5,
    text: 'Rupakar is unlike anything I have experienced. My Madhubani vase arrived wrapped in handmade paper with a letter from the artisan herself. I wept. This is not shopping — this is a profound cultural exchange.',
    product: 'Madhubani Terracotta Vase',
  },
  {
    name: 'Arjun Mehta',
    location: 'Delhi',
    rating: 5,
    text: 'The quality of their terracotta pieces is breathtaking. You can feel the hours of work in every curve, every painted line. My home has been transformed into a heritage gallery. Worth every rupee.',
    product: 'Tribal Painted Bowl Set',
  },
  {
    name: 'Sneha Patel',
    location: 'Bengaluru',
    rating: 5,
    text: 'I bought a set of Pattachitra plates as a wedding gift. The couple called me crying — they had never seen anything so beautiful. The packaging alone deserves an award. Rupakar is India\'s finest.',
    product: 'Pattachitra Wall Plates',
  },
  {
    name: 'Rahul Sharma',
    location: 'Jaipur',
    rating: 5,
    text: 'As someone who grew up watching potters work in my village, seeing Rupakar honor these crafts with such dignity and luxury is deeply moving. They are doing god\'s work.',
    product: 'Rajasthani Figurine Set',
  },
]

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [current, setCurrent] = useState(0)

  const next = () => setCurrent((c) => (c + 1) % testimonials.length)
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)

  const t = testimonials[current]

  return (
    <section ref={ref} className="py-28 bg-[#4A2C1A] overflow-hidden relative">
      {/* Large decorative quotes */}
      <div
        className="absolute top-8 left-12 text-[#C89B3C]/10 leading-none select-none"
        style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '20rem', lineHeight: 0.8 }}
        aria-hidden="true"
      >
        &ldquo;
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10" aria-live="polite">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <div className="ornament-divider mb-5">
            <span className="text-[#C89B3C] font-sans text-[10px] tracking-[0.3em] uppercase">
              Voices of Patrons
            </span>
          </div>
          <h2
            className="text-[#F8F4EE] leading-tight"
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 300,
            }}
          >
            What Our Community Says
          </h2>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Stars */}
            <div className="flex justify-center mb-6">
              <RatingStars rating={t.rating || 5} size={15} showNumber={false} showCount={false} />
            </div>

            {/* Quote */}
            <p
              className="text-[#F8F4EE]/85 mb-8 max-w-3xl mx-auto leading-relaxed"
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
                fontStyle: 'italic',
                lineHeight: 1.6,
              }}
            >
              &ldquo;{t.text}&rdquo;
            </p>

            {/* Author */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-px bg-[#C89B3C] mb-3" />
              <span
                className="text-[#F8F4EE]"
                style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.1rem', fontWeight: 500 }}
              >
                {t.name}
              </span>
              <span className="text-[#C89B3C] font-sans text-[9px] tracking-[0.2em] uppercase">
                {t.location} · Purchased: {t.product}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-8 mt-12">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prev}
            className="w-10 h-10 border border-[#C89B3C]/40 hover:border-[#C89B3C] flex items-center justify-center text-[#F8F4EE]/60 hover:text-[#C89B3C] transition-all duration-300"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={16} />
          </motion.button>

          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`transition-all duration-300 ${i === current ? 'w-6 h-1.5 bg-[#C89B3C]' : 'w-1.5 h-1.5 bg-[#F8F4EE]/30'}`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={next}
            className="w-10 h-10 border border-[#C89B3C]/40 hover:border-[#C89B3C] flex items-center justify-center text-[#F8F4EE]/60 hover:text-[#C89B3C] transition-all duration-300"
            aria-label="Next testimonial"
          >
            <ChevronRight size={16} />
          </motion.button>
        </div>
      </div>
    </section>
  )
}
