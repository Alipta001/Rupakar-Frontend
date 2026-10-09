'use client'

import { useQuery } from '@tanstack/react-query'
import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { fetchProducts, type Product } from '@/lib/products-api'
import { ProductGridSkeleton, EmptyState, ErrorState } from '@/components/skeletons'
import { ProductCard } from '@/components/product-card'
import { CollectionCarouselSection } from '@/components/collection-carousel-section'
import { CollectionToolbar } from '@/components/collection-toolbar'

const CATEGORIES = ['All', 'Terracotta', 'Folk Art', 'Decor', 'Jewelry']

export default function CollectionsGrid() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeSort, setActiveSort] = useState('newest')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [onlyFeatured, setOnlyFeatured] = useState(false)
  const [viewColumns, setViewColumns] = useState<2 | 3 | 4>(4)
  const [page, setPage] = useState(1)

  // 1. Marketplace-Wide Merchandising: Best Sellers across All Collections
  const { data: bestSellers = [], isLoading: isBestSellersLoading } = useQuery<Product[]>({
    queryKey: ['all-collections-merchandising', 'best-sellers'],
    queryFn: ({ signal }) => fetchProducts({ sort: 'best_sellers', limit: 12 }, { signal }),
    retry: false,
    staleTime: 60 * 1000,
  })

  // 2. Marketplace-Wide Merchandising: Featured Heritage across All Collections
  const { data: featuredPieces = [], isLoading: isFeaturedLoading } = useQuery<Product[]>({
    queryKey: ['all-collections-merchandising', 'featured'],
    queryFn: ({ signal }) => fetchProducts({ featured: true, limit: 12 }, { signal }),
    retry: false,
    staleTime: 60 * 1000,
  })

  // 3. Marketplace-Wide Merchandising: Most Loved / Highest Rated across All Collections
  const { data: mostLoved = [], isLoading: isMostLovedLoading } = useQuery<Product[]>({
    queryKey: ['all-collections-merchandising', 'most-loved'],
    queryFn: ({ signal }) => fetchProducts({ sort: 'rating', limit: 12 }, { signal }),
    retry: false,
    staleTime: 60 * 1000,
  })

  // 4. Complete Catalog with Category, Server-Side Filtering, Sorting, and Pagination
  const {
    data: catalog = [],
    isLoading,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<Product[]>({
    queryKey: ['collection-products', 'browse', activeCategory, activeSort, minPrice, maxPrice, onlyFeatured, page],
    queryFn: ({ signal }) =>
      fetchProducts(
        {
          category: activeCategory === 'All' ? undefined : activeCategory,
          sort: activeSort,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          featured: onlyFeatured ? true : undefined,
          limit: 24,
        },
        { signal }
      ),
    staleTime: 60 * 1000,
  })

  const isInitialCatalogLoading = isPending || (isLoading && catalog.length === 0)

  // Handlers that reset to page 1 on filter/sort changes
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    setPage(1)
  }

  const handleSortChange = (sort: string) => {
    setActiveSort(sort)
    setPage(1)
  }

  const handlePriceChange = (min: string, max: string) => {
    setMinPrice(min)
    setMaxPrice(max)
    setPage(1)
  }

  const handleToggleFeatured = (val: boolean) => {
    setOnlyFeatured(val)
    setPage(1)
  }

  const handleClearFilters = () => {
    setMinPrice('')
    setMaxPrice('')
    setOnlyFeatured(false)
    setActiveSort('newest')
    setPage(1)
  }

  // De-duplicate carousel lists
  const eligibleBestSellers = useMemo<Product[]>(() => {
    if (bestSellers.length < 2) return []
    return bestSellers
  }, [bestSellers])

  const eligibleFeatured = useMemo<Product[]>(() => {
    if (featuredPieces.length < 2) return []
    return featuredPieces
  }, [featuredPieces])

  const eligibleMostLoved = useMemo<Product[]>(() => {
    if (mostLoved.length < 2) return []
    const bestIds = new Set(eligibleBestSellers.map((p) => p.id))
    const uniqueLoved = mostLoved.filter((p) => !bestIds.has(p.id))
    return uniqueLoved.length >= 2 ? uniqueLoved : []
  }, [mostLoved, eligibleBestSellers])

  // Dynamic grid column class based on viewColumns density switcher
  const gridLayoutClass = useMemo(() => {
    switch (viewColumns) {
      case 2:
        return 'grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8'
      case 3:
        return 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-7'
      case 4:
      default:
        return 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7'
    }
  }, [viewColumns])

  return (
    <div className="min-h-screen bg-[#F8F4EE]">
      {/* ─── 1. All Collections Hero Banner ─── */}
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

      {/* ─── 2. Merchandising Slider: Best Sellers across All Collections ─── */}
      <CollectionCarouselSection
        eyebrow="Marketplace Bestsellers"
        title="Best Sellers Across All Collections"
        subtitle="The most coveted handcrafted treasures from Bengal and Indian master artisan clusters."
        products={eligibleBestSellers}
        isLoading={isBestSellersLoading}
        className="bg-[#FAF7F2]"
      />

      {/* ─── 3. Merchandising Slider: Featured across All Collections ─── */}
      <CollectionCarouselSection
        eyebrow="Artisan Signature"
        title="Featured Across Collections"
        subtitle="Signature creations celebrating terracotta pottery, Dokra metallurgy, folk paintings, and handloom textiles."
        products={eligibleFeatured}
        isLoading={isFeaturedLoading}
        className="bg-[#F8F4EE]"
      />

      {/* ─── 4. Merchandising Slider: Most Loved / Highest Rated ─── */}
      <CollectionCarouselSection
        eyebrow="Customer Favorites"
        title="Most Loved Across All Crafts"
        subtitle="Highly rated works admired by collectors for authentic materials, hand-finished details, and cultural heritage."
        products={eligibleMostLoved}
        isLoading={isMostLovedLoading}
        className="bg-[#FAF7F2]"
      />

      {/* ─── 5. Complete All Collections Catalog Section ─── */}
      <section className="border-t border-[#D4C4B0] bg-[#F5EFEB]/50 px-4 sm:px-6 py-10 sm:py-16 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C89B3C] font-semibold">
                Explore Full Catalog
              </p>
              <h2 className="mt-1 text-3xl sm:text-4xl text-[#1E1A17]" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                All Handcrafted Pieces
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5B4B3F] font-sans">
              Filter by craft, adjust price range, or browse by newest arrivals.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex overflow-x-auto no-scrollbar w-full flex-nowrap gap-2 pb-4 pt-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`whitespace-nowrap flex-shrink-0 px-4 sm:px-5 py-2 rounded-xl font-sans text-[10px] tracking-[0.2em] uppercase transition-all duration-300 shadow-sm ${
                  activeCategory === cat
                    ? 'bg-[#1E1A17] text-[#F8F4EE] border border-[#1E1A17] font-semibold'
                    : 'border border-[#D4C4B0] text-[#5B4B3F] hover:border-[#C89B3C] hover:text-[#1E1A17] bg-white/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Merchandising Toolbar */}
          <CollectionToolbar
            collectionName={activeCategory === 'All' ? 'All Collections' : activeCategory}
            totalCount={catalog.length}
            isFetching={isFetching}
            activeSort={activeSort}
            onSortChange={handleSortChange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={handlePriceChange}
            onlyFeatured={onlyFeatured}
            onToggleFeatured={handleToggleFeatured}
            onClearFilters={handleClearFilters}
            viewColumns={viewColumns}
            onViewColumnsChange={setViewColumns}
          />

          {/* Product Grid Area */}
          {isInitialCatalogLoading ? (
            <ProductGridSkeleton count={8} columns={viewColumns} />
          ) : isError && catalog.length === 0 ? (
            <ErrorState
              error={error}
              onRetry={() => refetch()}
              isRetrying={isFetching}
              className="py-16"
            />
          ) : catalog.length === 0 ? (
            <EmptyState
              eyebrow="Collections"
              title="No pieces found with these filters"
              description="Try adjusting your price range or explore another craft category to see available treasures."
              actionLabel="Reset all filters"
              onAction={handleClearFilters}
              className="py-16"
            />
          ) : (
            <>
              <motion.div layout className={`grid ${gridLayoutClass} transition-all duration-300`}>
                <AnimatePresence mode="popLayout">
                  {catalog.map((product, idx) => (
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

              {/* Server-Side Pagination Controls */}
              {(catalog.length >= 24 || page > 1) && (
                <div className="mt-14 pt-8 border-t border-[#D4C4B0] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#D4C4B0] bg-white font-sans text-xs uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#C89B3C]"
                  >
                    <ChevronLeft size={14} />
                    <span>Previous</span>
                  </button>
                  <span className="font-sans text-xs text-[#5B4B3F]">Page {page}</span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={catalog.length < 24}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#D4C4B0] bg-white font-sans text-xs uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#C89B3C]"
                  >
                    <span>Next</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
