'use client'

import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, Star, Shield, Truck, RotateCcw, Award, Check } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Product } from '@/lib/products-api'
import { addCartItem, addWishlistItem, createProductReview, fetchCart, fetchOrders, fetchProductReviews, fetchWishlist, removeWishlistItem } from '@/lib/customer-api'
import { getProductVariantId, hasCartVariant } from '@/lib/cart-state'
import { getCustomerErrorMessage } from '@/lib/api-errors'
import { loginPathForCurrentLocation } from '@/lib/auth-redirect'
import { Skeleton, ProductDetailSkeleton } from '@/components/skeletons'
import { RatingStars, InteractiveRatingStars } from '@/components/ui/rating-stars'
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
  const { isAuthenticated, hydrated: authHydrated } = useSelector((state: any) => state.auth)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariantId, setSelectedVariantId] = useState('')
  const [activeTab, setActiveTab] = useState<'story' | 'details' | 'care'>('story')
  const [cartError, setCartError] = useState('')
  const [reviewError, setReviewError] = useState('')
  const [reviewSuccess, setReviewSuccess] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewComment, setReviewComment] = useState('')

  const productId = String(product._id ?? product.id ?? '')
  const variants = (product.variants ?? []).filter((variant) => variant.status !== 'INACTIVE')
  const defaultVariantId = getProductVariantId(product)
  const variantId = selectedVariantId || defaultVariantId
  const selectedVariant = variants.find((variant) => String(variant._id ?? variant.id) === variantId)
  const productUnavailable = product.status && !['PUBLISHED', 'APPROVED'].includes(product.status)
  const { data: cartData } = useQuery({
    queryKey: ['cart'],
    queryFn: fetchCart,
    enabled: authHydrated && isAuthenticated,
    retry: false,
  })
  const { data: wishlistData } = useQuery({
    queryKey: ['wishlist'],
    queryFn: fetchWishlist,
    enabled: authHydrated,
    retry: false,
  })
  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['product-reviews', productId],
    queryFn: () => fetchProductReviews(productId),
    enabled: Boolean(productId),
    retry: false,
  })
  const { data: ordersData } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    enabled: authHydrated && isAuthenticated,
    retry: false,
  })
  const orders = Array.isArray(ordersData) ? ordersData : []
  const eligibleOrder = orders.find((order: any) => {
    const status = String(order?.status ?? '').toUpperCase()
    return ['DELIVERED', 'RETURNED', 'REFUNDED'].includes(status)
      && ['PAID', 'CAPTURED'].includes(String(order?.paymentStatus ?? '').toUpperCase())
      && Array.isArray(order?.items)
      && order.items.some((item: any) => String(item?.productId ?? item?.product?._id ?? '') === productId)
  })
  const wishlist = (Array.isArray(wishlistData?.items) ? wishlistData.items : []).some((item: any) =>
    String(item?.productId ?? item?.product?._id ?? item?.product?.id ?? item?._id ?? '') === productId,
  )

  const addToCartMutation = useMutation({
    mutationFn: (payload: { productId: string; variantId: string; quantity: number }) =>
      addCartItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      setCartError('')
    },
    onError: (error: unknown) => {
      setCartError(getCustomerErrorMessage(error, 'cart'))
      setTimeout(() => setCartError(''), 3000)
    },
  })

  const wishlistMutation = useMutation({
    mutationFn: async () => {
      if (wishlist) {
        await removeWishlistItem(productId)
      } else {
        const rawImg: any = product.images?.[0]
        const primaryImg = (typeof rawImg === 'object' ? rawImg?.url : rawImg) || product.image
        await addWishlistItem(productId, {
          name: product.name,
          price: product.price,
          image: primaryImg,
          artisan: product.craft || 'Rupakar Artisan',
        })
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  })

  const reviewMutation = useMutation({
    mutationFn: () => createProductReview({ productId, orderId: String(eligibleOrder?._id ?? eligibleOrder?.id ?? ''), rating: reviewRating, title: reviewTitle.trim(), comment: reviewComment.trim() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-reviews', productId] })
      setReviewTitle('')
      setReviewComment('')
      setReviewSuccess('Your review has been submitted.')
      setReviewError('')
    },
    onError: (error: unknown) => {
      const normalized = getCustomerErrorMessage(error, 'general')
      setReviewError(normalized.includes('Something went wrong') ? 'We couldn\'t submit your review right now. Please try again.' : normalized)
      setReviewSuccess('')
    },
  })

  const handleAddToBag = () => {
    if (!isAuthenticated) {
      window.location.href = `${loginPathForCurrentLocation()}&reason=bag`
      return
    }
    if (productUnavailable || !productId) {
      setCartError('This product is currently unavailable.')
      return
    }
    if (variants.length > 0 && !selectedVariant) {
      setCartError('This option is currently unavailable. Please choose another option.')
      return
    }
    if (!variantId) {
      setCartError('This item is currently out of stock.')
      return
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      setCartError('Please choose a valid quantity.')
      return
    }
    addToCartMutation.mutate({ productId, variantId, quantity })
  }

  const handleWishlist = () => {
    if (!isAuthenticated) {
      setCartError('Please sign in to save items to your wishlist.')
      window.setTimeout(() => { window.location.href = loginPathForCurrentLocation() }, 300)
      return
    }
    wishlistMutation.mutate()
  }

  const handleReviewStart = () => {
    if (!isAuthenticated) {
      window.location.href = loginPathForCurrentLocation()
      return
    }
    document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (searchParams.get('action') === 'add-to-cart') {
      const timer = window.setTimeout(handleAddToBag, 0)
      return () => window.clearTimeout(timer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  return (
    <div className="min-h-screen bg-[#F8F4EE] pt-20 sm:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 mb-6 sm:mb-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-12 lg:mb-24">
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
            <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 sm:flex-1 aspect-square overflow-hidden border-2 transition-all duration-300 ${
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
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 bg-[#F3ECE2] px-2.5 py-1 border border-[#DECDBB]">
                <RatingStars rating={product.rating} reviews={product.reviews} size={13} showNumber showCount={false} />
              </div>
              <a href="#reviews" className="text-[#5B4B3F] hover:text-[#C89B3C] font-sans text-xs underline underline-offset-4 transition-colors">
                {product.reviews} {product.reviews === 1 ? 'review' : 'reviews'}
              </a>
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
                <div className="text-[#5B4B3F] font-sans text-[10px] tracking-[0.1em] uppercase mb-1">Retailer / Artist</div>
                <div className="text-[#1E1A17]" style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.1rem', fontStyle: 'italic' }}>
                  {product.retailer || product.shopkeeper || product.artisan}
                </div>
                {product.brand?.name && <div className="text-[#5B4B3F] font-sans text-xs mt-1">Brand: {product.brand.name}</div>}
              </div>
            </div>

            {/* Quantity */}
            {variants.length > 1 && (
              <div className="mb-6">
                <label htmlFor="product-variant" className="block text-[#5B4B3F] font-sans text-[10px] tracking-[0.2em] uppercase mb-2">
                  Choose an option
                </label>
                <select
                  id="product-variant"
                  value={variantId}
                  onChange={(event) => setSelectedVariantId(event.target.value)}
                  className="w-full border border-[#D4C4B0] bg-white px-3 py-3 font-sans text-sm text-[#1E1A17]"
                >
                  {variants.map((variant) => {
                    const id = String(variant._id ?? variant.id ?? '')
                    const label = Object.values(variant.attributes ?? {}).filter(Boolean).join(' / ') || variant.sku || id
                    return <option key={id} value={id}>{label}</option>
                  })}
                </select>
              </div>
            )}

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
                disabled={addToCartMutation.isPending || hasCartVariant(cartData, variantId)}
                whileHover={{ scale: addToCartMutation.isPending || hasCartVariant(cartData, variantId) ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 flex items-center justify-center gap-2 py-4 font-sans text-xs tracking-[0.2em] uppercase transition-all duration-300 ${
                  hasCartVariant(cartData, variantId)
                    ? 'bg-[#2A5E3A] text-[#F8F4EE]'
                    : addToCartMutation.isPending
                    ? 'bg-[#3A2418] text-[#C89B3C] cursor-not-allowed'
                    : 'bg-[#1E1A17] text-[#F8F4EE] hover:bg-[#6B3E26]'
                }`}
              >
                {hasCartVariant(cartData, variantId) ? <Check size={14} /> : <ShoppingBag size={14} />}
                {hasCartVariant(cartData, variantId) ? 'In Bag' : addToCartMutation.isPending ? 'Adding…' : 'Add to Bag'}
              </motion.button>
              <motion.button
                onClick={handleWishlist}
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
              <div className="text-[#7A1F1F] font-sans text-xs mb-5 tracking-[0.05em]">
                <p>{cartError}</p>
                {!isAuthenticated && (
                  <Link href={`/login?redirect=/products/${encodeURIComponent(product.slug)}`} className="inline-block mt-2 underline">
                    Sign in
                  </Link>
                )}
              </div>
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

      <section id="reviews" className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="border-t border-[#D4C4B0] pt-10 sm:pt-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <p className="text-[#C89B3C] font-sans text-[10px] tracking-[0.3em] uppercase mb-3">Collected voices</p>
              <h2 className="text-[#1E1A17]" style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '2.5rem', fontWeight: 400 }}>Reviews</h2>
            </div>
            <div className="text-[#5B4B3F] font-sans text-sm">
              <div className="flex items-center gap-3">
                <strong className="text-[#1E1A17] text-2xl">{reviewsData?.averageRating || 0}</strong>
                <RatingStars rating={Number(reviewsData?.averageRating || 0)} size={15} showNumber={false} showCount={false} />
                <span className="text-[#5B4B3F]">({reviewsData?.total || 0} reviews)</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <span key={rating} className="bg-white/60 border border-[#D4C4B0] px-2 py-0.5 rounded-sm">
                    {rating}★ {reviewsData?.breakdown?.[rating] || 0}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {reviewsLoading ? (
            <div className="grid gap-5 md:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="border border-[#D4C4B0] bg-white/50 p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-14 w-full" />
                </div>
              ))}
            </div>
          ) : reviewsData?.items?.length ? (
            <div className="grid gap-5 md:grid-cols-2">
              {reviewsData.items.map((review: any) => (
                <article key={review.id ?? review._id} className="border border-[#D4C4B0] bg-white/50 p-5 sm:p-6">
                  <div className="flex justify-between items-center gap-4 mb-3">
                    <strong className="font-sans text-sm text-[#1E1A17]">{review.reviewerName || 'Rupakar Customer'}</strong>
                    <RatingStars rating={Number(review.rating || 0)} size={12} showNumber={false} showCount={false} />
                  </div>
                  <h3 className="font-sans text-sm font-semibold mb-2 text-[#1E1A17]">{review.title}</h3>
                  <p className="text-[#5B4B3F] font-sans text-sm leading-relaxed">{review.comment}</p>
                  <time className="block mt-4 text-[#5B4B3F]/70 font-sans text-xs">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}</time>
                </article>
              ))}
            </div>
          ) : <p className="text-[#5B4B3F] font-sans text-sm">No reviews yet. Be the first to share your experience.</p>}

          <div className="mt-10 border-t border-[#D4C4B0] pt-8">
            <h3 className="text-[#1E1A17] mb-4" style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.8rem' }}>Share your experience</h3>
            {!isAuthenticated ? <button onClick={handleReviewStart} className="border border-[#C89B3C] text-[#6B3E26] px-5 py-3 font-sans text-xs tracking-[0.15em] uppercase hover:bg-[#C89B3C]/10 transition-colors">Please sign in to write a review</button>
              : !eligibleOrder ? <p className="text-[#5B4B3F] font-sans text-sm">You can review products you&apos;ve purchased.</p>
                : <form onSubmit={(event) => { event.preventDefault(); if (reviewComment.trim().length < 3 || reviewTitle.trim().length < 3) { setReviewError('Please add a title and review of at least 3 characters.'); return } reviewMutation.mutate() }} className="max-w-2xl space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[#5B4B3F] font-sans text-xs tracking-wider uppercase">Rating</label>
                    <InteractiveRatingStars value={reviewRating} onChange={setReviewRating} size={22} />
                  </div>
                  <input value={reviewTitle} onChange={(event) => setReviewTitle(event.target.value)} placeholder="Review title" maxLength={120} className="w-full border border-[#D4C4B0] bg-white px-4 py-3 font-sans text-sm focus:outline-none focus:border-[#C89B3C]" />
                  <textarea value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} placeholder="Tell us about your experience" maxLength={2000} rows={4} className="w-full border border-[#D4C4B0] bg-white px-4 py-3 font-sans text-sm focus:outline-none focus:border-[#C89B3C]" />
                  <button disabled={reviewMutation.isPending} className="w-full sm:w-auto bg-[#1E1A17] text-[#F8F4EE] px-6 py-3.5 font-sans text-xs tracking-[0.15em] uppercase hover:bg-[#3A2A20] transition-colors">{reviewMutation.isPending ? 'Submitting…' : 'Submit review'}</button>
                </form>}
            {reviewError && <p className="mt-4 text-[#7A1F1F] font-sans text-sm">{reviewError}</p>}
            {reviewSuccess && <p className="mt-4 text-[#2A5E3A] font-sans text-sm">{reviewSuccess}</p>}
          </div>
        </div>
      </section>

      {/* Related products */}
      <BestSellers />
    </div>
  )
}

export default function ProductDetail({ product }: { product: Product }) {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailContent key={product.id ?? product._id ?? product.slug} product={product} />
    </Suspense>
  )
}
