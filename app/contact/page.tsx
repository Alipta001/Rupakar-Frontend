'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function ContactPage() {
  return (
    <main>
      <Navbar />
      <section className="bg-[#F8F4EE] pt-32">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className="text-[#1E1A17] mb-6 text-center"
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: '3rem',
                fontWeight: 300,
              }}
            >
              Get in Touch
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
              {[
                {
                  Icon: Mail,
                  title: 'Email',
                  value: 'hello@rupakar.com',
                  href: 'mailto:hello@rupakar.com',
                },
                {
                  Icon: Phone,
                  title: 'Phone',
                  value: '+91 98765 43210',
                  href: 'tel:+919876543210',
                },
                {
                  Icon: MapPin,
                  title: 'Address',
                  value: 'New Delhi, India',
                  href: '#',
                },
              ].map(({ Icon, title, value, href }) => (
                <motion.div key={title} className="text-center">
                  <Icon size={32} className="text-[#C89B3C] mx-auto mb-4" strokeWidth={1.5} />
                  <h3
                    className="text-[#1E1A17] mb-2"
                    style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.3rem' }}
                  >
                    {title}
                  </h3>
                  <Link
                    href={href}
                    className="text-[#5B4B3F] hover:text-[#C89B3C] font-sans text-sm transition-colors"
                  >
                    {value}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="bg-white p-8 border border-[#D4C4B0]">
              <h2
                className="text-[#1E1A17] mb-6"
                style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.8rem' }}
              >
                Send us a Message
              </h2>
              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="px-4 py-3 border border-[#D4C4B0] bg-[#F8F4EE] text-[#1E1A17] font-sans text-sm focus:outline-none focus:border-[#C89B3C] transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="px-4 py-3 border border-[#D4C4B0] bg-[#F8F4EE] text-[#1E1A17] font-sans text-sm focus:outline-none focus:border-[#C89B3C] transition-colors"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full px-4 py-3 border border-[#D4C4B0] bg-[#F8F4EE] text-[#1E1A17] font-sans text-sm focus:outline-none focus:border-[#C89B3C] transition-colors"
                />
                <textarea
                  placeholder="Your message..."
                  rows={6}
                  className="w-full px-4 py-3 border border-[#D4C4B0] bg-[#F8F4EE] text-[#1E1A17] font-sans text-sm focus:outline-none focus:border-[#C89B3C] transition-colors resize-none"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="bg-[#1E1A17] text-[#F8F4EE] px-8 py-3 font-sans text-xs tracking-[0.2em] uppercase hover:bg-[#6B3E26] transition-colors"
                >
                  Send Message
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
