'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal } from 'lucide-react'
import { fetchProducts, type Product } from '@/lib/products-api'
import { ProductGridSkeleton, EmptyState, ErrorState } from '@/components/skeletons'
import { ProductCard } from '@/components/product-card'

const categories = ['All', 'Terracotta', 'Folk Art', 'Decor', 'Jewelry']
const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Best Rated']

export default function CollectionsGrid() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeSort, setActiveSort] = useState('Featured')

  const {
    data: catalog = [],
    isLoading,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<Product[]>({
    queryKey: ['collection-products', 'browse', activeCategory],
    queryFn: ({ signal }) =>
      fetchProducts(
        {
          category: activeCategory === 'All' ? undefined : activeCategory,
          limit: 40,
        },
        { signal }
      ),
    staleTime: 60 * 1000,
  })

  const sorted: Product[] = [...catalog].sort((a: Product, b: Product) => {
    if (activeSort === 'Price: Low to High') return a.price - b.price
    if (activeSort === 'Price: High to Low') return b.price - a.price
    if (activeSort === 'Best Rated') return b.rating - a.rating
    return 0
  })

  const isInitialOrCategoryLoading = isPending || (isLoading && catalog.length === 0)

  return (
    <div className="min-h-screen bg-[#F8F4EE]">
      {/* Hero banner - Starts cleanly below navbar */}
      <div className="relative h-72 sm:h-80 md:h-96 overflow-hidden bg-[#1E1511]">
        <Image
          src="/images/collection-terracotta.jpg"
          alt="All Collections"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-65 scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#140F0D]/95 via-[#1E1A17]/70 to-[#140F0D]/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-2 font-sans text-[11px] tracking-[0.2em] uppercase text-[#D8B15A]/80">
            <Link href="/" className="hover:text-[#F8F4EE] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#F8F4EE]">Collections</span>
          </nav>
          <div className="ornament-divider mb-3">
            <span className="text-[#C89B3C] font-sans text-[10px] tracking-[0.3em] uppercase">Curated Catalog</span>
          </div>
          <h1
            className="text-[#F8F4EE] leading-none"
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 300,
            }}
          >
            All Collections
          </h1>
          <p className="mt-3 max-w-md text-sm sm:text-base text-[#F8F4EE]/80" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
            Timeless handicraft traditions handpicked from master artisan clusters across India.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-10">
          {/* Category filters */}
          <div className="flex overflow-x-auto no-scrollbar w-full sm:w-auto flex-nowrap sm:flex-wrap gap-2 pb-1.5 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap flex-shrink-0 px-4 sm:px-5 py-2 font-sans text-[10px] tracking-[0.2em] uppercase transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-[#6B3E26] text-[#F8F4EE]'
                    : 'border border-[#D4C4B0] text-[#5B4B3F] hover:border-[#C89B3C] hover:text-[#1E1A17] bg-white/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <SlidersHorizontal size={13} className="text-[#5B4B3F]" />
            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value)}
              className="bg-white/80 border border-[#D4C4B0] text-[#5B4B3F] font-sans text-[10px] tracking-[0.1em] px-3 py-1.5 focus:outline-none focus:border-[#C89B3C]"
            >
              {sortOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Count */}
        {!isInitialOrCategoryLoading && !isError && (
          <p className="text-[#5B4B3F] font-sans text-xs tracking-[0.1em] mb-6 sm:mb-8">
            {sorted.length} {sorted.length === 1 ? 'piece' : 'pieces'}
          </p>
        )}

        {/* Content State Separation */}
        {isInitialOrCategoryLoading ? (
          <ProductGridSkeleton count={8} columns={4} />
        ) : isError && catalog.length === 0 ? (
          <ErrorState
            error={error}
            onRetry={() => refetch()}
            isRetrying={isFetching}
          />
        ) : sorted.length === 0 ? (
          <EmptyState
            eyebrow="Collections"
            title="No pieces found in this category"
            description="Our artisans are constantly creating new handmade works. Try selecting another craft or category."
            actionLabel="View All Pieces"
            onAction={() => setActiveCategory('All')}
          />
        ) : (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7">
            <AnimatePresence mode="popLayout">
              {sorted.map((product, idx) => (
                <motion.div
                  key={product.id || product._id || product.slug || idx}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <ProductCard product={product} priority={idx < 4} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}
