'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, Star, SlidersHorizontal } from 'lucide-react'
import { addCartItem, addWishlistItem, fetchCart, fetchWishlist, removeWishlistItem } from '@/lib/customer-api'
import { getProductVariantId, hasCartVariant } from '@/lib/cart-state'
import { fetchProducts, type Product } from '@/lib/products-api'
import { ProductGridSkeleton, EmptyState, ErrorState } from '@/components/skeletons'
import { RatingStars } from '@/components/ui/rating-stars'

const categories = ['All', 'Terracotta', 'Folk Art', 'Decor', 'Jewelry']
const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Best Rated']

export default function CollectionsGrid() {
  const queryClient = useQueryClient()
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeSort, setActiveSort] = useState('Featured')

  const { data: wishlistData } = useQuery({
    queryKey: ['wishlist'],
    queryFn: fetchWishlist,
    retry: false,
  })
  const { data: cartData } = useQuery({ queryKey: ['cart'], queryFn: fetchCart, retry: false })

  const wishlist = (Array.isArray(wishlistData?.items) ? wishlistData.items : []).map((item: any) =>
    String(item?.productId ?? item?.product?._id ?? item?.product?.id ?? item?._id ?? ''),
  )

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

  const addToCartMutation = useMutation({
    mutationFn: addCartItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  const wishlistMutation = useMutation({
    mutationFn: async (id: string) => {
      if (wishlist.includes(id)) {
        await removeWishlistItem(id)
      } else {
        const prod = catalog.find((p) => String(p.id) === String(id) || String(p._id) === String(id))
        await addWishlistItem(id, {
          name: prod?.name,
          price: prod?.price,
          image: prod?.image,
          artisan: prod?.craft || 'Rupakar Artisan',
        })
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  })

  const sorted: Product[] = [...catalog].sort((a: Product, b: Product) => {
    if (activeSort === 'Price: Low to High') return a.price - b.price
    if (activeSort === 'Price: High to Low') return b.price - a.price
    if (activeSort === 'Best Rated') return b.rating - a.rating
    return 0
  })

  const isInitialOrCategoryLoading = isPending || (isLoading && catalog.length === 0)

  const toggleWishlist = (id: number | string) => {
    const strId = String(id)
    wishlistMutation.mutate(strId)
  }

  const handleAddToBag = async (product: Product) => {
    const productId = String(product._id ?? product.id)
    const variantId = getProductVariantId(product)
    if (!productId || !variantId) return
    await addToCartMutation.mutateAsync({
      productId,
      variantId,
      quantity: 1,
    })
  }

  return (
    <div className="min-h-screen bg-[#F8F4EE] pt-20">
      {/* Hero banner */}
      <div className="relative h-72 overflow-hidden">
        <Image src="/images/collection-terracotta.jpg" alt="Collections" fill className="object-cover" />
        <div className="absolute inset-0 bg-[#1E1A17]/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <div className="ornament-divider mb-4">
            <span className="text-[#C89B3C] font-sans text-[10px] tracking-[0.3em] uppercase">Browse</span>
          </div>
          <h1
            className="text-[#F8F4EE]"
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontWeight: 300,
            }}
          >
            All Collections
          </h1>
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
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            <AnimatePresence mode="popLayout">
              {sorted.map((product) => (
                <motion.div
                  key={product.id || product._id || product.slug}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="group"
                >
                  <Link href={`/products/${product.slug || product.id}`}>
                    <div className="relative overflow-hidden aspect-[3/4] mb-3 sm:mb-4 bg-[#EFE3D3]">
                      <Image
                        src={product.image || '/images/product-vase.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-[1000ms] group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-[#1E1A17]/0 group-hover:bg-[#1E1A17]/25 transition-colors duration-500" />

                      {product.badge && (
                        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 px-2 sm:px-2.5 py-0.5 sm:py-1" style={{ backgroundColor: product.badgeColor }}>
                          <span className="text-[#F8F4EE] font-sans text-[7px] tracking-[0.15em] uppercase">{product.badge}</span>
                        </div>
                      )}

                      <button
                        onClick={(e) => { e.preventDefault(); toggleWishlist(product._id ?? product.id) }}
                        className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-7 h-7 bg-[#F8F4EE]/90 flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300"
                        aria-label="Wishlist"
                      >
                        <Heart
                          size={12}
                          strokeWidth={1.5}
                          className={wishlist.includes(String(product.id)) ? 'fill-[#7A1F1F] text-[#7A1F1F]' : 'text-[#1E1A17]'}
                        />
                      </button>

                      <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            if (!hasCartVariant(cartData, getProductVariantId(product))) void handleAddToBag(product)
                          }}
                          disabled={hasCartVariant(cartData, getProductVariantId(product)) || addToCartMutation.isPending}
                          className="w-full bg-[#1E1A17] text-[#F8F4EE] py-3 font-sans text-[9px] tracking-[0.2em] uppercase hover:bg-[#C89B3C] hover:text-[#1E1A17] transition-colors duration-300 flex items-center justify-center gap-2"
                        >
                          <ShoppingBag size={11} /> {hasCartVariant(cartData, getProductVariantId(product)) ? 'In Bag' : 'Add to Bag'}
                        </button>
                      </div>
                    </div>

                    <div className="text-[#C89B3C] font-sans text-[8px] tracking-[0.2em] uppercase mb-1">{product.craft}</div>
                    <h3
                      className="text-[#1E1A17] leading-tight mb-1.5 group-hover:text-[#6B3E26] transition-colors line-clamp-2"
                      style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1rem', fontWeight: 500 }}
                    >
                      {product.name}
                    </h3>
                    <div className="mb-2">
                      <RatingStars rating={product.rating} reviews={product.reviews} size={10} showNumber={false} showCount={true} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.1rem', color: '#1E1A17' }}>
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[#5B4B3F] font-sans text-[11px] line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}
