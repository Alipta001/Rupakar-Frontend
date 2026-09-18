'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function TermsPage() {
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
              Terms of Service
            </h1>

            <div className="space-y-8 text-[#5B4B3F] font-sans text-sm leading-relaxed">
              <p className="text-[#1E1A17] font-semibold">Last Updated: January 2024</p>

              <div>
                <h2
                  className="text-[#1E1A17] mb-4"
                  style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.5rem' }}
                >
                  Acceptance of Terms
                </h2>
                <p>
                  By accessing and using the Rupakar website, you accept and agree to be bound by the terms and provision
                  of this agreement.
                </p>
              </div>

              <div>
                <h2
                  className="text-[#1E1A17] mb-4"
                  style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.5rem' }}
                >
                  Product Information
                </h2>
                <p>
                  We strive to provide accurate product descriptions and pricing. However, we do not warrant that product
                  descriptions, pricing, or other content on our website is accurate, complete, or error-free.
                </p>
              </div>

              <div>
                <h2
                  className="text-[#1E1A17] mb-4"
                  style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.5rem' }}
                >
                  Limitations of Liability
                </h2>
                <p>
                  Rupakar shall not be liable for any indirect, incidental, special, or consequential damages arising from
                  your use of the website or products.
                </p>
              </div>

              <div>
                <h2
                  className="text-[#1E1A17] mb-4"
                  style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.5rem' }}
                >
                  User Conduct
                </h2>
                <p>
                  You agree not to engage in any conduct that restricts or inhibits anyone&apos;s use or enjoyment of the website,
                  including harassing, threatening, or abusing others.
                </p>
              </div>

              <div>
                <h2
                  className="text-[#1E1A17] mb-4"
                  style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.5rem' }}
                >
                  Intellectual Property
                </h2>
                <p>
                  All content on the Rupakar website, including text, graphics, logos, and images, is protected by copyright
                  and other intellectual property laws.
                </p>
              </div>

              <div>
                <h2
                  className="text-[#1E1A17] mb-4"
                  style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.5rem' }}
                >
                  Changes to Terms
                </h2>
                <p>
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting
                  to the website.
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
                  For questions about these terms, please contact us at hello@rupakar.com.
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
