// 'use client'

// import Link from 'next/link'
// import { motion } from 'framer-motion'
// import { Instagram, Twitter, Youtube, Facebook, ArrowRight } from 'lucide-react'

// const footerLinks = {
//   Shop: [
//     { label: 'Terracotta', href: '/collections/terracotta' },
//     { label: 'Folk Art', href: '/collections/folk-art' },
//     { label: 'Home Decor', href: '/collections/decor' },
//     { label: 'Jewelry', href: '/collections/jewelry' },
//     { label: 'All Collections', href: '/collections' },
//   ],
//   Discover: [
//     { label: 'Our Artisans', href: '/artisans' },
//     { label: 'About Us', href: '/about' },
//     { label: 'Heritage', href: '/heritage' },
//     { label: 'Stories', href: '/stories' },
//   ],
//   Support: [
//     { label: 'Shipping & Delivery', href: '/shipping' },
//     { label: 'Returns & Exchanges', href: '/returns' },
//     { label: 'Care Instructions', href: '/care' },
//     { label: 'Contact Us', href: '/contact' },
//     { label: 'FAQ', href: '/faq' },
//   ],
// }

// const socials = [
//   { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
//   { Icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
//   { Icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
//   { Icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
// ]

// export default function Footer() {
//   return (
//     <footer className="bg-[#3A2418] text-[#F8F4EE]/70">
//       {/* Top section */}
//       <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

//           {/* Brand */}
//           <div className="lg:col-span-2">
//             <Link href="/">
//               <div className="mb-6">
//                 <span
//                   className="block text-[#F8F4EE] tracking-[0.3em] uppercase text-2xl"
//                   style={{ fontFamily: 'var(--font-italiana), serif' }}
//                 >
//                   Rupakar
//                 </span>
//                 <span className="block text-[#C89B3C] tracking-[0.35em] uppercase text-[9px] mt-1 font-sans">
//                   Artisan Marketplace
//                 </span>
//               </div>
//             </Link>

//             <p className="font-sans text-xs leading-relaxed mb-6 max-w-xs" style={{ letterSpacing: '0.04em' }}>
//               A luxury marketplace celebrating India&apos;s finest handcrafted heritage. Every purchase supports
//               an artisan family and preserves an ancient tradition for future generations.
//             </p>

//             {/* Social links */}
//             <div className="flex items-center gap-4">
//               {socials.map(({ Icon, href, label }) => (
//                 <motion.a
//                   key={label}
//                   href={href}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   whileHover={{ scale: 1.15, color: '#C89B3C' }}
//                   className="text-[#F8F4EE]/40 hover:text-[#C89B3C] transition-colors duration-300"
//                   aria-label={label}
//                 >
//                   <Icon size={16} strokeWidth={1.5} />
//                 </motion.a>
//               ))}
//             </div>
//           </div>

//           {/* Links */}
//           {Object.entries(footerLinks).map(([heading, links]) => (
//             <div key={heading}>
//               <h3 className="text-[#F8F4EE] font-sans text-[10px] tracking-[0.25em] uppercase mb-6">
//                 {heading}
//               </h3>
//               <ul className="space-y-3">
//                 {links.map((link) => (
//                   <li key={link.label}>
//                     <Link
//                       href={link.href}
//                       className="luxury-underline font-sans text-xs hover:text-[#C89B3C] transition-colors duration-300"
//                       style={{ letterSpacing: '0.04em' }}
//                     >
//                       {link.label}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>

//         {/* Divider */}
//         <div className="flex items-center gap-4 mb-8">
//           <div className="flex-1 h-px bg-[#C89B3C]/20" />
//           <div
//             className="text-[#C89B3C]/30 text-2xl"
//             style={{ fontFamily: 'var(--font-italiana), serif' }}
//             aria-hidden="true"
//           >
//             ✦
//           </div>
//           <div className="flex-1 h-px bg-[#C89B3C]/20" />
//         </div>

//         {/* Bottom bar */}
//         <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//           <p className="font-sans text-[10px] tracking-[0.1em]" style={{ color: 'rgba(248,244,238,0.3)' }}>
//             © 2024 Rupakar. All rights reserved. Made with love for India&apos;s artisans.
//           </p>
//           <div className="flex items-center gap-6">
//             {[
//               { label: 'Privacy Policy', href: '/privacy' },
//               { label: 'Terms of Service', href: '/terms' },
//               { label: 'FAQ', href: '/faq' },
//             ].map((item) => (
//               <Link
//                 key={item.label}
//                 href={item.href}
//                 className="font-sans text-[10px] tracking-[0.1em] hover:text-[#C89B3C] transition-colors duration-300"
//                 style={{ color: 'rgba(248,244,238,0.3)' }}
//               >
//                 {item.label}
//               </Link>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Oversized brand name */}
//       <div className="border-t border-[#C89B3C]/10 overflow-hidden">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
//           <span
//             className="text-[#C89B3C]/8 leading-none select-none"
//             style={{ fontFamily: 'var(--font-italiana), serif', fontSize: 'clamp(4rem, 12vw, 8rem)' }}
//             aria-hidden="true"
//           >
//             Rupakar
//           </span>
//           <div className="text-right hidden md:block">
//             <p className="text-[#C89B3C]/40 font-sans text-[9px] tracking-[0.2em] uppercase">
//               Handcrafted with Soul
//             </p>
//           </div>
//         </div>
//       </div>
//     </footer>
//   )
// }





