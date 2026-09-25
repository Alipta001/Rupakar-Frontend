'use client'

import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, SlidersHorizontal, Heart, ShoppingBag, Star, X } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { fetchProducts, type Product } from '@/lib/products-api'
import { addCartItem, addWishlistItem, fetchCart, fetchCategories, fetchWishlist, removeWishlistItem } from '@/lib/customer-api'
import { getProductVariantId, hasCartVariant } from '@/lib/cart-state'
import { ProductGridSkeleton, ErrorState, EmptyState } from '@/components/skeletons'

const SORT_OPTIONS = [
  { value: '', label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Best Rated' },
]

const CRAFT_TAGS = [
  'Terracotta', 'Folk Art', 'Handloom', 'Dokra', 'Madhubani',
  'Pattachitra', 'Block Print', 'Bamboo Craft', 'Pottery', 'Embroidery',
]

export default function ProductsPage() {
  const queryClient = useQueryClient()
  const [sort, setSort] = useState('')
  const [category, setCategory] = useState('')
  const [craftFilter, setCraftFilter] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const { data: cartData } = useQuery({ queryKey: ['cart'], queryFn: fetchCart, retry: false })
  const { data: wishlistData } = useQuery({ queryKey: ['wishlist'], queryFn: fetchWishlist, retry: false })
  const wishlistSet = new Set(
    Array.isArray(wishlistData?.items) ? wishlistData.items.map((item: any) => String(item.productId ?? '')).filter(Boolean) : [],
  )

  const { data: categoriesData = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  })

  const queryParams: Record<string, any> = { limit: 48 }
  if (sort === 'price_asc' || sort === 'price_desc' || sort === 'newest') queryParams.sort = sort
  if (category) queryParams.category = category
  if (craftFilter) queryParams.q = craftFilter
  if (minPrice) queryParams.minPrice = minPrice
  if (maxPrice) queryParams.maxPrice = maxPrice

  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<Product[]>({
    queryKey: ['products', queryParams],
    queryFn: ({ signal }) => fetchProducts(queryParams, { signal }),
    staleTime: 60 * 1000,
    placeholderData: (prev) => prev,
  })

  const addToCartMutation = useMutation({
    mutationFn: (payload: { productId: string; variantId: string; quantity: number }) => addCartItem(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  const wishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (wishlistSet.has(productId)) {
        await removeWishlistItem(productId)
      } else {
        const prod = products.find((p: any) => String(p._id ?? p.id) === String(productId))
        const rawImg: any = prod?.images?.[0]
        const image = (typeof rawImg === 'object' ? rawImg?.url : rawImg) || prod?.image
        await addWishlistItem(productId, {
          name: prod?.name,
          price: prod?.price,
          image,
          artisan: prod?.craft || 'Rupakar Artisan',
        })
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  })

  const handleAddToCart = useCallback((product: any) => {
    const productId = String(product._id ?? '')
    const variantId = getProductVariantId(product)
    if (!productId || !variantId) return
    addToCartMutation.mutate({ productId, variantId, quantity: 1 })
  }, [addToCartMutation])

  const clearFilters = () => {
    setSort('')
    setCategory('')
    setCraftFilter('')
    setMinPrice('')
    setMaxPrice('')
  }

  const hasFilters = sort || category || craftFilter || minPrice || maxPrice

  const categories = Array.isArray(categoriesData) ? categoriesData : []

  return (
    <main>
      <Navbar />
      <section className="min-h-screen bg-[#F8F4EE] pt-24">
        {/* Hero banner */}
        <div className="bg-[#1E1A17] text-[#F8F4EE] py-16 px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#C89B3C] mb-3"
          >
            Handcrafted Excellence
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 400, lineHeight: 1.1 }}
          >
            Our Collections
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#D4C4B0] font-sans text-sm mt-4 max-w-md mx-auto"
          >
            Discover {!isLoading && products.length > 0 ? `${products.length}+` : 'our'} artisan masterpieces from across India
          </motion.p>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 border border-[#D4C4B0] bg-white px-4 py-2.5 font-sans text-xs tracking-[0.1em] uppercase text-[#5B4B3F] hover:border-[#C89B3C] hover:text-[#C89B3C] transition-colors"
              >
                <SlidersHorizontal size={14} />
                Filters
                {hasFilters && (
                  <span className="ml-1 bg-[#C89B3C] text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px]">!</span>
                )}
              </button>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-[#5B4B3F] hover:text-[#C89B3C] font-sans text-xs transition-colors"
                >
                  <X size={12} />
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[#5B4B3F] font-sans text-xs tracking-[0.05em]">
                {isLoading && products.length === 0
                  ? 'Loading pieces…'
                  : isFetching
                  ? `Updating… (${products.length} products)`
                  : `${products.length} products`}
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-[#D4C4B0] bg-white px-3 py-2.5 font-sans text-xs tracking-[0.05em] text-[#5B4B3F] focus:outline-none focus:border-[#C89B3C] transition-colors"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mb-8"
              >
                <div className="bg-white border border-[#D4C4B0] p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Category */}
                  <div>
                    <label className="block font-sans text-[10px] tracking-[0.2em] uppercase text-[#5B4B3F] mb-3">Category</label>
                    <div className="space-y-2">
                      <button
                        onClick={() => setCategory('')}
                        className={`block w-full text-left font-sans text-xs px-3 py-2 transition-colors ${!category ? 'bg-[#1E1A17] text-[#F8F4EE]' : 'text-[#5B4B3F] hover:bg-[#F8F4EE]'}`}
                      >
                        All Categories
                      </button>
                      {categories.slice(0, 8).map((cat: any) => (
                        <button
                          key={cat._id ?? cat.id ?? cat.slug}
                          onClick={() => setCategory(cat.slug ?? cat.name)}
                          className={`block w-full text-left font-sans text-xs px-3 py-2 transition-colors ${category === (cat.slug ?? cat.name) ? 'bg-[#1E1A17] text-[#F8F4EE]' : 'text-[#5B4B3F] hover:bg-[#F8F4EE]'}`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Craft */}
                  <div>
                    <label className="block font-sans text-[10px] tracking-[0.2em] uppercase text-[#5B4B3F] mb-3">Craft</label>
                    <div className="flex flex-wrap gap-2">
                      {CRAFT_TAGS.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setCraftFilter(craftFilter === tag ? '' : tag)}
                          className={`px-3 py-1.5 border font-sans text-[10px] tracking-[0.1em] uppercase transition-all ${craftFilter === tag ? 'bg-[#C89B3C] border-[#C89B3C] text-white' : 'border-[#D4C4B0] text-[#5B4B3F] hover:border-[#C89B3C]'}`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price range */}
                  <div className="md:col-span-2">
                    <label className="block font-sans text-[10px] tracking-[0.2em] uppercase text-[#5B4B3F] mb-3">Price Range (₹)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full border border-[#D4C4B0] px-3 py-2 font-sans text-xs focus:outline-none focus:border-[#C89B3C]"
                      />
                      <span className="text-[#D4C4B0]">—</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full border border-[#D4C4B0] px-3 py-2 font-sans text-xs focus:outline-none focus:border-[#C89B3C]"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products grid */}
          {(isLoading || isFetching) && products.length === 0 ? (
            <ProductGridSkeleton count={8} />
          ) : isError && products.length === 0 ? (
            <ErrorState
              error={error}
              onRetry={() => refetch()}
              className="py-16"
            />
          ) : products.length === 0 ? (
            <EmptyState
              title="No products found"
              description="No pieces matched your selected filters. Try broadening your criteria or reset filters."
              actionLabel="Clear all filters"
              onAction={clearFilters}
              className="py-16"
            />
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
            >
              {products.map((product: Product, index: number) => {
                const isWishlisted = wishlistSet.has(String(product.id))
                return (
                  <motion.div
                    key={product.id ?? product.slug ?? index}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.5) }}
                    className="group"
                  >
                    <div className="relative overflow-hidden bg-[#EFE3D3] aspect-square mb-3">
                      <Link href={`/products/${product.slug ?? product.id}`}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      </Link>

                      {product.badge && (
                        <div
                          className="absolute top-3 left-3 px-2.5 py-1"
                          style={{ backgroundColor: product.badgeColor }}
                        >
                          <span className="text-[#F8F4EE] font-sans text-[7px] tracking-[0.2em] uppercase">
                            {product.badge}
                          </span>
                        </div>
                      )}

                      {/* Actions overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2 p-3">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAddToCart(product)}
                          disabled={hasCartVariant(cartData, getProductVariantId(product)) || addToCartMutation.isPending}
                          className="flex-1 bg-[#1E1A17] text-[#F8F4EE] py-2.5 font-sans text-[9px] tracking-[0.15em] uppercase flex items-center justify-center gap-1.5 hover:bg-[#6B3E26] transition-colors"
                          aria-label={`Add ${product.name} to cart`}
                        >
                          <ShoppingBag size={11} />
                          {hasCartVariant(cartData, getProductVariantId(product)) ? 'In Bag' : 'Add to Bag'}
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => wishlistMutation.mutate(String(product.id))}
                          className={`w-10 flex items-center justify-center transition-colors ${isWishlisted ? 'bg-[#C89B3C] text-white' : 'bg-white/90 text-[#1E1A17] hover:bg-[#C89B3C] hover:text-white'}`}
                          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                          <Heart size={13} className={isWishlisted ? 'fill-current' : ''} />
                        </motion.button>
                      </div>
                    </div>

                    <Link href={`/products/${product.slug ?? product.id}`}>
                      <div className="px-0.5">
                        <p className="text-[#C89B3C] font-sans text-[9px] tracking-[0.2em] uppercase mb-1">
                          {product.craft}
                        </p>
                        <h3
                          className="text-[#1E1A17] leading-snug mb-2 group-hover:text-[#6B3E26] transition-colors line-clamp-2"
                          style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1rem' }}
                        >
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={9}
                                className={i < Math.floor(product.rating) ? 'fill-[#C89B3C] text-[#C89B3C]' : 'text-[#D4C4B0]'}
                              />
                            ))}
                          </div>
                          <span className="text-[#5B4B3F] font-sans text-[9px]">({product.reviews})</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-[#1E1A17] font-sans text-sm font-semibold">
                            ₹{product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="text-[#5B4B3F] font-sans text-[11px] line-through">
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
