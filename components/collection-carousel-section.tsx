'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import type { Product } from '@/lib/products-api'
import { ProductCard } from '@/components/product-card'
import { BestSellersSkeleton } from '@/components/skeletons'

export interface CollectionCarouselSectionProps {
  eyebrow?: string
  title: string
  subtitle?: string
  products: Product[]
  isLoading?: boolean
  viewAllHref?: string
  className?: string
}

export function CollectionCarouselSection({
  eyebrow = 'Curated Selection',
  title,
  subtitle,
  products = [],
  isLoading = false,
  viewAllHref,
  className = '',
}: CollectionCarouselSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Drag-to-scroll mouse state
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollStart, setScrollStart] = useState(0)

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
  }, [checkScrollability, products.length])

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    const container = scrollContainerRef.current
    const cardWidth = container.firstElementChild?.clientWidth || 260
    const scrollAmount = (cardWidth + 20) * 2
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

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

  // Gracefully hide section if not loading and insufficient products
  if (!isLoading && products.length === 0) {
    return null
  }

  return (
    <section className={`py-12 sm:py-16 border-t border-[#D4C4B0]/60 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header with Title & Navigation Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            {eyebrow && (
              <div className="mb-2">
                <span className="text-[#C89B3C] font-sans text-[9.5px] sm:text-[10px] tracking-[0.25em] uppercase font-semibold">
                  {eyebrow}
                </span>
              </div>
            )}
            <h2
              className="text-[#1E1A17] leading-tight"
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                fontWeight: 400,
              }}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                className="mt-2 text-sm sm:text-base text-[#5B4B3F] max-w-xl leading-relaxed"
                style={{ fontFamily: 'var(--font-cormorant), serif' }}
              >
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 sm:gap-5 self-end sm:self-auto">
            {viewAllHref && (
              <Link
                href={viewAllHref}
                className="text-[#6B3E26] hover:text-[#C89B3C] font-sans text-xs tracking-[0.16em] uppercase transition-colors flex items-center gap-1.5"
              >
                <span>View all</span>
                <ArrowRight size={13} />
              </Link>
            )}

            {/* Desktop Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                className="w-9 h-9 rounded-full border border-[#D4C4B0] bg-[#FAF7F2] flex items-center justify-center text-[#1E1A17] hover:border-[#C89B3C] hover:text-[#C89B3C] hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm active:scale-95"
                aria-label="Previous items"
              >
                <ChevronLeft size={16} strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                className="w-9 h-9 rounded-full border border-[#D4C4B0] bg-[#FAF7F2] flex items-center justify-center text-[#1E1A17] hover:border-[#C89B3C] hover:text-[#C89B3C] hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm active:scale-95"
                aria-label="Next items"
              >
                <ChevronRight size={16} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Content */}
        {isLoading && products.length === 0 ? (
          <BestSellersSkeleton />
        ) : (
          <div className="relative group/carousel">
            {/* Floating Left Arrow (Desktop) */}
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#FAF7F2]/95 backdrop-blur-md border border-[#D4C4B0] shadow-md items-center justify-center text-[#1E1A17] hover:bg-[#C89B3C] hover:text-[#171311] hover:border-[#C89B3C] transition-all"
                aria-label="Scroll left"
              >
                <ChevronLeft size={18} strokeWidth={2} />
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
              className={`flex gap-3.5 sm:gap-5 md:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-6 pt-2 px-1 ${
                isMouseDown ? 'cursor-grabbing select-none' : 'cursor-grab'
              }`}
              style={{
                WebkitOverflowScrolling: 'touch',
                overscrollBehaviorX: 'contain',
              }}
            >
              {products.map((product, idx) => (
                <div
                  key={product.id || product.slug || idx}
                  className="w-[185px] sm:w-[225px] md:w-[250px] lg:w-[270px] flex-shrink-0 snap-start h-full"
                >
                  <ProductCard product={product} priority={idx < 2} />
                </div>
              ))}
            </div>

            {/* Floating Right Arrow (Desktop) */}
            {canScrollRight && (
              <button
                type="button"
                onClick={() => handleScroll('right')}
                className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#FAF7F2]/95 backdrop-blur-md border border-[#D4C4B0] shadow-md items-center justify-center text-[#1E1A17] hover:bg-[#C89B3C] hover:text-[#171311] hover:border-[#C89B3C] transition-all"
                aria-label="Scroll right"
              >
                <ChevronRight size={18} strokeWidth={2} />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default CollectionCarouselSection
