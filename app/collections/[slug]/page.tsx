'use client'

import { use, useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { AxiosInstance } from '@/api/axios/axios'
import { fetchProducts, fetchProductsPage, type Product, type ProductsPageResult } from '@/lib/products-api'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductGridSkeleton, ErrorState, EmptyState } from '@/components/skeletons'
import { ProductCard } from '@/components/product-card'
import { CollectionCarouselSection } from '@/components/collection-carousel-section'
import { CollectionToolbar } from '@/components/collection-toolbar'

const collectionProfiles: Record<string, { name: string; image: string; intro: string; detail: string; craftTag: string }> = {
  terracotta: {
    name: 'Terracotta',
    image: '/images/collection-terracotta.jpg',
    intro: 'Earth, fire, and the quiet beauty of a hand-shaped form.',
    detail: 'A study in warm clay, time-worn textures, and the artisans who turn the soil beneath us into objects made to last.',
    craftTag: 'Clay & Terracotta',
  },
  'folk-art': {
    name: 'Folk Art',
    image: '/images/category-folk-art.jpg',
    intro: 'Stories carried in line and pigment across generations.',
    detail: 'Intricate visual storytelling honoring tribal traditions, mythological folklores, and generational canvas art.',
    craftTag: 'Pattachitra & Folk Painting',
  },
  'folk-arts': {
    name: 'Folk Arts',
    image: '/images/category-folk-art.jpg',
    intro: 'Stories carried in line and pigment across generations.',
    detail: 'Intricate visual storytelling honoring tribal traditions, mythological folklores, and generational canvas art.',
    craftTag: 'Pattachitra & Folk Painting',
  },
  folkart: {
    name: 'Folk Art',
    image: '/images/category-folk-art.jpg',
    intro: 'Stories carried in line and pigment across generations.',
    detail: 'Intricate visual storytelling honoring tribal traditions, mythological folklores, and generational canvas art.',
    craftTag: 'Pattachitra & Folk Painting',
  },
  'home-decor': {
    name: 'Home Decor',
    image: '/images/collection-decor.jpg',
    intro: 'Objects with a sense of place.',
    detail: 'Thoughtful accents that bring the language of Indian craft into the everyday spaces around you.',
    craftTag: 'Artisan Living',
  },
  decor: {
    name: 'Home Decor',
    image: '/images/collection-decor.jpg',
    intro: 'Objects with a sense of place.',
    detail: 'Thoughtful accents that bring the language of Indian craft into the everyday spaces around you.',
    craftTag: 'Artisan Living',
  },
  'dokra-craft': {
    name: 'Dokra Craft',
    image: '/images/category-pottery.jpg',
    intro: 'Four thousand years of lost-wax metallurgy, cast in timeless brass and bronze.',
    detail: 'Ancient non-ferrous metal casting practiced by indigenous artisans, transforming raw metal into sacred and aesthetic forms.',
    craftTag: 'Lost-Wax Metallurgy',
  },
  dokra: {
    name: 'Dokra Craft',
    image: '/images/category-pottery.jpg',
    intro: 'Four thousand years of lost-wax metallurgy, cast in timeless brass and bronze.',
    detail: 'Ancient non-ferrous metal casting practiced by indigenous artisans, transforming raw metal into sacred and aesthetic forms.',
    craftTag: 'Lost-Wax Metallurgy',
  },
  textiles: {
    name: 'Textiles',
    image: '/images/gallery-3.jpg',
    intro: 'The rhythm of the handloom woven into Bengal cotton and silk.',
    detail: 'Spun, dyed, and woven on traditional pit and frame looms by master weavers committed to slow fashion.',
    craftTag: 'Handloom & Weaving',
  },
  'jute-crafts': {
    name: 'Jute Crafts',
    image: '/images/gallery-2.jpg',
    intro: 'Natural golden fibers shaped into purposeful, sustainable craft.',
    detail: 'Eco-conscious craftsmanship turning humble plant fibers into textured, elegant decor and lifestyle essentials.',
    craftTag: 'Golden Fiber Crafts',
  },
  jute: {
    name: 'Jute Crafts',
    image: '/images/gallery-2.jpg',
    intro: 'Natural golden fibers shaped into purposeful, sustainable craft.',
    detail: 'Eco-conscious craftsmanship turning humble plant fibers into textured, elegant decor and lifestyle essentials.',
    craftTag: 'Golden Fiber Crafts',
  },
  jewelry: {
    name: 'Artisan Jewelry',
    image: '/images/gallery-1.jpg',
    intro: 'Handcrafted adornments celebrating indigenous metals, terracotta beads, and heritage motifs.',
    detail: 'Timeless wearable craft shaped by generational metalsmiths and clay artisans.',
    craftTag: 'Handmade Adornments',
  },
  jewellery: {
    name: 'Artisan Jewelry',
    image: '/images/gallery-1.jpg',
    intro: 'Handcrafted adornments celebrating indigenous metals, terracotta beads, and heritage motifs.',
    detail: 'Timeless wearable craft shaped by generational metalsmiths and clay artisans.',
    craftTag: 'Handmade Adornments',
  },
  pottery: {
    name: 'Studio Pottery',
    image: '/images/category-pottery.jpg',
    intro: 'Wheel-thrown and hand-glazed functional stoneware rooted in natural clays.',
    detail: 'Tactile everyday objects crafted by skilled studio potters using local clays and organic glazes.',
    craftTag: 'Studio Stoneware',
  },
}

