// 'use client'

// import { useRef } from 'react'
// import Image from 'next/image'
// import Link from 'next/link'
// import { motion, useScroll, useTransform } from 'framer-motion'
// import { ArrowDown, ArrowRight } from 'lucide-react'

// export default function Hero() {
//   const ref = useRef<HTMLDivElement>(null)
//   const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

//   const yMain = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
//   const ySecondary = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
//   const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
//   const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

//   const containerVariants = {
//     hidden: {},
//     visible: {
//       transition: { staggerChildren: 0.15, delayChildren: 0.4 },
//     },
//   }

//   const fadeUp = {
//     hidden: { opacity: 0, y: 40 },
//     visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.25, 0.46, 0.45, 0.94] } },
//   }

//   const fadeIn = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { duration: 1.2 } },
//   }

//   return (
//     <section ref={ref} className="relative overflow-hidden bg-[#1E1A17]" style={{ minHeight: 'calc(100dvh - 20px)' }}
// >
//       {/* Background main image with parallax */}
//       <motion.div className="absolute inset-0" style={{ scale }}>
//         <Image
//           src="/images/hero-pottery.jpg"
//           alt="Master artisan crafting terracotta pottery"
//           fill
//           priority
//           className="object-cover object-center"
//         />
//         <div className="absolute inset-0 bg-gradient-to-r from-[#1E1A17]/90 via-[#1E1A17]/50 to-[#1E1A17]/20" />
//         <div className="absolute inset-0 bg-gradient-to-t from-[#1E1A17] via-transparent to-transparent" />
//       </motion.div>

//       {/* Content */}
//       <motion.div
//         style={{ y: yMain, opacity }}
//         className="relative z-10 min-h-screen flex items-center"
//       >
//         <div className="max-w-7xl mx-auto px-6 w-full pt-24 pb-20">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[calc(100vh-96px)]">

//             {/* Left — editorial text */}
//             <motion.div
//               variants={containerVariants}
//               initial="hidden"
//               animate="visible"
//               className="lg:col-span-7 flex flex-col justify-center"
//             >
//               <motion.div variants={fadeUp} className="ornament-divider justify-start mb-6">
//                 <span className="text-[#C89B3C] font-sans text-[10px] tracking-[0.3em] uppercase">
//                   Est. in Tradition
//                 </span>
//                 <div className="w-16 h-px bg-[#C89B3C] opacity-60" />
//                 <span className="text-[#C89B3C] font-sans text-[10px] tracking-[0.3em] uppercase">
//                   India&apos;s Heritage
//                 </span>
//               </motion.div>

//               <motion.h1
//                 variants={fadeUp}
//                 className="text-[#F8F4EE] leading-none mb-4"
//                 style={{
//                   fontFamily: 'var(--font-cormorant), serif',
//                   fontSize: 'clamp(4rem, 9vw, 8.5rem)',
//                   fontWeight: 300,
//                   letterSpacing: '-0.02em',
//                   lineHeight: 0.95,
//                 }}
//               >
//                 The Soul
//                 <br />
//                 <em
//                   className="text-[#C89B3C]"
//                   style={{ fontStyle: 'italic', fontWeight: 400 }}
//                 >
//                   of Earth,
//                 </em>
//                 <br />
//                 Shaped by
//                 <br />
//                 <span
//                   style={{ fontFamily: 'var(--font-italiana), serif', fontSize: '0.9em' }}
//                 >
//                   Hands.
//                 </span>
//               </motion.h1>

//               <motion.p
//                 variants={fadeUp}
//                 className="text-[#F8F4EE]/60 font-sans text-sm leading-relaxed max-w-md mt-6 mb-8"
//                 style={{ letterSpacing: '0.03em' }}
//               >
//                 Each piece in our curated collection carries the warmth of the artisan&apos;s touch —
//                 centuries of Indian craft tradition, brought home to you.
//               </motion.p>

