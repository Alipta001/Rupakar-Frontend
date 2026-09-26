'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, useInView } from 'framer-motion'
import { Heart, ShoppingBag, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts, type Product } from '@/lib/products-api'
import { BestSellersSkeleton } from '@/components/skeletons'
import { RatingStars } from '@/components/ui/rating-stars'

function CarouselProductCard({ product, index }: { product: Product; index: number }) {
  const [wishlist, setWishlist] = useState(false)
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4), ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-[175px] sm:w-[220px] md:w-[250px] lg:w-[260px] flex-shrink-0 snap-start group"
    >
      <div className="flex flex-col h-full bg-white border border-[#D4C4B0]/60 hover:border-[#C89B3C]/70 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md">
        {/* Image Container */}
        <Link href={`/products/${product.slug || product.id}`} className="block relative overflow-hidden bg-[#EFE3D3] aspect-[3/4]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 175px, (max-width: 768px) 220px, 260px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          />

          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-[#1E1A17]/0 group-hover:bg-[#1E1A17]/25 transition-all duration-300 pointer-events-none" />

          {/* Badge */}
          {product.badge && (
            <div
              className="absolute top-3 left-3 px-2.5 py-1 rounded-sm shadow-sm"
              style={{ backgroundColor: product.badgeColor || '#C89B3C' }}
            >
              <span className="text-[#F8F4EE] font-sans text-[8px] font-semibold tracking-[0.14em] uppercase">
                {product.badge}
              </span>
            </div>
          )}

          {/* Wishlist Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setWishlist(!wishlist)
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all duration-200 shadow-sm hover:bg-white"
            aria-label={wishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              size={14}
              strokeWidth={1.75}
              className={wishlist ? 'fill-[#7A1F1F] text-[#7A1F1F]' : 'text-[#1E1A17]'}
            />
          </motion.button>

          {/* Quick Action Overlay (Slide-up on Desktop Hover) */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <div className="flex border-t border-white/20 shadow-md">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  router.push(`/products/${product.slug || product.id}?action=add-to-cart`)
                }}
                className="flex-1 bg-[#1E1A17] text-[#F8F4EE] py-2.5 font-sans text-[9px] tracking-[0.18em] uppercase hover:bg-[#C89B3C] hover:text-[#1E1A17] transition-colors duration-200 flex items-center justify-center gap-1.5"
              >
                <ShoppingBag size={12} />
                <span>Add to Bag</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  router.push(`/products/${product.slug || product.id}`)
                }}
                className="w-10 bg-[#3A2418] text-[#F8F4EE] flex items-center justify-center hover:bg-[#C89B3C] hover:text-[#1E1A17] transition-colors duration-200"
                aria-label="View product"
              >
                <Eye size={13} strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </Link>

        {/* Info */}
        <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
          <div>
            <div className="text-[#C89B3C] font-sans text-[9px] font-semibold tracking-[0.18em] uppercase mb-1">
              {product.craft}
            </div>
            <Link href={`/products/${product.slug || product.id}`} className="block">
              <h3
                className="text-[#1E1A17] leading-snug group-hover:text-[#6B3E26] transition-colors line-clamp-1"
                style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.08rem', fontWeight: 500 }}
                title={product.name}
              >
                {product.name}
              </h3>
            </Link>
          </div>

          <div className="space-y-1.5 pt-1 border-t border-[#F0ECE4]">
            {/* Redesigned Rating */}
            <RatingStars
              rating={product.rating}
              reviews={product.reviews}
              size={10}
              showNumber
            />

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span
                className="text-[#1E1A17] font-semibold"
                style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.25rem' }}
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
        </div>
      </div>
    </motion.div>
  )
}

