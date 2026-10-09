'use client'

import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts, type Product } from '@/lib/products-api'
import { BestSellersSkeleton } from '@/components/skeletons'
import { CarouselProductCard } from '@/components/best-sellers'

interface FeaturedProductsProps {
  currentProductId?: string
  currentProductSlug?: string
}

export default function FeaturedProducts({
  currentProductId,
  currentProductSlug,
}: FeaturedProductsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Fetch real products from the API
  const { data: products = [], isLoading, isFetching } = useQuery<Product[]>({
    queryKey: ['products', 'featured'],
    queryFn: ({ signal }) => fetchProducts({ limit: 20 }, { signal }),
    staleTime: 60 * 1000,
  })

  // Filter out the currently viewed product and select featured products
  const featuredList = useMemo(() => {
    const withoutCurrent = products.filter((p) => {
      const idMatches =
        currentProductId &&
        (p.id === currentProductId || p._id === currentProductId)
      const slugMatches =
        currentProductSlug && p.slug === currentProductSlug
      return !idMatches && !slugMatches
    })

    // Prioritize products marked featured or with 'Featured' badge
    const explicitlyFeatured = withoutCurrent.filter(
      (p) => p.featured || p.badge?.toLowerCase() === 'featured'
    )

    // Fallback to top catalog products if not enough explicitly marked
    const selected =
      explicitlyFeatured.length >= 3 ? explicitlyFeatured : withoutCurrent

    return selected.slice(0, 15)
  }, [products, currentProductId, currentProductSlug])

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
  }, [checkScrollability, featuredList.length])

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    const container = scrollContainerRef.current
    const cardWidth = container.firstElementChild?.clientWidth || 250
    const scrollAmount = (cardWidth + 24) * 2
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

  if (!isLoading && !isFetching && featuredList.length === 0) {
    return null
  }

  return (
    <section className="py-16 sm:py-20 bg-[#FAF7F2] border-t border-[#D4C4B0]/60" ref={ref}>
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
                Curated Selection
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
              Featured Products
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
        {(isLoading || isFetching) && featuredList.length === 0 ? (
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
              {featuredList.map((product, i) => (
                <CarouselProductCard
                  key={product.id || product.slug || i}
                  product={product}
                  index={i}
                />
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