//               <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
//                 <Link href="/collections">
//                   <motion.div
//                     whileHover={{ scale: 1.03 }}
//                     whileTap={{ scale: 0.97 }}
//                     className="group relative inline-flex items-center gap-3 bg-[#C89B3C] text-[#1E1A17] px-8 py-4 font-sans text-xs tracking-[0.2em] uppercase overflow-hidden"
//                   >
//                     <span className="relative z-10">Explore Collections</span>
//                     <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform" />
//                     <motion.div
//                       className="absolute inset-0 bg-[#B7792B]"
//                       initial={{ x: '-100%' }}
//                       whileHover={{ x: 0 }}
//                       transition={{ duration: 0.35 }}
//                     />
//                   </motion.div>
//                 </Link>

//                 <Link
//                   href="/artisans"
//                   className="inline-flex items-center gap-2 text-[#F8F4EE]/70 hover:text-[#C89B3C] font-sans text-xs tracking-[0.2em] uppercase transition-colors duration-300 luxury-underline"
//                 >
//                   Meet Artisans
//                 </Link>
//               </motion.div>

//               {/* Stats */}
//               <motion.div variants={fadeIn} className="flex items-center gap-10 mt-14">
//                 {[
//                   { num: '500+', label: 'Master Artisans' },
//                   { num: '2000+', label: 'Unique Pieces' },
//                   { num: '18', label: 'Craft Traditions' },
//                 ].map((s) => (
//                   <div key={s.label}>
//                     <div
//                       className="text-[#C89B3C] leading-none"
//                       style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '2rem', fontWeight: 400 }}
//                     >
//                       {s.num}
//                     </div>
//                     <div className="text-[#F8F4EE]/40 font-sans text-[9px] tracking-[0.15em] uppercase mt-1">
//                       {s.label}
//                     </div>
//                   </div>
//                 ))}
//               </motion.div>
//             </motion.div>

//             {/* Right — floating image composition */}
//             <div className="lg:col-span-5 relative h-[500px] lg:h-[680px] hidden lg:block">
//               {/* Main image */}
//               <motion.div
//                 initial={{ opacity: 0, x: 60 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 1.2, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
//                 style={{ y: ySecondary }}
//                 className="absolute right-0 top-8 w-72 h-[420px] overflow-hidden border border-[#C89B3C]/20"
//               >
//                 <Image
//                   src="/images/hero-artisan.jpg"
//                   alt="Indian artisan creating handcrafted pottery"
//                   fill
//                   className="object-cover img-zoom-wrap"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-[#1E1A17]/50 to-transparent" />
//               </motion.div>

//               {/* Secondary floating card */}
//               <motion.div
//                 initial={{ opacity: 0, y: 40 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 1, delay: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
//                 className="absolute left-4 bottom-12 w-52 h-64 overflow-hidden border border-[#C89B3C]/30"
//               >
//                 <Image
//                   src="/images/product-vase.jpg"
//                   alt="Handcrafted terracotta vase"
//                   fill
//                   className="object-cover"
//                 />
//                 <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#1E1A17] to-transparent">
//                   <div className="text-[#C89B3C] font-sans text-[9px] tracking-[0.2em] uppercase mb-1">
//                     New Arrival
//                   </div>
//                   <div
//                     className="text-[#F8F4EE] text-sm"
//                     style={{ fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic' }}
//                   >
//                     Madhubani Vase
//                   </div>
//                 </div>
//               </motion.div>

//               {/* Gold accent badge */}
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.8, delay: 1.4 }}
//                 className="absolute right-4 bottom-28 w-20 h-20 border border-[#C89B3C] flex flex-col items-center justify-center text-center"
//               >
//                 <span className="text-[#C89B3C] font-sans text-[8px] tracking-[0.2em] uppercase leading-tight">
//                   Hand<br />Crafted
//                 </span>
//                 <div className="w-4 h-px bg-[#C89B3C] my-1" />
//                 <span className="text-[#C89B3C] font-sans text-[8px] tracking-[0.1em]">
//                   Since 1947
//                 </span>
//               </motion.div>
//             </div>
//           </div>
//         </div>
//       </motion.div>

