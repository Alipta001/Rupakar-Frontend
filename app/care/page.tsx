'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function CarePage() {
  const items = [
    {
      title: 'Terracotta Pottery',
      instructions: [
        'Wipe with a soft, dry cloth to remove dust',
        'Avoid direct exposure to strong sunlight for prolonged periods',
        'For decorative use, keep away from extreme moisture',
        'Handle with care to prevent breakage',
      ],
    },
    {
      title: 'Folk Art Paintings',
      instructions: [
        'Keep away from high humidity and moisture',
        'Avoid direct sunlight to prevent color fading',
        'Dust gently with a soft brush',
        'Hang in a temperature-controlled environment',
      ],
    },
    {
      title: 'Handwoven Textiles',
      instructions: [
        'Hand wash in cool water with mild detergent',
        'Avoid bleaching and harsh chemicals',
        'Dry flat in shade to maintain shape',
        'Store in a clean, dry place away from direct sunlight',
      ],
    },
    {
      title: 'Brass & Metal Items',
      instructions: [
        'Use a soft cloth to wipe away dust',
        'Avoid harsh chemicals and abrasive materials',
        'For polishing, use a brass cleaner following product instructions',
        'Store in a dry place to prevent tarnishing',
      ],
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
              className="text-[#1E1A17] mb-8"
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: '3rem',
                fontWeight: 300,
              }}
            >
              Care Instructions
            </h1>

            <div className="space-y-12">
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="border-l-2 border-[#C89B3C] pl-6"
                >
                  <h2
                    className="text-[#1E1A17] mb-4"
                    style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.5rem' }}
                  >
                    {item.title}
                  </h2>
                  <ul className="space-y-2 text-[#5B4B3F] font-sans text-sm">
                    {item.instructions.map((instruction, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <span className="text-[#C89B3C] font-bold mt-0.5">•</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 pt-12 border-t border-[#D4C4B0]">
              <p className="text-[#5B4B3F] font-sans text-sm">
                Each product comes with detailed care instructions specific to the item. Please follow these guidelines to
                preserve your handcrafted piece for years to come.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
