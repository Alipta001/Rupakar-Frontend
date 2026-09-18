'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>

            <div className="space-y-8 text-[#5B4B3F] font-sans text-sm leading-relaxed">
              <p className="text-[#1E1A17] font-semibold">Last Updated: January 2024</p>

              <div>
                <h2
                  className="text-[#1E1A17] mb-4"
                  style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.5rem' }}
                >
                  Information We Collect
                </h2>
                <p>
                  We collect information you provide directly to us, such as your name, email address, shipping address,
                  phone number, and payment information when you make a purchase.
                </p>
              </div>

              <div>
                <h2
                  className="text-[#1E1A17] mb-4"
                  style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.5rem' }}
                >
                  How We Use Your Information
                </h2>
                <ul className="space-y-2">
                  <li>• Processing and fulfilling your orders</li>
                  <li>• Sending order confirmations and shipping updates</li>
                  <li>• Responding to your inquiries</li>
                  <li>• Improving our website and services</li>
                </ul>
              </div>

              <div>
                <h2
                  className="text-[#1E1A17] mb-4"
                  style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.5rem' }}
                >
                  Data Security
                </h2>
                <p>
                  We take data security seriously. Your personal information is encrypted and protected using industry-standard
                  security protocols. However, no method of transmission is completely secure.
                </p>
              </div>

              <div>
                <h2
                  className="text-[#1E1A17] mb-4"
                  style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.5rem' }}
                >
                  Cookies
                </h2>
                <p>
                  We use cookies to enhance your browsing experience. You can control cookie settings through your browser preferences.
                </p>
              </div>

              <div>
                <h2
                  className="text-[#1E1A17] mb-4"
                  style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.5rem' }}
                >
                  Contact Us
                </h2>
                <p>
                  For questions about our privacy policy, please contact us at hello@rupakar.com.
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
