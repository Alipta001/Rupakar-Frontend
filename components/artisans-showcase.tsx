'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin, Award } from 'lucide-react'

const artisans = [
  {
    name: 'Ramkumar Prajapati',
    craft: 'Terracotta Master Potter',
    region: 'Jaipur, Rajasthan',
    experience: '35 years',
    speciality: 'Wheel-thrown ceremonial vessels & royal figurines',
    image: '/images/artisan-portrait.jpg',
    bio: 'A sixth-generation potter whose family has served the royal courts of Rajasthan for over two centuries. Ramkumar\'s work blends ancient Rajasthani court aesthetics with his own deeply personal vision. His figurines have been exhibited in museums in Paris, London, and New York.',
    awards: ['National Award for Master Craftsperson 2019', 'State Award Rajasthan 2015'],
  },
  {
    name: 'Savitri Devi',
    craft: 'Madhubani Folk Painter',
    region: 'Mithila, Bihar',
    experience: '47 years',
    speciality: 'Mythological narratives on clay surfaces',
    image: '/images/gallery-1.jpg',
    bio: 'Savitri learnt the sacred art of Madhubani painting from her grandmother — a tradition passed exclusively through women for centuries. Today she leads a cooperative of 24 women artists in her village, ensuring this UNESCO-recognized tradition lives on.',
    awards: ['Padma Shri 2020', 'National Crafts Council Recognition 2016'],
  },
  {
    name: 'Ananta Mohanty',
    craft: 'Pattachitra Painter',
    region: 'Raghurajpur, Odisha',
    experience: '28 years',
    speciality: 'Epic narrative panels on terracotta',
    image: '/images/gallery-2.jpg',
    bio: 'From India\'s only heritage craft village where every family is an artist, Ananta creates breathtaking Pattachitra works that narrate the great epics of Hinduism across large terracotta surfaces. His works are permanent installations in the Odisha State Museum.',
    awards: ['State Award Odisha 2018', 'Crafts Council India Recognition'],
  },
  {
    name: 'Mohanlal Kumhar',
    craft: 'Functional Pottery Maker',
    region: 'Khurja, Uttar Pradesh',
    experience: '40 years',
    speciality: 'Sacred vessels, diyas and ceremonial pieces',
    image: '/images/gallery-3.jpg',
    bio: 'Working in India\'s pottery capital, Mohanlal has mastered the art of creating functional sacred objects that merge beauty with daily devotion. His workshop employs 14 village women and has produced over 50,000 handmade diyas over four decades.',
    awards: ['UP State Crafts Award 2017', 'Craft Mark Certified'],
  },
]

export default function ArtisansShowcase() {
  return (
    <div className="min-h-screen bg-[#F8F4EE] pt-20">
      {/* Hero */}
      <div className="relative h-80 overflow-hidden">
        <Image src="/images/artisan-portrait.jpg" alt="Artisans" fill className="object-cover object-top" />
        <div className="absolute inset-0 bg-[#1E1A17]/75" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <div className="ornament-divider mb-4">
            <span className="text-[#C89B3C] font-sans text-[10px] tracking-[0.3em] uppercase">The Makers</span>
          </div>
          <h1
            className="text-[#F8F4EE] mb-3"
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontWeight: 300,
            }}
          >
            Our Artisans
          </h1>
          <p
            className="text-[#F8F4EE]/60 max-w-lg font-sans text-sm"
            style={{ letterSpacing: '0.04em' }}
          >
            The hands that carry India forward
          </p>
        </div>
      </div>

      {/* Artisan cards */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="space-y-20">
          {artisans.map((artisan, i) => (
            <motion.div
              key={artisan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9 }}
              className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'md:grid-flow-dense' : ''}`}
            >
              {/* Image */}
              <div className={`relative aspect-[4/5] overflow-hidden ${i % 2 === 1 ? 'md:col-start-2' : ''}`}>
                <Image
                  src={artisan.image}
                  alt={artisan.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1A17]/40 to-transparent" />
                <div className="absolute bottom-5 left-5 bg-[#C89B3C] px-4 py-2">
                  <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#1E1A17]">
                    {artisan.experience}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className={i % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}>
                <div className="text-[#C89B3C] font-sans text-[10px] tracking-[0.3em] uppercase mb-3">
                  {artisan.craft}
                </div>
                <h2
                  className="text-[#1E1A17] leading-tight mb-4"
                  style={{
                    fontFamily: 'var(--font-cormorant), serif',
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    fontWeight: 400,
                    fontStyle: 'italic',
                  }}
                >
                  {artisan.name}
                </h2>

                <div className="flex items-center gap-2 text-[#5B4B3F] mb-6">
                  <MapPin size={12} className="text-[#C89B3C]" strokeWidth={1.5} />
                  <span className="font-sans text-xs">{artisan.region}</span>
                </div>

                <p
                  className="text-[#3A2A20] mb-3"
                  style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.15rem', fontStyle: 'italic' }}
                >
                  Speciality: {artisan.speciality}
                </p>

                <p className="text-[#5B4B3F] font-sans text-sm leading-relaxed mb-6" style={{ letterSpacing: '0.03em' }}>
                  {artisan.bio}
                </p>

                {/* Awards */}
                <div className="space-y-2">
                  {artisan.awards.map((award) => (
                    <div key={award} className="flex items-start gap-2">
                      <Award size={12} className="text-[#C89B3C] mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                      <span className="text-[#5B4B3F] font-sans text-[11px]" style={{ letterSpacing: '0.04em' }}>
                        {award}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