const POPULAR_COLLECTIONS = [
  { slug: 'terracotta', name: 'Terracotta' },
  { slug: 'folk-art', name: 'Folk Art' },
  { slug: 'dokra-craft', name: 'Dokra' },
  { slug: 'home-decor', name: 'Home Decor' },
  { slug: 'textiles', name: 'Textiles' },
  { slug: 'jute-crafts', name: 'Jute' },
]

export default function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const normalizedSlug = slug.toLowerCase()

  // Merchandising filter & sort states
  const [activeSort, setActiveSort] = useState('newest')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [onlyFeatured, setOnlyFeatured] = useState(false)
  const [viewColumns, setViewColumns] = useState<2 | 3 | 4>(4)
  const [page, setPage] = useState(1)

  // Fetch Category Metadata from backend
  const category = useQuery({
    queryKey: ['category', slug],
    queryFn: async ({ signal }) => (await AxiosInstance.get(`/categories/${encodeURIComponent(slug)}`, { signal })).data?.data,
    retry: false,
  })

  const matchedProfile = collectionProfiles[normalizedSlug]
  const formattedSlugName = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  const profile = {
    name: category.data?.name ?? matchedProfile?.name ?? formattedSlugName,
    image: category.data?.image || matchedProfile?.image || '/images/collection-terracotta.jpg',
    intro: matchedProfile?.intro || category.data?.description || 'A considered edit of Indian craft.',
    detail: matchedProfile?.detail || category.data?.description || 'Discover pieces shaped by material, memory, and the hands that made them.',
    craftTag: matchedProfile?.craftTag || category.data?.name || 'Heritage Craft',
  }

  // 1. Merchandising Section: Collection Best Sellers
  const { data: bestSellers = [], isLoading: isBestSellersLoading } = useQuery<Product[]>({
    queryKey: ['collection-merchandising', slug, 'best-sellers'],
    queryFn: ({ signal }) => fetchProducts({ category: slug, sort: 'best_sellers', limit: 12 }, { signal }),
    retry: false,
    staleTime: 60 * 1000,
  })

  // 2. Merchandising Section: Collection Most Loved / Top Rated
  const { data: mostLoved = [], isLoading: isMostLovedLoading } = useQuery<Product[]>({
    queryKey: ['collection-merchandising', slug, 'most-loved'],
    queryFn: ({ signal }) => fetchProducts({ category: slug, sort: 'rating', limit: 12 }, { signal }),
    retry: false,
    staleTime: 60 * 1000,
  })

  // 3. Merchandising Section: Featured Heritage in this Collection
  const { data: featuredPieces = [], isLoading: isFeaturedLoading } = useQuery<Product[]>({
    queryKey: ['collection-merchandising', slug, 'featured'],
    queryFn: ({ signal }) => fetchProducts({ category: slug, featured: true, limit: 12 }, { signal }),
    retry: false,
    staleTime: 60 * 1000,
  })

  // 4. Complete Collection Catalog (Server-Side Filtered & Sorted with limit 20)
  const {
    data: catalogPage,
    isLoading: isCatalogLoading,
    isPending: isCatalogPending,
    isFetching: isCatalogFetching,
    isError: isCatalogError,
    error: catalogError,
    refetch: refetchCatalog,
  } = useQuery<ProductsPageResult>({
    queryKey: ['collection-catalog', slug, activeSort, minPrice, maxPrice, onlyFeatured, page],
    queryFn: ({ signal }) =>
      fetchProductsPage(
        {
          category: slug,
          sort: activeSort,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          featured: onlyFeatured ? true : undefined,
          page,
          limit: 20,
        },
        { signal }
      ),
    retry: false,
    staleTime: 60 * 1000,
  })

  const catalogProducts = catalogPage?.products ?? []
  const catalogTotal = catalogPage?.total ?? catalogProducts.length
  const totalPages = catalogPage?.totalPages ?? 1
  const hasNextPage = catalogPage?.hasNextPage ?? false
  const hasPreviousPage = catalogPage?.hasPreviousPage ?? false

  const isInitialCatalogLoading = isCatalogPending || (isCatalogLoading && catalogProducts.length === 0)

  // Filter change handlers that reset pagination to page 1
  const handleSortChange = (newSort: string) => {
    setActiveSort(newSort)
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

  // De-duplicate carousel lists so we don't display identical product sets across adjacent sliders
  const eligibleBestSellers = useMemo<Product[]>(() => {
    if (bestSellers.length < 2) return []
    return bestSellers
  }, [bestSellers])

  const eligibleMostLoved = useMemo<Product[]>(() => {
    if (mostLoved.length < 2) return []
    // If most loved has the identical top product order as best sellers, avoid duplicate slider
    const bestIds = new Set(eligibleBestSellers.map((p: Product) => p.id))
    const uniqueLoved = mostLoved.filter((p: Product) => !bestIds.has(p.id))
    return uniqueLoved.length >= 2 ? uniqueLoved : []
  }, [mostLoved, eligibleBestSellers])

  const eligibleFeatured = useMemo<Product[]>(() => {
    if (featuredPieces.length < 2) return []
    return featuredPieces
  }, [featuredPieces])

  // Dynamic grid classes for view density switcher
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
    <main className="bg-[#F8F4EE] text-[#1E1A17] min-h-screen">
      <Navbar position="sticky" />

      {/* ─── 1. Collection Hero Banner ─── Starts cleanly below navbar */}
      <section className="relative isolate min-h-[440px] sm:min-h-[480px] md:min-h-[520px] overflow-hidden bg-[#1E1511] flex items-center">
        <Image
          src={profile.image}
          alt={profile.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-65 scale-[1.02] transition-transform duration-1000"
        />
        {/* Cinematic rich dark gradient overlays for maximum readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#140F0D]/95 via-[#140F0D]/80 to-[#140F0D]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#140F0D] via-transparent to-black/30" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:px-12">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6 flex items-center gap-2 font-sans text-[11px] tracking-[0.2em] uppercase text-[#D8B15A]/80 flex-wrap">
            <Link href="/" className="hover:text-[#F8F4EE] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-[#F8F4EE] transition-colors">Collections</Link>
            <span>/</span>
            <span className="text-[#F8F4EE]">{profile.name}</span>
          </nav>

          <div className="max-w-2xl text-[#F8F4EE]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D8B15A]/30 bg-[#1E1511]/60 px-3.5 py-1 text-[10px] font-sans uppercase tracking-[0.3em] text-[#D8B15A] backdrop-blur-sm">
              <Sparkles size={12} className="text-[#D8B15A]" />
              <span>{profile.craftTag}</span>
            </div>
            <h1
              className="mb-4 text-4xl font-light leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
              style={{ fontFamily: 'var(--font-cormorant), serif' }}
            >
              {profile.name}
            </h1>
            <p
              className="max-w-lg text-base sm:text-lg leading-relaxed text-[#F8F4EE]/90"
              style={{ fontFamily: 'var(--font-cormorant), serif' }}
            >
              {profile.intro}
            </p>
          </div>
        </div>
      </section>

      {/* ─── 2. Collection Editorial Context & Quick Categories Bar ─── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14 md:px-12">
        <div className="grid gap-8 md:grid-cols-[1fr_2fr] items-start">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C89B3C] font-semibold">The Edit</p>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl leading-tight" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
              {profile.intro}
            </h2>
          </div>
          <div className="max-w-xl md:ml-auto">
            <p className="text-sm sm:text-base leading-relaxed text-[#5B4B3F]">{profile.detail}</p>

            {/* Quick Collections Navigation Pills */}
            <div className="mt-6 pt-5 border-t border-[#D4C4B0]/70 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#8C7A6B] flex-shrink-0">Explore:</span>
              {POPULAR_COLLECTIONS.map((c) => (
                <Link
                  key={c.slug}
                  href={`/collections/${c.slug}`}
                  className={`px-3 py-1 rounded-full text-[10px] font-sans uppercase tracking-[0.15em] transition-all flex-shrink-0 ${
                    c.slug === normalizedSlug
                      ? 'bg-[#1E1A17] text-[#F8F4EE] font-semibold'
                      : 'bg-white/60 hover:bg-white text-[#5B4B3F] hover:text-[#1E1A17] border border-[#D4C4B0]/60'
                  }`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. Merchandising Slider: Best Sellers in this Collection ─── */}
      <CollectionCarouselSection
        eyebrow="Curated Bestsellers"
        title={`${profile.name} Best Sellers`}
        subtitle={`Discover the most acclaimed handcrafted ${profile.name.toLowerCase()} pieces chosen by collectors.`}
        products={eligibleBestSellers}
        isLoading={isBestSellersLoading}
        className="bg-[#FAF7F2]"
      />

      {/* ─── 4. Merchandising Slider: Featured Artisan Heritage in this Collection ─── */}
      <CollectionCarouselSection
        eyebrow="Artisan Signature"
        title={`Featured ${profile.name}`}
        subtitle={`Handpicked spotlight pieces showcasing master cluster artistry and generational techniques.`}
        products={eligibleFeatured}
        isLoading={isFeaturedLoading}
        className="bg-[#F8F4EE]"
      />

      {/* ─── 5. Merchandising Slider: Most Loved / Highest Rated in this Collection ─── */}
      <CollectionCarouselSection
        eyebrow="Customer Favorites"
        title={`Most Loved in ${profile.name}`}
        subtitle="Highly rated works celebrated for craftsmanship, authentic material, and timeless aesthetics."
        products={eligibleMostLoved}
        isLoading={isMostLovedLoading}
        className="bg-[#FAF7F2]"
      />

      {/* ─── 6. Complete Collection Catalog Section ─── */}
      <section className="border-t border-[#D4C4B0] bg-[#F5EFEB]/50 px-4 sm:px-6 py-12 sm:py-16 md:px-12 md:py-20">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C89B3C] font-semibold">
                Complete Collection
              </p>
              <h2 className="mt-1 text-3xl sm:text-4xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                All {profile.name} Pieces
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5B4B3F] font-sans">
              Discover every hand-shaped, studio-fired treasure in our active catalog.
            </p>
          </div>

          {/* Merchandising Toolbar */}
          <CollectionToolbar
            collectionName={profile.name}
            totalCount={catalogTotal}
            isFetching={isCatalogFetching}
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
          ) : isCatalogError && catalogProducts.length === 0 ? (
            <ErrorState error={catalogError} onRetry={() => refetchCatalog()} isRetrying={isCatalogFetching} className="py-16" />
          ) : catalogProducts.length > 0 ? (
            <>
              <div className={`grid ${gridLayoutClass} transition-all duration-300`}>
                {catalogProducts.map((product: any, idx: number) => (
                  <ProductCard
                    key={product.id ?? product._id ?? product.slug ?? idx}
                    product={product}
                    priority={idx < 4}
                  />
                ))}
              </div>

              {/* Server-Side Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-14 pt-8 border-t border-[#D4C4B0] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="font-sans text-xs text-[#5B4B3F]">
                    Showing {Math.min((page - 1) * 20 + 1, catalogTotal)}–{Math.min(page * 20, catalogTotal)} of {catalogTotal} pieces
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1 || !hasPreviousPage}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#D4C4B0] bg-white font-sans text-xs uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#C89B3C] transition-colors"
                    >
                      <ChevronLeft size={14} />
                      <span>Previous</span>
                    </button>
                    <span className="font-sans text-xs text-[#5B4B3F] font-medium px-2">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page >= totalPages || !hasNextPage}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#D4C4B0] bg-white font-sans text-xs uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#C89B3C] transition-colors"
                    >
                      <span>Next</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white border border-[#D4C4B0] rounded-2xl p-10 sm:p-16 text-center max-w-2xl mx-auto shadow-sm">
              <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C89B3C] font-semibold">
                No matching pieces found
              </p>
              <h3 className="mt-3 text-3xl sm:text-4xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                Refine your selection
              </h3>
              <p className="mt-3 text-sm text-[#5B4B3F] leading-relaxed">
                We couldn&apos;t find any {profile.name} pieces matching your selected price range or filters. Try adjusting your filters or explore all items in this collection.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-5 py-2.5 rounded-xl bg-[#1E1A17] text-[#F8F4EE] hover:bg-[#C89B3C] hover:text-[#1E1A17] font-sans text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  Reset all filters
                </button>
                <Link
                  href="/products"
                  className="px-5 py-2.5 rounded-xl border border-[#D4C4B0] bg-white text-[#1E1A17] hover:border-[#C89B3C] font-sans text-xs uppercase tracking-wider transition-colors"
                >
                  Browse all catalog
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