'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  ArrowUpRight,
} from 'lucide-react'

const footerLinks = {
  Shop: [
    { label: 'Terracotta', href: '/collections/terracotta' },
    { label: 'Folk Art', href: '/collections/folk-art' },
    { label: 'Home Decor', href: '/collections/decor' },
    { label: 'Jewelry', href: '/collections/jewelry' },
    { label: 'All Collections', href: '/collections' },
  ],

  Discover: [
    { label: 'Our Artisans', href: '/artisans' },
    { label: 'About Us', href: '/about' },
    { label: 'Heritage', href: '/heritage' },
    { label: 'Stories', href: '/stories' },
  ],

  Support: [
    { label: 'Shipping & Delivery', href: '/shipping' },
    { label: 'Returns & Exchanges', href: '/returns' },
    { label: 'Care Instructions', href: '/care' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
  ],
}

const socials = [
  {
    Icon: Instagram,
    href: 'https://instagram.com',
    label: 'Instagram',
  },
  {
    Icon: Twitter,
    href: 'https://twitter.com',
    label: 'Twitter',
  },
  {
    Icon: Youtube,
    href: 'https://youtube.com',
    label: 'YouTube',
  },
  {
    Icon: Facebook,
    href: 'https://facebook.com',
    label: 'Facebook',
  },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#C89B3C]/10 bg-[#241710] text-[#F8F4EE]/70">
      
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#C89B3C]/[0.03] blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-24 pb-14 sm:px-8 lg:px-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 gap-14 pb-5 md:grid-cols-2 lg:grid-cols-5">
          
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.3 }}
              >
                <span
                  className="block text-3xl uppercase tracking-[0.32em] text-[#F8F4EE]"
                  style={{
                    fontFamily: 'var(--font-italiana), serif',
                  }}
                >
                  Rupakar
                </span>

                <span className="mt-2 block text-[9px] uppercase tracking-[0.38em] text-[#C89B3C]">
                  Artisan Marketplace
                </span>
              </motion.div>
            </Link>

            {/* Description */}
            <p
              className="mt-7 max-w-sm text-sm leading-relaxed text-[#F8F4EE]/55"
              style={{
                letterSpacing: '0.03em',
              }}
            >
              A curated luxury marketplace celebrating India&apos;s finest
              handcrafted heritage. Every purchase empowers artisan families
              and preserves centuries of traditional craftsmanship.
            </p>

            {/* Newsletter */}
            <div className="mt-8">
              <div className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#C89B3C]">
                Join Our Journal
              </div>

              <form className="group flex w-full max-w-md items-center border border-[#C89B3C]/20 bg-[#2B1D15]/70 backdrop-blur-sm transition-all duration-300 focus-within:border-[#C89B3C]/50">
                
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="h-14 flex-1 bg-transparent px-5 text-sm text-[#F8F4EE] placeholder:text-[#F8F4EE]/30 focus:outline-none"
                />

                <button
                  type="submit"
                  className="flex h-14 w-14 items-center justify-center border-l border-[#C89B3C]/10 text-[#C89B3C] transition-all duration-300 hover:bg-[#C89B3C] hover:text-[#1E1A17]"
                  aria-label="Subscribe"
                >
                  <ArrowUpRight size={18} strokeWidth={1.5} />
                </button>
              </form>
            </div>

            {/* Socials */}
            <div className="mt-8 flex items-center gap-4">
              {socials.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{
                    y: -3,
                    scale: 1.08,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C89B3C]/15 bg-[#2A1B14]/60 text-[#F8F4EE]/45 backdrop-blur-sm transition-all duration-300 hover:border-[#C89B3C]/40 hover:text-[#C89B3C]"
                  aria-label={label}
                >
                  <Icon size={16} strokeWidth={1.7} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="mb-7 text-[10px] uppercase tracking-[0.28em] text-[#F8F4EE]">
                {heading}
              </h3>

              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center text-sm text-[#F8F4EE]/55 transition-all duration-300 hover:text-[#C89B3C]"
                    >
                      <span className="relative">
                        {link.label}

                        <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#C89B3C] transition-all duration-300 group-hover:w-full" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Middle Divider */}
        <div className="flex items-center gap-5 py-3">
          <div className="h-px flex-1 bg-[#C89B3C]/10" />

          <div
            className="select-none text-2xl text-[#C89B3C]/25"
            style={{
              fontFamily: 'var(--font-italiana), serif',
            }}
            aria-hidden="true"
          >
            ✦
          </div>

          <div className="h-px flex-1 bg-[#C89B3C]/10" />
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          
          {/* Copyright */}
          <p className="text-[11px] tracking-[0.08em] text-[#F8F4EE]/30">
            © 2026 Rupakar. Preserving India&apos;s artisan legacy through
            timeless craftsmanship.
          </p>

          {/* Policies */}
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
            {[
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
              { label: 'Shipping Policy', href: '/shipping' },
              { label: 'FAQ', href: '/faq' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[11px] tracking-[0.08em] text-[#F8F4EE]/30 transition-colors duration-300 hover:text-[#C89B3C]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}