//       {/* Scroll indicator */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 2, duration: 1 }}
//         style={{ opacity }}
//         className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
//       >
//         <span className="text-[#F8F4EE]/40 font-sans text-[9px] tracking-[0.3em] uppercase">Scroll</span>
//         <motion.div
//           animate={{ y: [0, 8, 0] }}
//           transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
//         >
//           <ArrowDown size={14} className="text-[#C89B3C]" strokeWidth={1.5} />
//         </motion.div>
//       </motion.div>
//     </section>
//   )
// }



'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowRight } from 'lucide-react'

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Smooth parallax
  const yMain = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const ySecondary = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])

  // Fade out on scroll
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  // Slight cinematic zoom
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05])

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.35,
      },
    },
  }

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: 'easeOut' as const,
      },
    },
  }

  const fadeIn = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.2,
      },
    },
  }

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden bg-[#1E1A17]"
    >
      {/* Background */}
      <motion.div
        style={{ scale }}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src="/images/hero-pottery.jpg"
          alt="Master artisan crafting terracotta pottery"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E1A17]/90 via-[#1E1A17]/60 to-[#1E1A17]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1A17] via-[#1E1A17]/20 to-transparent" />
      </motion.div>

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light bg-[url('/images/noise.png')]" />

      {/* Hero Content */}
      <motion.div
        style={{
          y: yMain,
          opacity: heroOpacity,
        }}
        className="relative z-10"
      >
        <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 pt-28 pb-16 sm:px-8 lg:px-10">
          <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12">
            
            {/* LEFT CONTENT */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col justify-center lg:col-span-7"
            >
              {/* Top Divider */}
              <motion.div
                variants={fadeUp}
                className="mb-7 flex items-center gap-4"
              >
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#C89B3C]">
                  Est. in Tradition
                </span>

                <div className="h-px w-14 bg-[#C89B3C]/60" />

                <span className="text-[10px] uppercase tracking-[0.35em] text-[#C89B3C]">
                  India&apos;s Heritage
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h1
                variants={fadeUp}
                className="max-w-4xl text-[#F8F4EE]"
                style={{
                  fontFamily: 'var(--font-cormorant), serif',
                  fontSize: 'clamp(3rem, 11vw, 8.7rem)',
                  fontWeight: 300,
                  letterSpacing: '-0.04em',
                  lineHeight: 0.9,
                }}
              >
                The Soul
                <br />

                <em
                  className="text-[#C89B3C]"
                  style={{
                    fontStyle: 'italic',
                    fontWeight: 400,
                  }}
                >
                  of Earth,
                </em>

                <br />
                Shaped by
                <br />

                <span
                  style={{
                    fontFamily: 'var(--font-italiana), serif',
                    fontSize: '0.92em',
                  }}
                >
                  Hands.
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={fadeUp}
                className="mt-8 max-w-md text-sm leading-relaxed text-[#F8F4EE]/65 sm:text-[15px]"
                style={{
                  letterSpacing: '0.03em',
                }}
              >
                Each piece in our curated collection carries the warmth of the
                artisan&apos;s touch — centuries of Indian craft tradition,
                brought into contemporary living.
              </motion.p>

              {/* Buttons */}
              <motion.div
                variants={fadeUp}
                className="mt-10 flex flex-wrap items-center gap-5"
              >
                <Link href="/collections">
                  <motion.div
                    whileHover={{
                      scale: 1.03,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    className="group relative inline-flex cursor-pointer items-center gap-3 overflow-hidden bg-[#C89B3C] px-8 py-4 text-[11px] uppercase tracking-[0.24em] text-[#1E1A17]"
                  >
                    <span className="relative z-10">
                      Explore Collections
                    </span>

                    <ArrowRight
                      size={14}
                      className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                    />

                    <motion.div
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.35 }}
                      className="absolute inset-0 bg-[#B7792B]"
                    />
                  </motion.div>
                </Link>

                <Link
                  href="/artisans"
                  className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-[#F8F4EE]/70 transition-all duration-300 hover:text-[#C89B3C]"
                >
                  <span className="relative">
                    Meet Artisans

                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#C89B3C] transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={fadeIn}
                className="mt-12 sm:mt-16 flex flex-wrap items-center gap-x-6 sm:gap-x-12 gap-y-6 sm:gap-y-8"
              >
                {[
                  {
                    num: '500+',
                    label: 'Master Artisans',
                  },
                  {
                    num: '2000+',
                    label: 'Unique Pieces',
                  },
                  {
                    num: '18',
                    label: 'Craft Traditions',
                  },
                ].map((s) => (
                  <div key={s.label}>
                    <div
                      className="leading-none text-[#C89B3C]"
                      style={{
                        fontFamily: 'var(--font-cormorant), serif',
                        fontSize: '2.1rem',
                        fontWeight: 400,
                      }}
                    >
                      {s.num}
                    </div>

                    <div className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#F8F4EE]/40">
                      {s.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* RIGHT VISUALS */}
            <div className="relative hidden h-[650px] lg:col-span-5 lg:block">
              
              {/* Main Floating Image */}
              <motion.div
                initial={{
                  opacity: 0,
                  x: 60,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 1.2,
                  delay: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                style={{
                  y: ySecondary,
                }}
                className="absolute right-0 top-6 h-[440px] w-[300px] overflow-hidden border border-[#C89B3C]/20 shadow-[0_20px_80px_rgba(0,0,0,0.45)]"
              >
                <Image
                  src="/images/hero-artisan.jpg"
                  alt="Indian artisan creating handcrafted pottery"
                  fill
                  quality={100}
                  sizes="(max-width: 1024px) 0vw, 300px"
                  className="object-cover transition-transform duration-[2500ms] ease-out hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1A17]/55 to-transparent" />
              </motion.div>

              {/* Small Card */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 1,
                  delay: 1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="absolute bottom-10 left-0 h-64 w-52 overflow-hidden border border-[#C89B3C]/30 bg-[#2A2521]/80 backdrop-blur-md"
              >
                <Image
                  src="/images/product-vase.jpg"
                  alt="Handcrafted terracotta vase"
                  fill
                  quality={100}
                  sizes="208px"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1A17] via-[#1E1A17]/50 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="mb-1 text-[9px] uppercase tracking-[0.22em] text-[#C89B3C]">
                    New Arrival
                  </div>

                  <div
                    className="text-lg text-[#F8F4EE]"
                    style={{
                      fontFamily: 'var(--font-cormorant), serif',
                      fontStyle: 'italic',
                    }}
                  >
                    Madhubani Vase
                  </div>
                </div>
              </motion.div>

              {/* Gold Badge */}
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.8,
                  delay: 1.4,
                }}
                className="absolute bottom-28 right-4 flex h-20 w-20 flex-col items-center justify-center border border-[#C89B3C]/70 bg-[#1E1A17]/60 backdrop-blur-md"
              >
                <span className="text-center text-[8px] uppercase leading-tight tracking-[0.2em] text-[#C89B3C]">
                  Hand
                  <br />
                  Crafted
                </span>

                <div className="my-1 h-px w-4 bg-[#C89B3C]" />

                <span className="text-[8px] tracking-[0.1em] text-[#C89B3C]">
                  Since 1947
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 2,
          duration: 1,
        }}
        style={{
          opacity: heroOpacity,
        }}
        className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-[9px] uppercase tracking-[0.32em] text-[#F8F4EE]/40">
          Scroll
        </span>

        <motion.div
          animate={{
            y: [0, 8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <ArrowDown
            size={14}
            strokeWidth={1.5}
            className="text-[#C89B3C]"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}