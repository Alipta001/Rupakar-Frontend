'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, useInView } from 'framer-motion'
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts, type Product } from '@/lib/products-api'
import { BestSellersSkeleton } from '@/components/skeletons'

function ProductCard({ product, index }: { product: Product; index: number }) {
  const [wishlist, setWishlist] = useState(false)
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group"
    >
      <Link href={`/products/${product.id}`}>
        {/* Image Container */}
        <div className="relative overflow-hidden bg-[#EFE3D3] aspect-[3/4] mb-4">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-110"
          />

          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-[#1E1A17]/0 group-hover:bg-[#1E1A17]/30 transition-all duration-500" />

          {/* Badge */}
          <div
            className="absolute top-4 left-4 px-3 py-1"
            style={{ backgroundColor: product.badgeColor }}
          >
            <span className="text-[#F8F4EE] font-sans text-[8px] tracking-[0.15em] uppercase">
              {product.badge}
            </span>
          </div>

          {/* Wishlist */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.preventDefault(); setWishlist(!wishlist) }}
            className="absolute top-4 right-4 w-8 h-8 bg-[#F8F4EE]/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label={wishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              size={14}
              strokeWidth={1.5}
              className={wishlist ? 'fill-[#7A1F1F] text-[#7A1F1F]' : 'text-[#1E1A17]'}
            />
          </motion.button>

          {/* Quick actions */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <div className="flex">
              <button
                onClick={(e) => { e.preventDefault(); router.push(`/products/${product.id}?action=add-to-cart`) }}
                className="flex-1 bg-[#1E1A17] text-[#F8F4EE] py-3 font-sans text-[9px] tracking-[0.2em] uppercase hover:bg-[#C89B3C] hover:text-[#1E1A17] transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingBag size={12} />
                Add to Bag
              </button>
              <button
                onClick={(e) => { e.preventDefault(); router.push(`/products/${product.id}`) }}
                className="w-12 bg-[#3A2418] text-[#F8F4EE] flex items-center justify-center hover:bg-[#C89B3C] hover:text-[#1E1A17] transition-colors duration-300"
              >
                <Eye size={14} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="text-[#C89B3C] font-sans text-[9px] tracking-[0.2em] uppercase mb-1">
            {product.craft}
          </div>
          <h3
            className="text-[#1E1A17] leading-tight mb-2 group-hover:text-[#6B3E26] transition-colors duration-300"
            style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.1rem', fontWeight: 500 }}
          >
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, j) => (
                <Star
                  key={j}
                  size={10}
                  className={j < Math.floor(product.rating) ? 'fill-[#C89B3C] text-[#C89B3C]' : 'text-[#D4C4B0]'}
                />
              ))}
            </div>
            <span className="text-[#5B4B3F] font-sans text-[9px]">({product.reviews})</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[#1E1A17]"
              style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.2rem' }}
            >
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-[#5B4B3F] font-sans text-xs line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function BestSellers() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { data: products = [], isLoading, isFetching } = useQuery<Product[]>({
    queryKey: ['products', 'best-sellers'],
    queryFn: ({ signal }) => fetchProducts({ limit: 5 }, { signal }),
    staleTime: 60 * 1000,
  })

  return (
    <section className="py-28 bg-[#EFE3D3]" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between mb-14 gap-4"
        >
          <div>
            <div className="ornament-divider justify-start mb-4">
              <span className="text-[#C89B3C] font-sans text-[10px] tracking-[0.3em] uppercase">
                Most Loved
              </span>
            </div>
            <h2
              className="text-[#1E1A17] leading-tight"
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                fontWeight: 300,
              }}
            >
              Best Sellers
            </h2>
          </div>

          <Link
            href="/collections"
            className="luxury-underline text-[#6B3E26] hover:text-[#C89B3C] font-sans text-xs tracking-[0.2em] uppercase transition-colors duration-300 flex items-center gap-2"
          >
            View All Products
          </Link>
        </motion.div>

        {(isLoading || isFetching) && products.length === 0 ? (
          <BestSellersSkeleton />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
