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

export function CarouselProductCard({ product, index }: { product: Product; index: number }) {
  const [wishlist, setWishlist] = useState(false)
  const router = useRouter()
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4), ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-[185px] sm:w-[225px] md:w-[255px] lg:w-[270px] flex-shrink-0 snap-start group"
    >
      <div className="flex flex-col h-full bg-[#FAF7F2] border border-[#D4C4B0]/75 hover:border-[#C89B3C] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5 shadow-[0_4px_20px_rgba(30,26,23,0.04)] hover:shadow-[0_22px_45px_rgba(107,62,38,0.15)]">
        {/* Image Container */}
        <Link
          href={`/products/${product.slug || product.id}`}
          className="block relative overflow-hidden bg-[#EFE3D3] aspect-[3/4] cursor-pointer"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 185px, (max-width: 768px) 225px, 270px"
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-108"
          />

          {/* Cinematic subtle warm vignette on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A120B]/75 via-[#1A120B]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Heritage / Best Seller Badge */}
          {product.badge ? (
            <div className="absolute top-3 left-3 z-10 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1E1A17]/85 backdrop-blur-md border border-[#C89B3C]/40 text-[#F8F4EE] text-[8.5px] font-sans font-semibold tracking-[0.16em] uppercase shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C89B3C] animate-pulse" />
                {product.badge}
              </span>
            </div>
          ) : discountPercent > 0 ? (
            <div className="absolute top-3 left-3 z-10 pointer-events-none">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#7A1F1F]/90 backdrop-blur-md text-[#F8F4EE] text-[8px] font-sans font-semibold tracking-wider uppercase shadow-md">
                {discountPercent}% OFF
              </span>
            </div>
          ) : null}

          {/* Wishlist Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setWishlist(!wishlist)
            }}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[#FAF7F2]/90 hover:bg-white backdrop-blur-md border border-[#D4C4B0]/80 hover:border-[#C89B3C] flex items-center justify-center transition-all duration-300 shadow-sm"
            aria-label={wishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              size={14}
              strokeWidth={1.8}
              className={`transition-colors duration-200 ${
                wishlist ? 'fill-[#7A1F1F] text-[#7A1F1F]' : 'text-[#1E1A17] hover:text-[#7A1F1F]'
              }`}
            />
          </motion.button>

          {/* Floating Luxury Quick Action Dock */}
          <div className="absolute bottom-3 left-3 right-3 z-10 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                router.push(`/products/${product.slug || product.id}?action=add-to-cart`)
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-[#241710]/95 hover:bg-[#C89B3C] text-[#F8F4EE] hover:text-[#171311] backdrop-blur-md border border-[#C89B3C]/40 text-[9px] font-sans font-semibold tracking-[0.16em] uppercase transition-all duration-300 flex items-center justify-center gap-1.5 shadow-lg active:scale-95"
            >
              <ShoppingBag size={12} strokeWidth={2} />
              <span>Add to Bag</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                router.push(`/products/${product.slug || product.id}`)
              }}
              className="w-8 h-8 rounded-xl bg-[#241710]/95 hover:bg-[#C89B3C] text-[#F8F4EE] hover:text-[#171311] backdrop-blur-md border border-[#C89B3C]/40 flex items-center justify-center transition-all duration-300 shadow-lg active:scale-95"
              aria-label="View product details"
              title="View details"
            >
              <Eye size={13} strokeWidth={2} />
            </button>
          </div>
        </Link>

        {/* Product Details Info */}
        <div className="p-4 flex flex-col flex-1 justify-between gap-2.5">
          <div>
            {/* Craft & Region Heritage Label */}
            <div className="flex items-center justify-between gap-1 text-[#C89B3C] font-sans text-[9px] font-bold tracking-[0.2em] uppercase mb-1">
              <span className="truncate">{product.craft}</span>
              {product.region && (
                <span className="text-[#8C7A6B] font-normal text-[8.5px] lowercase tracking-normal truncate hidden sm:inline">
                  · {product.region}
                </span>
              )}
            </div>

            {/* Product Title */}
            <Link href={`/products/${product.slug || product.id}`} className="block">
              <h3
                className="text-[#1E1A17] leading-snug group-hover:text-[#6B3E26] transition-colors line-clamp-1"
                style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.14rem', fontWeight: 500 }}
                title={product.name}
              >
                {product.name}
              </h3>
            </Link>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#E8DFD3]">
            {/* Rating Stars */}
            <RatingStars
              rating={product.rating}
              reviews={product.reviews}
              size={11}
              showNumber
            />

            {/* Price & Savings */}
            <div className="flex items-baseline justify-between gap-1">
              <div className="flex items-baseline gap-2">
                <span
                  className="text-[#1E1A17] font-semibold tracking-tight"
                  style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.25rem' }}
                >
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-[#8C7A6B] font-sans text-xs line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {discountPercent > 0 && (
                <span className="text-[9px] font-sans font-semibold text-[#2E6B3E] bg-[#2E6B3E]/10 px-1.5 py-0.5 rounded">
                  {discountPercent}% OFF
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
                className="w-9 h-9 rounded-full border border-[#D4C4B0] bg-[#FAF7F2] flex items-center justify-center text-[#1E1A17] hover:border-[#C89B3C] hover:text-[#C89B3C] hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                aria-label="Previous products"
              >
                <ChevronLeft size={17} strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                className="w-9 h-9 rounded-full border border-[#D4C4B0] bg-[#FAF7F2] flex items-center justify-center text-[#1E1A17] hover:border-[#C89B3C] hover:text-[#C89B3C] hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
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
                className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#FAF7F2]/95 backdrop-blur-md border border-[#D4C4B0] shadow-[0_8px_30px_rgba(30,26,23,0.12)] items-center justify-center text-[#1E1A17] hover:bg-[#C89B3C] hover:text-[#171311] hover:border-[#C89B3C] transition-all"
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
              className={`flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-6 pt-3 px-1.5 ${
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
                className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#FAF7F2]/95 backdrop-blur-md border border-[#D4C4B0] shadow-[0_8px_30px_rgba(30,26,23,0.12)] items-center justify-center text-[#1E1A17] hover:bg-[#C89B3C] hover:text-[#171311] hover:border-[#C89B3C] transition-all"
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
