'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function ShippingPage() {
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
              className="text-[#1E1A17] mb-8"
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: '3rem',
                fontWeight: 300,
              }}
            >
              Shipping & Delivery
            </h1>

            <div className="space-y-8 text-[#5B4B3F] font-sans text-sm leading-relaxed">
              <div>
                <h2
                  className="text-[#1E1A17] mb-4"
                  style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.5rem' }}
                >
                  Shipping Methods
                </h2>
                <ul className="space-y-2">
                  <li><strong>Standard Shipping:</strong> 5-7 business days — Free on orders over ₹1,500</li>
                  <li><strong>Express Shipping:</strong> 2-3 business days — ₹299</li>
                  <li><strong>Overnight:</strong> Next business day — ₹499</li>
                </ul>
              </div>

              <div>
                <h2
                  className="text-[#1E1A17] mb-4"
                  style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.5rem' }}
                >
                  Domestic Shipping
                </h2>
                <p>
                  We ship to all locations across India. Handcrafted items are carefully packaged to ensure they arrive
                  in perfect condition. Track your order in real-time using the tracking number provided in your confirmation
                  email.
                </p>
              </div>

              <div>
                <h2
                  className="text-[#1E1A17] mb-4"
                  style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.5rem' }}
                >
                  International Shipping
                </h2>
                <p>
                  We ship worldwide with customs documentation included. International shipping times vary from 10-21 days
                  depending on destination. Additional customs duties may apply.
                </p>
              </div>

              <div>
                <h2
                  className="text-[#1E1A17] mb-4"
                  style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.5rem' }}
                >
                  Packaging
                </h2>
                <p>
                  Each item is individually wrapped in tissue and protective padding. Boxes are sealed with our signature
                  tape. We use eco-friendly materials whenever possible.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
