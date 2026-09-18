'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function StoriesPage() {
  const stories = [
    {
      title: 'The Madhubani Masters of Mithila',
      excerpt:
        'In the villages of Mithila, Bihar, women have been painting sacred stories on mud walls for centuries. These intricate patterns tell tales of love, harvest, and devotion.',
      author: 'Savitri Devi & Family',
      read: '5 min',
    },
    {
      title: 'From Clay to Art: The Potters of Khurja',
      excerpt:
        'Khurja, known as the pottery capital of India, is home to a thriving ceramic tradition. Discover how master potters transform river clay into functional art.',
      author: 'Mohanlal Kumhar',
      read: '7 min',
    },
    {
      title: 'Preserving Pattachitra: Odisha&apos;s Living Canvas',
      excerpt:
        'The narrative paintings of Pattachitra are a UNESCO-recognized art form. Meet the artists keeping this centuries-old tradition alive in Raghurajpur.',
      author: 'Ananta Mohanty',
      read: '6 min',
    },
    {
      title: 'The Weavers of Bengal: Threads of Tradition',
      excerpt:
        'On handlooms passed down through generations, Bengali weavers create some of India&apos;s most exquisite textiles. Learn their stories and craft.',
      author: 'Bengali Weaver Collective',
      read: '8 min',
    },
  ]

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
              Artisan Stories
            </h1>
            <p className="text-center text-[#5B4B3F] font-sans text-sm mb-16 max-w-2xl mx-auto">
              Read the stories of the master artisans behind every Rupakar piece. From generations of craft to personal triumphs,
              these are the voices of India&apos;s heritage keepers.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {stories.map((story, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="border border-[#D4C4B0] p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                >
                  <h3
                    className="text-[#1E1A17] mb-3"
                    style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.3rem' }}
                  >
                    {story.title}
                  </h3>
                  <p className="text-[#5B4B3F] font-sans text-sm mb-4 line-clamp-3">{story.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#1E1A17] font-sans text-xs font-semibold">{story.author}</p>
                      <p className="text-[#5B4B3F] font-sans text-[10px]">{story.read} read</p>
                    </div>
                    <Link
                      href="#"
                      className="text-[#C89B3C] hover:underline font-semibold text-xs"
                    >
                      Read →
                    </Link>
                  </div>
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
