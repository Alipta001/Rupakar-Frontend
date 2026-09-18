'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function ReturnsPage() {
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
              Returns & Exchanges
            </h1>

            <div className="space-y-8 text-[#5B4B3F] font-sans text-sm leading-relaxed">
              <div>
                <h2
                  className="text-[#1E1A17] mb-4"
                  style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.5rem' }}
                >
                  15-Day Easy Return Policy
                </h2>
                <p>
                  We want you to be completely satisfied with your purchase. If you&apos;re not happy, you can return or
                  exchange your item within 15 days of purchase for a full refund.
                </p>
              </div>

              <div>
                <h2
                  className="text-[#1E1A17] mb-4"
                  style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.5rem' }}
                >
                  Return Conditions
                </h2>
                <ul className="space-y-2">
                  <li>• Item must be unused and in original condition</li>
                  <li>• Original packaging must be intact</li>
                  <li>• All tags and documentation included</li>
                  <li>• Return shipping is free for defective items</li>
                </ul>
              </div>

              <div>
                <h2
                  className="text-[#1E1A17] mb-4"
                  style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.5rem' }}
                >
                  How to Return
                </h2>
                <ol className="space-y-2">
                  <li>1. Contact us at hello@rupakar.com with your order number</li>
                  <li>2. We&apos;ll provide you with a prepaid return label</li>
                  <li>3. Ship the item back to us using the provided label</li>
                  <li>4. Refund will be processed within 5-7 days of receipt</li>
                </ol>
              </div>

              <div>
                <h2
                  className="text-[#1E1A17] mb-4"
                  style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.5rem' }}
                >
                  Non-Returnable Items
                </h2>
                <ul className="space-y-2">
                  <li>• Custom or personalized orders</li>
                  <li>• Items used or damaged by customer</li>
                  <li>• Final sale items (marked at purchase)</li>
                </ul>
              </div>

              <div className="bg-[#EFE3D3] p-6 rounded border border-[#D4C4B0]">
                <h3 className="text-[#1E1A17] mb-2 font-semibold">Need Help?</h3>
                <p>
                  Contact our support team at hello@rupakar.com or call +91 98765 43210 for assistance.
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
