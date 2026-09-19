'use client'

import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, Star, Shield, Truck, RotateCcw, Award, Check } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Product } from '@/lib/products-api'
import { addCartItem, addWishlistItem, fetchWishlist, removeWishlistItem } from '@/lib/customer-api'
import BestSellers from './best-sellers'

const guarantees = [
  { Icon: Shield, label: 'Authenticity Certified' },
  { Icon: Truck, label: 'Free Shipping ₹1500+' },
  { Icon: RotateCcw, label: '15-Day Easy Returns' },
  { Icon: Award, label: 'Artisan Approved' },
]

function ProductDetailContent({ product }: { product: Product }) {
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'story' | 'details' | 'care'>('story')
  const [addedToBag, setAddedToBag] = useState(false)
  const [cartError, setCartError] = useState('')

  const productId = String(product._id ?? '')
  const { data: wishlistData } = useQuery({
    queryKey: ['wishlist'],
    queryFn: fetchWishlist,
    retry: false,
  })
  const wishlist = (Array.isArray(wishlistData?.items) ? wishlistData.items : []).some((item: any) =>
    String(item?.productId ?? item?.product?._id ?? item?.product?.id ?? item?._id ?? '') === productId,
  )

  const addToCartMutation = useMutation({
    mutationFn: (payload: { productId: string; variantId: string; quantity: number }) =>
      addCartItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      setAddedToBag(true)
      setCartError('')
      setTimeout(() => setAddedToBag(false), 2500)
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Could not add to cart'
      setCartError(msg)
      setTimeout(() => setCartError(''), 3000)
    },
  })

  const wishlistMutation = useMutation({
    mutationFn: async () => {
      if (wishlist) {
        await removeWishlistItem(productId)
      } else {
        await addWishlistItem(productId)
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  })

  const handleAddToBag = () => {
    const productId = String(product._id ?? '')
    const variantId = String(product.variantId ?? (product as any).variants?.[0]?._id ?? '')
    if (!productId || !variantId) {
      setCartError('This product is not available for purchase right now')
      return
    }
    addToCartMutation.mutate({ productId, variantId, quantity })
  }

  useEffect(() => {
    if (searchParams.get('action') === 'add-to-cart') {
      const timer = window.setTimeout(handleAddToBag, 0)
      return () => window.clearTimeout(timer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  return (
    <div className="min-h-screen bg-[#F8F4EE] pt-24">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/" className="text-[#5B4B3F] hover:text-[#C89B3C] font-sans text-xs tracking-[0.1em] uppercase transition-colors">
            Home
          </Link>
          <span className="text-[#D4C4B0]">/</span>
          <Link
            href="/collections"
            className="text-[#5B4B3F] hover:text-[#C89B3C] font-sans text-xs tracking-[0.1em] uppercase transition-colors"
          >
            Collections
          </Link>
          <span className="text-[#D4C4B0]">/</span>
          <span className="text-[#1E1A17] font-sans text-xs tracking-[0.1em] uppercase">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Gallery */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative aspect-square overflow-hidden bg-[#EFE3D3]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {product.badge && (
                <div
                  className="absolute top-5 left-5 px-3 py-1.5"
                  style={{ backgroundColor: product.badgeColor }}
                >
                  <span className="text-[#F8F4EE] font-sans text-[8px] tracking-[0.2em] uppercase">
                    {product.badge}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative flex-1 aspect-square overflow-hidden border-2 transition-all duration-300 ${
                    i === selectedImage ? 'border-[#C89B3C]' : 'border-transparent'
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <Image src={img} alt={`${product.name} view ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product info — sticky */}
          <div className="lg:sticky lg:top-24 h-fit">
            {/* Origin */}
            <div className="text-[#C89B3C] font-sans text-[10px] tracking-[0.3em] uppercase mb-3">
              {product.region} · {product.craft}
            </div>

            <h1
              className="text-[#1E1A17] leading-tight mb-4"
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 400,
              }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className={i < Math.floor(product.rating) ? 'fill-[#C89B3C] text-[#C89B3C]' : 'text-[#D4C4B0]'} />
                ))}
              </div>
              <span className="text-[#5B4B3F] font-sans text-xs">{product.rating} ({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span
                className="text-[#1E1A17]"
                style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '2.2rem' }}
              >
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-[#5B4B3F] font-sans text-base line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="bg-[#7A1F1F] text-[#F8F4EE] font-sans text-[10px] tracking-[0.1em] px-2 py-1">
                    {Math.round((1 - product.price / product.originalPrice!) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Artisan line */}
            <div className="flex items-center gap-3 border-l-2 border-[#C89B3C] pl-4 mb-8">
              <div>
                <div className="text-[#5B4B3F] font-sans text-[10px] tracking-[0.1em] uppercase mb-0.5">
                  Crafted by
                </div>
                <div
                  className="text-[#1E1A17]"
                  style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.1rem', fontStyle: 'italic' }}
                >
                  {product.artisan}
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[#5B4B3F] font-sans text-[10px] tracking-[0.2em] uppercase">Qty</span>
              <div className="flex items-center border border-[#D4C4B0]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#1E1A17] hover:bg-[#EFE3D3] transition-colors"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-10 text-center font-sans text-sm text-[#1E1A17]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-[#1E1A17] hover:bg-[#EFE3D3] transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-3">
              <motion.button
                onClick={handleAddToBag}
                disabled={addToCartMutation.isPending}
                whileHover={{ scale: addToCartMutation.isPending ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 flex items-center justify-center gap-2 py-4 font-sans text-xs tracking-[0.2em] uppercase transition-all duration-300 ${
                  addedToBag
                    ? 'bg-[#2A5E3A] text-[#F8F4EE]'
                    : addToCartMutation.isPending
                    ? 'bg-[#3A2418] text-[#C89B3C] cursor-not-allowed'
                    : 'bg-[#1E1A17] text-[#F8F4EE] hover:bg-[#6B3E26]'
                }`}
              >
                {addedToBag ? <Check size={14} /> : <ShoppingBag size={14} />}
                {addedToBag ? 'Added to Bag!' : addToCartMutation.isPending ? 'Adding…' : 'Add to Bag'}
              </motion.button>
              <motion.button
                onClick={() => wishlistMutation.mutate()}
                disabled={wishlistMutation.isPending}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-14 border flex items-center justify-center transition-colors duration-300 ${
                  wishlist
                    ? 'border-[#7A1F1F] bg-[#7A1F1F]/10'
                    : 'border-[#D4C4B0] hover:border-[#C89B3C]'
                }`}
                aria-label={wishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart
                  size={16}
                  strokeWidth={1.5}
                  className={wishlist ? 'fill-[#7A1F1F] text-[#7A1F1F]' : 'text-[#1E1A17]'}
                />
              </motion.button>
            </div>
            {cartError && (
              <p className="text-[#7A1F1F] font-sans text-xs mb-5 tracking-[0.05em]">{cartError}</p>
            )}

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {guarantees.map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon size={12} className="text-[#C89B3C] flex-shrink-0" strokeWidth={1.5} />
                  <span className="font-sans text-[10px] text-[#5B4B3F] tracking-[0.08em]">{label}</span>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div>
              <div className="flex border-b border-[#D4C4B0] mb-5">
                {(['story', 'details', 'care'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 pb-3 font-sans text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 capitalize ${
                      activeTab === tab
                        ? 'text-[#C89B3C] border-b-2 border-[#C89B3C] -mb-px'
                        : 'text-[#5B4B3F] hover:text-[#1E1A17]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="font-sans text-xs text-[#5B4B3F] leading-relaxed space-y-2"
                  style={{ letterSpacing: '0.04em' }}
                >
                  {activeTab === 'story' && <p>{product.story}</p>}
                  {activeTab === 'details' && (
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-[#EFE3D3]">
                        <span className="text-[#1E1A17] tracking-[0.1em] uppercase text-[10px]">Dimensions</span>
                        <span>{product.dimensions}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-[#EFE3D3]">
                        <span className="text-[#1E1A17] tracking-[0.1em] uppercase text-[10px]">Material</span>
                        <span>{product.material}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-[#EFE3D3]">
                        <span className="text-[#1E1A17] tracking-[0.1em] uppercase text-[10px]">Artisan</span>
                        <span>{product.artisan}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-[#1E1A17] tracking-[0.1em] uppercase text-[10px]">Region</span>
                        <span>{product.region}</span>
                      </div>
                    </div>
                  )}
                  {activeTab === 'care' && <p>{product.care}</p>}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Description section */}
        <div className="max-w-3xl mx-auto text-center mb-20 py-16 border-t border-b border-[#D4C4B0]">
          <div className="ornament-divider mb-5">
            <span className="text-[#C89B3C] font-sans text-[10px] tracking-[0.3em] uppercase">The Piece</span>
          </div>
          <p
            className="text-[#3A2A20] leading-relaxed"
            style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.4rem', fontStyle: 'italic', lineHeight: 1.7 }}
          >
            {product.description}
          </p>
        </div>
      </div>

      {/* Related products */}
      <BestSellers />
    </div>
  )
}

export default function ProductDetail({ product }: { product: Product }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F4EE] pt-24" />}>
      <ProductDetailContent product={product} />
    </Suspense>
  )
}