export default function BestSellers() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Maximum 20 products, preferring 15
  const { data: products = [], isLoading, isFetching } = useQuery<Product[]>({
    queryKey: ['products', 'best-sellers'],
    queryFn: ({ signal }) => fetchProducts({ limit: 15 }, { signal }),
    staleTime: 60 * 1000,
  })

  // Strictly cap at 15-20 products (prefer 15)
  const bestSellers = products.slice(0, 15)

  const checkScrollability = useCallback(() => {
    if (!scrollContainerRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)
  }, [])

  useEffect(() => {
    checkScrollability()
    window.addEventListener('resize', checkScrollability)
    return () => window.removeEventListener('resize', checkScrollability)
  }, [checkScrollability, bestSellers.length])

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    const container = scrollContainerRef.current
    const cardWidth = container.firstElementChild?.clientWidth || 250
    const scrollAmount = (cardWidth + 24) * 2 // Scroll two cards at a time
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  // Mouse Drag to Scroll for Desktop
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollStart, setScrollStart] = useState(0)

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return
    setIsMouseDown(true)
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
    setScrollStart(scrollContainerRef.current.scrollLeft)
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !scrollContainerRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    scrollContainerRef.current.scrollLeft = scrollStart - walk
  }

  const stopDragging = () => {
    setIsMouseDown(false)
  }

  return (
    <section className="py-16 sm:py-24 bg-[#EFE3D3]" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-12 gap-4"
        >
          <div>
            <div className="ornament-divider justify-start mb-3">
              <span className="text-[#C89B3C] font-sans text-[10px] tracking-[0.3em] uppercase font-semibold">
                Most Loved
              </span>
            </div>
            <h2
              className="text-[#1E1A17] leading-tight"
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                fontWeight: 400,
              }}
            >
              Best Sellers
            </h2>
          </div>

          {/* Navigation Controls & View All Link */}
          <div className="flex items-center gap-4 sm:gap-6 self-end sm:self-auto">
            <Link
              href="/collections"
              className="luxury-underline text-[#6B3E26] hover:text-[#C89B3C] font-sans text-xs tracking-[0.18em] uppercase transition-colors duration-300 flex items-center gap-1.5"
            >
              <span>View All</span>
              <span className="text-[10px]">→</span>
            </Link>

            {/* Desktop Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                className="w-9 h-9 rounded-full border border-[#D4C4B0] bg-white flex items-center justify-center text-[#1E1A17] hover:border-[#C89B3C] hover:text-[#C89B3C] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                aria-label="Previous products"
              >
                <ChevronLeft size={17} strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                className="w-9 h-9 rounded-full border border-[#D4C4B0] bg-white flex items-center justify-center text-[#1E1A17] hover:border-[#C89B3C] hover:text-[#C89B3C] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                aria-label="Next products"
              >
                <ChevronRight size={17} strokeWidth={2} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Carousel Content */}
        {(isLoading || isFetching) && bestSellers.length === 0 ? (
          <BestSellersSkeleton />
        ) : (
          <div className="relative group/carousel">
            {/* Left Floating Arrow (Desktop) */}
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 border border-[#D4C4B0] shadow-lg items-center justify-center text-[#1E1A17] hover:bg-[#C89B3C] hover:text-white hover:border-[#C89B3C] transition-all"
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} strokeWidth={2} />
              </button>
            )}

            {/* Horizontal Scroll Track */}
            <div
              ref={scrollContainerRef}
              onScroll={checkScrollability}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={stopDragging}
              onMouseLeave={stopDragging}
              className={`flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-4 pt-1 px-1 ${
                isMouseDown ? 'cursor-grabbing select-none' : 'cursor-grab'
              }`}
              style={{
                WebkitOverflowScrolling: 'touch',
                overscrollBehaviorX: 'contain',
              }}
            >
              {bestSellers.map((product, i) => (
                <CarouselProductCard key={product.id || product.slug || i} product={product} index={i} />
              ))}
            </div>

            {/* Right Floating Arrow (Desktop) */}
            {canScrollRight && (
              <button
                type="button"
                onClick={() => handleScroll('right')}
                className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 border border-[#D4C4B0] shadow-lg items-center justify-center text-[#1E1A17] hover:bg-[#C89B3C] hover:text-white hover:border-[#C89B3C] transition-all"
                aria-label="Scroll right"
              >
                <ChevronRight size={20} strokeWidth={2} />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
