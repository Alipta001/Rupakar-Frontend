'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

type AuthShellProps = {
  eyebrow: string
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  children: ReactNode
}

export function AuthShell({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt,
  children,
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[#F8F4EE] text-[#1E1A17]">
      <Navbar />

      <section className="relative overflow-hidden bg-[#F8F4EE] pt-20 sm:pt-24 pb-12 sm:pb-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(200,155,60,0.18),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(107,62,38,0.16),_transparent_16%)]" />

        <div className="pointer-events-none absolute left-1/2 top-16 h-96 w-96 -translate-x-1/2 rounded-full bg-[#C89B3C]/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-[#C89B3C]/12 shadow-[0_40px_120px_-48px_rgba(0,0,0,0.35)]"
            >
              <div className="relative h-[280px] sm:h-[460px] md:h-[640px]">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />

                <div className="absolute inset-0 bg-gradient-to-b from-[#1E1A17]/90 via-[#1E1A17]/40 to-transparent" />

                <div className="absolute top-0 left-0 right-0 px-6 sm:px-8 pt-8 sm:pt-12 text-white sm:px-12">
                  <span className="mb-3 sm:mb-4 block font-sans text-[10px] uppercase tracking-[0.35em] text-[#F8F4EE]/75">
                    {eyebrow}
                  </span>

                  <h2 className="mb-3 sm:mb-5 font-[var(--font-cormorant)] text-3xl sm:text-4xl md:text-5xl leading-tight tracking-[-0.03em]">
                    {title}
                  </h2>

                  <p className="max-w-xl font-sans text-xs sm:text-sm leading-6 sm:leading-7 text-[#F8F4EE]/90">
                    {description}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.1,
              }}
              className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-[#D4C4B0]/65 bg-white/85 p-6 sm:p-10 lg:p-14 shadow-[0_30px_90px_-40px_rgba(0,0,0,0.18)] backdrop-blur-xl"
            >
              <div className="absolute -right-20 top-10 h-32 w-32 rounded-full bg-[#C89B3C]/10 blur-3xl" />

              <div className="absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r from-[#C89B3C] via-[#B7792B] to-[#C89B3C]" />

              {children}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}