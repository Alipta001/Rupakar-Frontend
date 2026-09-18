'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function FAQPage() {
  const faqs = [
    {
      q: 'How long does shipping take?',
      a: 'Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business days.',
    },
    {
      q: 'Do you offer international shipping?',
      a: 'Yes, we ship worldwide. International shipping times and costs vary by location.',
    },
    {
      q: 'What is your return policy?',
      a: 'We offer 15-day easy returns on all items. Items must be unused and in original packaging.',
    },
    {
      q: 'How should I care for my handcrafted pieces?',
      a: 'Each product comes with specific care instructions. Generally, avoid direct sunlight and handle with care.',
    },
    {
      q: 'Are your products authentic?',
      a: 'Yes, 100% authentic. All items are handcrafted directly by artisans. We authenticate each piece.',
    },
    {
      q: 'How can I support the artisans?',
      a: 'Every purchase directly supports artisan families. We ensure fair wages and direct partnerships.',
    },
  ]

  return (
    <main>
      <Navbar />
      <section className="bg-[#F8F4EE] pt-32">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className="text-[#1E1A17] mb-12 text-center"
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: '3rem',
                fontWeight: 300,
              }}
            >
              Frequently Asked Questions
            </h1>

            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-[#D4C4B0] pb-6"
                >
                  <h3
                    className="text-[#1E1A17] mb-3"
                    style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.2rem' }}
                  >
                    {faq.q}
                  </h3>
                  <p className="text-[#5B4B3F] font-sans text-sm leading-relaxed">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
