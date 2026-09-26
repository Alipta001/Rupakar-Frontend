'use client'

import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart, ArrowRight, Trash2, ShoppingBag } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { addCartItem, fetchWishlist, removeWishlistItem } from '@/lib/customer-api'
import { loginPathForCurrentLocation } from '@/lib/auth-redirect'
import { ProductGridSkeleton, ErrorState } from '@/components/skeletons'

const normalizeImage = (value: unknown) => {
  if (typeof value === 'string' && value.trim()) return value
  if (value && typeof value === 'object') {
    const candidate = value as Record<string, unknown>
    return typeof candidate.url === 'string' ? candidate.url : typeof candidate.src === 'string' ? candidate.src : '/images/product-vase.jpg'
  }
  return '/images/product-vase.jpg'
}

const normalizeWishlistItem = (entry: any) => {
  const product = entry?.product ?? entry?.productDetails ?? entry?.item ?? {}
  const variant = entry?.variant ?? product?.variants?.[0] ?? {}
  const productId = String(entry?.productId ?? product?._id ?? product?.id ?? entry?._id ?? 'unknown')
  const variantId = String(entry?.variantId ?? variant?._id ?? variant?.id ?? productId)

  return {
    id: productId,
    variantId,
    name: product?.name ?? entry?.name ?? 'Handcrafted Piece',
    price: Number(product?.price ?? variant?.price ?? entry?.price ?? 0),
    image: normalizeImage(product?.image ?? product?.primaryImage ?? product?.images?.[0] ?? entry?.image),
    artisan: product?.artisan ?? product?.vendorName ?? entry?.artisan ?? 'Rupakar Artisan',
  }
}

export default function WishlistPage() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { hydrated: authHydrated, isAuthenticated } = useSelector((state: any) => state.auth)

  useEffect(() => {
    if (authHydrated && !isAuthenticated) router.replace(loginPathForCurrentLocation())
  }, [authHydrated, isAuthenticated, router])

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['wishlist'],
    queryFn: fetchWishlist,
    enabled: authHydrated && isAuthenticated,
  })

  const items = Array.isArray(data?.items) ? data.items.map(normalizeWishlistItem) : Array.isArray(data) ? data.map(normalizeWishlistItem) : []

  const removeMutation = useMutation({
    mutationFn: (productId: string) => removeWishlistItem(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  })

  const addToCartMutation = useMutation({
    mutationFn: (item: any) => addCartItem({ productId: item.id, variantId: item.variantId, quantity: 1 }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  const handleRemove = async (productId: string) => {
    await removeMutation.mutateAsync(productId)
  }

  const handleAddToCart = async (item: any) => {
    await addToCartMutation.mutateAsync(item)
  }

  return (
    <main>
      <Navbar />
      <section className="min-h-screen bg-[#F8F4EE] pt-24 sm:pt-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8 sm:mb-10">
            <h1 className="text-[#1E1A17] mb-3" style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '2.5rem', fontWeight: 400 }}>
              Your Wishlist
            </h1>
            <p className="text-[#5B4B3F] font-sans text-sm">{(isLoading || isFetching) && items.length === 0 ? 'Loading wishlist…' : `${items.length} item${items.length === 1 ? '' : 's'} saved`}</p>
          </motion.div>

          {(isLoading || isFetching) && items.length === 0 ? (
            <ProductGridSkeleton count={6} />
          ) : isError && items.length === 0 ? (
            <ErrorState
              error={error}
              onRetry={() => refetch()}
              className="py-16"
            />
          ) : items.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-xl mx-auto">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#EFE3D3] flex items-center justify-center">
                <Heart size={32} className="text-[#7A1F1F]" strokeWidth={1.5} />
              </div>
              <h2 className="text-[#1E1A17] mb-3" style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '2.5rem', fontWeight: 400 }}>
                Your Wishlist is Empty
              </h2>
              <p className="text-[#5B4B3F] font-sans text-sm mb-8">Save your favorite handcrafted pieces to view them later.</p>
              <Link href="/collections">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="group relative inline-flex items-center gap-3 bg-[#1E1A17] text-[#F8F4EE] px-8 py-4 font-sans text-xs tracking-[0.2em] uppercase overflow-hidden">
                  <span className="relative z-10">Browse Collections</span>
                  <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  <motion.div className="absolute inset-0 bg-[#6B3E26]" initial={{ x: '-100%' }} whileHover={{ x: 0 }} transition={{ duration: 0.35 }} />
                </motion.div>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {items.map((item, index) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 * index }} className="rounded-lg border border-[#C89B3C]/20 bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden hover:shadow-md transition-all group">
                  <div className="relative aspect-square overflow-hidden bg-[#EFE3D3]">
                    <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    <button onClick={() => handleRemove(item.id)} className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-[#7A1F1F] hover:text-white hover:bg-[#7A1F1F] transition-colors shadow-lg" aria-label="Remove from wishlist">
                      <Trash2 size={16} strokeWidth={1.5} />
                    </button>
                  </div>

                  <div className="p-5 space-y-4">
                    <div>
                      <p className="font-sans text-[10px] tracking-[0.1em] uppercase text-[#5B4B3F] mb-2">{item.artisan}</p>
                      <h3 className="text-base font-semibold tracking-[-0.01em] mb-2">{item.name}</h3>
                      <p className="text-2xl font-bold text-[#C89B3C]">₹{Number(item.price).toLocaleString()}</p>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-[#D4C4B0]">
                      <button onClick={() => handleAddToCart(item)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-[#C89B3C] hover:bg-[#B7792B] text-white rounded-md font-sans text-xs tracking-[0.1em] uppercase transition-all font-medium">
                        <ShoppingBag size={14} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
