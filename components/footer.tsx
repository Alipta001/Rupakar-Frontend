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
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8 lg:px-10 pt-16 sm:pt-24 pb-14">
        {/* Top Grid */}
        <div className="grid grid-cols-1 gap-10 sm:gap-14 pb-5 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="sm:col-span-2">
            <Link href="/" className="inline-block">
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.3 }}>
                <span
                  className="block text-2xl sm:text-3xl uppercase tracking-[0.25em] sm:tracking-[0.32em] text-[#F8F4EE]"
                  style={{
                    fontFamily: 'var(--font-italiana), serif',
                  }}
                >
                  Rupakar
                </span>

                <span className="mt-2 block text-[9px] uppercase tracking-[0.35em] text-[#C89B3C]">
                  Artisan Marketplace
                </span>
              </motion.div>
            </Link>

            {/* Description */}
            <p
              className="mt-5 sm:mt-7 max-w-sm text-xs sm:text-sm leading-relaxed text-[#F8F4EE]/55"
              style={{
                letterSpacing: '0.03em',
              }}
            >
              A curated luxury marketplace celebrating India&apos;s finest
              handcrafted heritage. Every purchase empowers artisan families
              and preserves centuries of traditional craftsmanship.
            </p>

            {/* Newsletter */}
            <div className="mt-6 sm:mt-8">
              <div className="mb-3 sm:mb-4 text-[10px] uppercase tracking-[0.25em] text-[#C89B3C]">
                Join Our Journal
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="group flex w-full max-w-md items-center border border-[#C89B3C]/20 bg-[#2B1D15]/70 backdrop-blur-sm transition-all duration-300 focus-within:border-[#C89B3C]/50">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="h-12 sm:h-14 flex-1 bg-transparent px-4 text-xs sm:text-sm text-[#F8F4EE] placeholder:text-[#F8F4EE]/30 focus:outline-none"
                />

                <button
                  type="submit"
                  className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center border-l border-[#C89B3C]/10 text-[#C89B3C] transition-all duration-300 hover:bg-[#C89B3C] hover:text-[#1E1A17]"
                  aria-label="Subscribe"
                >
                  <ArrowUpRight size={18} strokeWidth={1.5} />
                </button>
              </form>
            </div>

            {/* Socials */}
            <div className="mt-6 sm:mt-8 flex items-center gap-4">
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
            <div key={heading} className="pt-2 sm:pt-0">
              <h3 className="mb-4 sm:mb-7 text-[10px] uppercase tracking-[0.25em] text-[#F8F4EE]">
                {heading}
              </h3>

              <ul className="space-y-3 sm:space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center text-xs sm:text-sm text-[#F8F4EE]/55 transition-all duration-300 hover:text-[#C89B3C]"
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
            className="select-none text-xl sm:text-2xl text-[#C89B3C]/25"
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
        <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between">
          {/* Copyright */}
          <p className="text-[10px] sm:text-[11px] tracking-[0.05em] text-[#F8F4EE]/30">
            © 2026 Rupakar. Preserving India&apos;s artisan legacy through timeless craftsmanship.
          </p>

          {/* Policies */}
          <div className="flex flex-wrap items-center gap-x-5 sm:gap-x-7 gap-y-2">
            {[
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
              { label: 'Shipping Policy', href: '/shipping' },
              { label: 'FAQ', href: '/faq' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[10px] sm:text-[11px] tracking-[0.05em] text-[#F8F4EE]/30 transition-colors duration-300 hover:text-[#C89B3C]"
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