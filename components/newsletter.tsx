'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function Newsletter() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const yBg = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <section ref={ref} className="relative py-40 overflow-hidden">
      {/* Parallax background */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 scale-110">
        <Image
          src="/images/heritage-craft.jpg"
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[#1E1A17]/85" />
      </motion.div>

      {/* Decorative gold border */}
      <div className="absolute inset-8 border border-[#C89B3C]/20 pointer-events-none hidden md:block" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="ornament-divider mb-6">
            <span className="text-[#C89B3C] font-sans text-[10px] tracking-[0.3em] uppercase">
              Join the Circle
            </span>
          </div>

          <h2
            className="text-[#F8F4EE] leading-tight mb-4"
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 300,
              lineHeight: 1.1,
            }}
          >
            Stories, Launches<br />
            & <em className="text-[#C89B3C]" style={{ fontStyle: 'italic' }}>Sacred Finds</em>
          </h2>

          <p className="text-[#F8F4EE]/60 font-sans text-sm leading-relaxed mb-10" style={{ letterSpacing: '0.03em' }}>
            Be the first to discover new artisan collections, hear the stories behind each craft,
            and receive exclusive access to limited edition releases.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border border-[#C89B3C] px-8 py-6"
            >
              <p
                className="text-[#C89B3C]"
                style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.4rem', fontStyle: 'italic' }}
              >
                Welcome to the Rupakar circle.
              </p>
              <p className="text-[#F8F4EE]/60 font-sans text-xs mt-2 tracking-[0.1em]">
                Expect stories that move you.
              </p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-0 max-w-xl mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 bg-[#F8F4EE]/10 border border-[#C89B3C]/40 text-[#F8F4EE] placeholder-[#F8F4EE]/30 px-6 py-4 font-sans text-sm focus:outline-none focus:border-[#C89B3C] transition-colors duration-300"
                style={{ letterSpacing: '0.05em' }}
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group bg-[#C89B3C] hover:bg-[#B7792B] text-[#1E1A17] px-8 py-4 font-sans text-xs tracking-[0.2em] uppercase transition-colors duration-300 flex items-center gap-2 justify-center"
              >
                Subscribe
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.form>
          )}

          <p className="text-[#F8F4EE]/30 font-sans text-[10px] tracking-[0.1em] mt-4">
            No spam. Unsubscribe anytime. We respect your privacy as much as we respect the artisans.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
