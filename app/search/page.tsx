'use client'

import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Search as SearchIcon, ShoppingBag, Heart, Star, X } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { fetchProducts, type Product } from '@/lib/products-api'
import { addCartItem, addWishlistItem, removeWishlistItem } from '@/lib/customer-api'

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

const SUGGESTED_SEARCHES = ['Terracotta', 'Madhubani', 'Pottery', 'Handloom', 'Dokra', 'Pattachitra', 'Folk Art']

export default function SearchPage() {
  const queryClient = useQueryClient()
  const [query, setQuery] = useState('')
  const [wishlistSet, setWishlistSet] = useState<Set<string>>(new Set())
  const debouncedQuery = useDebounce(query, 300)

  const { data: results = [], isLoading, isFetching } = useQuery<Product[]>({
    queryKey: ['search', debouncedQuery],
    queryFn: () => fetchProducts({ q: debouncedQuery, limit: 24 }),
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 30 * 1000,
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
        setWishlistSet((prev) => { const s = new Set(prev); s.delete(productId); return s })
      } else {
        await addWishlistItem(productId)
        setWishlistSet((prev) => new Set([...prev, productId]))
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  })

  const handleAddToCart = useCallback((product: any) => {
    const productId = String(product.id ?? product._id)
    const variantId = product.variantId ? String(product.variantId) : ''
    if (!productId || !variantId) return
    addToCartMutation.mutate({ productId, variantId, quantity: 1 })
  }, [addToCartMutation])

  const showResults = debouncedQuery.trim().length >= 2
  const showEmpty = showResults && !isLoading && !isFetching && results.length === 0

  return (
    <main>
      <Navbar />
      <section className="min-h-screen bg-[#F8F4EE] pt-28">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1
              className="text-[#1E1A17] mb-2 text-center"
              style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 400 }}
            >
              Search
            </h1>
            <p className="text-center text-[#5B4B3F] font-sans text-xs tracking-[0.1em] uppercase mb-10">
              Discover handcrafted artisan products
            </p>

            {/* Search input */}
            <div className="relative mb-10">
              <div className="relative">
                <SearchIcon
                  size={18}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-[#C89B3C]"
                />
                <input
                  id="search-input"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for terracotta, madhubani, pottery..."
                  autoFocus
                  className="w-full pl-14 pr-12 py-4 border-2 border-[#D4C4B0] bg-white text-[#1E1A17] font-sans text-sm focus:outline-none focus:border-[#C89B3C] transition-colors shadow-sm"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5B4B3F] hover:text-[#C89B3C] transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {/* Loading bar */}
              {(isLoading || isFetching) && showResults && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EFE3D3] overflow-hidden">
                  <motion.div
                    className="h-full bg-[#C89B3C]"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              )}
            </div>

            {/* Suggested searches */}
            {!showResults && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <p className="text-[#5B4B3F] font-sans text-[10px] tracking-[0.2em] uppercase mb-4">
                  Popular Searches
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                  {SUGGESTED_SEARCHES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="px-4 py-2 border border-[#D4C4B0] font-sans text-xs text-[#5B4B3F] hover:border-[#C89B3C] hover:text-[#C89B3C] transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <Link
                  href="/products"
                  className="inline-block text-[#C89B3C] hover:text-[#B7792B] font-sans text-xs tracking-[0.1em] uppercase underline underline-offset-4 transition-colors"
                >
                  View All Collections →
                </Link>
              </motion.div>
            )}

            {/* Empty state */}
            {showEmpty && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <p className="text-[#5B4B3F] font-sans text-sm mb-2">
                  No results found for &ldquo;<span className="text-[#1E1A17] font-semibold">{debouncedQuery}</span>&rdquo;
                </p>
                <p className="text-[#5B4B3F] font-sans text-xs mb-6">Try different keywords or browse our collections.</p>
                <Link href="/products" className="text-[#C89B3C] font-sans text-xs underline">
                  Browse All Products
                </Link>
              </motion.div>
            )}

            {/* Results grid */}
            <AnimatePresence mode="wait">
              {showResults && results.length > 0 && (
                <motion.div
                  key={debouncedQuery}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-[#5B4B3F] font-sans text-xs tracking-[0.05em] mb-6">
                    {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;<span className="text-[#1E1A17] font-medium">{debouncedQuery}</span>&rdquo;
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {results.map((product: Product, index: number) => {
                      const isWishlisted = wishlistSet.has(String(product.id))
                      return (
                        <motion.div
                          key={product.id ?? product.slug ?? index}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, delay: index * 0.04 }}
                          className="group"
                        >
                          <div className="relative overflow-hidden bg-[#EFE3D3] aspect-square mb-3">
                            <Link href={`/products/${product.slug ?? product.id}`}>
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 640px) 50vw, 25vw"
                              />
                            </Link>
                            {product.badge && (
                              <div className="absolute top-3 left-3 px-2.5 py-1" style={{ backgroundColor: product.badgeColor }}>
                                <span className="text-white font-sans text-[7px] tracking-[0.2em] uppercase">{product.badge}</span>
                              </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2 p-3">
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleAddToCart(product)}
                                className="flex-1 bg-[#1E1A17] text-[#F8F4EE] py-2.5 font-sans text-[9px] tracking-[0.15em] uppercase flex items-center justify-center gap-1.5 hover:bg-[#6B3E26] transition-colors"
                              >
                                <ShoppingBag size={11} />
                                Add
                              </motion.button>
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => wishlistMutation.mutate(String(product.id))}
                                className={`w-10 flex items-center justify-center transition-colors ${isWishlisted ? 'bg-[#C89B3C] text-white' : 'bg-white/90 text-[#1E1A17] hover:bg-[#C89B3C] hover:text-white'}`}
                              >
                                <Heart size={12} className={isWishlisted ? 'fill-current' : ''} />
                              </motion.button>
                            </div>
                          </div>
                          <Link href={`/products/${product.slug ?? product.id}`}>
                            <p className="text-[#C89B3C] font-sans text-[9px] tracking-[0.2em] uppercase mb-1">{product.craft}</p>
                            <h3
                              className="text-[#1E1A17] leading-snug mb-1.5 group-hover:text-[#6B3E26] transition-colors line-clamp-2"
                              style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1rem' }}
                            >
                              {product.name}
                            </h3>
                            <div className="flex items-center gap-1.5 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={9} className={i < Math.floor(product.rating) ? 'fill-[#C89B3C] text-[#C89B3C]' : 'text-[#D4C4B0]'} />
                              ))}
                              <span className="text-[#5B4B3F] font-sans text-[9px]">({product.reviews})</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                              <span className="font-sans text-sm font-semibold text-[#1E1A17]">₹{product.price.toLocaleString()}</span>
                              {product.originalPrice && (
                                <span className="font-sans text-[11px] text-[#5B4B3F] line-through">₹{product.originalPrice.toLocaleString()}</span>
                              )}
                            </div>
                          </Link>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
