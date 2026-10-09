'use client'

import React, { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, ShoppingBag, Eye } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Product } from '@/lib/products-api'
import { fetchWishlist, addWishlistItem, removeWishlistItem, fetchCart, addCartItem } from '@/lib/customer-api'
import { getProductVariantId, hasCartVariant } from '@/lib/cart-state'
import { RatingStars } from '@/components/ui/rating-stars'

export interface ProductCardProps {
  product: Product
  priority?: boolean
  className?: string
}

export function ProductCard({ product, priority = false, className = '' }: ProductCardProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const productId = String(product._id ?? product.id ?? '')
  const productSlug = product.slug || productId

  // Real Wishlist state synchronization
  const { data: wishlistData } = useQuery({
    queryKey: ['wishlist'],
    queryFn: fetchWishlist,
    retry: false,
    staleTime: 30 * 1000,
  })

  const isWishlisted = useMemo(() => {
    if (!productId) return false
    const items = Array.isArray(wishlistData?.items) ? wishlistData.items : []
    return items.some((item: any) => {
      const id = String(item?.productId ?? item?.product?._id ?? item?.product?.id ?? item?._id ?? '')
      return id === productId
    })
  }, [wishlistData, productId])

  const wishlistMutation = useMutation({
    mutationFn: async () => {
      if (!productId) return
      if (isWishlisted) {
        await removeWishlistItem(productId)
      } else {
        await addWishlistItem(productId, {
          name: product.name,
          price: product.price,
          image: product.image,
          artisan: product.artisan || product.craft || 'Rupakar Artisan',
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },
  })

  // Real Cart state synchronization
  const { data: cartData } = useQuery({
    queryKey: ['cart'],
    queryFn: fetchCart,
    retry: false,
    staleTime: 30 * 1000,
  })

  const variantId = getProductVariantId(product)
  const isInCart = Boolean(variantId && hasCartVariant(cartData, variantId))

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!productId) return
      if (!variantId) {
        router.push(`/products/${productSlug}`)
        return
      }
      await addCartItem({
        productId,
        variantId,
        quantity: 1,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0

  const primaryImage = product.image || product.images?.[0] || '/images/product-vase.jpg'
  const secondaryImage =
    Array.isArray(product.images) && product.images.length > 1 && product.images[1] !== primaryImage
      ? product.images[1]
      : null

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    wishlistMutation.mutate()
  }

  const handleAddToBag = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isInCart) {
      router.push('/cart')
      return
    }
    addToCartMutation.mutate()
  }

  return (
    <article
      className={`group relative flex flex-col h-full bg-[#FAF7F2] rounded-2xl border border-[#D4C4B0]/70 hover:border-[#C89B3C] shadow-[0_2px_12px_rgba(30,26,23,0.03)] hover:shadow-[0_18px_42px_rgba(107,62,38,0.14)] transition-all duration-500 hover:-translate-y-1.5 overflow-hidden motion-reduce:hover:translate-y-0 motion-reduce:transition-none ${className}`}
    >
      {/* ─── Image Container Area ─── */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#EFE3D3]">
        <Link
          href={`/products/${productSlug}`}
          className="absolute inset-0 block cursor-pointer"
          aria-label={`View details for ${product.name}`}
        >
          {/* Primary Product Image */}
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover object-center transition-all duration-700 ease-out group-hover:scale-106 ${
              secondaryImage ? 'group-hover:opacity-0' : ''
            }`}
          />

          {/* Secondary Hover Image (if available) */}
          {secondaryImage && (
            <Image
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-center transition-all duration-700 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-106"
            />
          )}

          {/* Warm cinematic bottom vignette for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A120B]/70 via-[#1A120B]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </Link>

        {/* Top-Left Badge (Curated badge or Discount) */}
        <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 z-10 pointer-events-none flex flex-col gap-1 items-start">
          {product.badge ? (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1E1A17]/85 backdrop-blur-md text-[#F8F4EE] text-[8.5px] font-sans font-semibold tracking-[0.16em] uppercase shadow-md border"
              style={{ borderColor: product.badgeColor ? `${product.badgeColor}80` : '#C89B3C66' }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: product.badgeColor || '#C89B3C' }}
              />
              {product.badge}
            </span>
          ) : discountPercent > 0 ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#7A1F1F]/90 backdrop-blur-md text-[#F8F4EE] text-[8px] font-sans font-semibold tracking-wider uppercase shadow-md">
              {discountPercent}% OFF
            </span>
          ) : null}
        </div>

        {/* Top-Right Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          disabled={wishlistMutation.isPending}
          className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 z-20 w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-[#FAF7F2]/90 hover:bg-white backdrop-blur-md border border-[#D4C4B0]/80 hover:border-[#C89B3C] flex items-center justify-center transition-all duration-300 shadow-sm active:scale-90"
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <Heart
            size={14}
            strokeWidth={1.8}
            className={`transition-colors duration-200 ${
              isWishlisted ? 'fill-[#7A1F1F] text-[#7A1F1F]' : 'text-[#1E1A17] hover:text-[#7A1F1F]'
            }`}
          />
        </button>

        {/* Bottom Floating Quick-Action Dock */}
        <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 right-2.5 sm:right-3 z-10 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handleAddToBag}
            disabled={addToCartMutation.isPending}
            className={`flex-1 py-2 px-3 rounded-xl backdrop-blur-md text-[9px] sm:text-[9.5px] font-sans font-semibold tracking-[0.16em] uppercase transition-all duration-300 flex items-center justify-center gap-1.5 shadow-lg active:scale-95 ${
              isInCart
                ? 'bg-[#2E6B3E]/95 hover:bg-[#255833] text-[#F8F4EE] border border-[#2E6B3E]'
                : 'bg-[#1E1A17]/95 hover:bg-[#C89B3C] text-[#F8F4EE] hover:text-[#171311] border border-[#C89B3C]/40'
            }`}
            aria-label={isInCart ? 'In Bag (View Cart)' : `Add ${product.name} to Bag`}
          >
            <ShoppingBag size={12} strokeWidth={2} />
            <span>{isInCart ? 'In Bag' : addToCartMutation.isPending ? 'Adding…' : 'Add to Bag'}</span>
          </button>

          <Link
            href={`/products/${productSlug}`}
            className="w-8 h-8 rounded-xl bg-[#1E1A17]/95 hover:bg-[#C89B3C] text-[#F8F4EE] hover:text-[#171311] backdrop-blur-md border border-[#C89B3C]/40 flex items-center justify-center transition-all duration-300 shadow-lg active:scale-95"
            aria-label={`View details for ${product.name}`}
            title="View details"
          >
            <Eye size={13} strokeWidth={2} />
          </Link>
        </div>
      </div>

      {/* ─── Product Information Area ─── */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4 justify-between gap-2.5">
        <div>
          {/* Craft Origin & Region */}
          <div className="flex items-center justify-between gap-1 text-[#C89B3C] font-sans text-[8.5px] sm:text-[9px] font-semibold tracking-[0.2em] uppercase mb-1">
            <span className="truncate">{product.craft || 'Handcrafted Heritage'}</span>
            {product.region && (
              <span className="text-[#8C7A6B] font-normal text-[8.5px] lowercase tracking-normal truncate hidden sm:inline">
                · {product.region}
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link href={`/products/${productSlug}`} className="block">
            <h3
              className="text-[#1E1A17] leading-snug group-hover:text-[#6B3E26] transition-colors line-clamp-2 min-h-[2.4rem] sm:min-h-[2.6rem]"
              style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.14rem', fontWeight: 500 }}
              title={product.name}
            >
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Footer Details: Ratings & Price */}
        <div className="space-y-2 pt-2 border-t border-[#E8DFD3]/80">
          <div className="flex items-center justify-between">
            <RatingStars
              rating={product.rating || 4.8}
              reviews={product.reviews || 0}
              size={11}
              showNumber={false}
              showCount={true}
            />
            {product.artisan && (
              <span className="text-[8.5px] font-sans text-[#8C7A6B] truncate max-w-[100px] hidden sm:inline" title={product.artisan}>
                By {product.artisan}
              </span>
            )}
          </div>

          {/* Price, MRP and Discount */}
          <div className="flex items-baseline justify-between gap-1 flex-wrap">
            <div className="flex items-baseline gap-2">
              <span
                className="text-[#1E1A17] font-semibold tracking-tight"
                style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.28rem' }}
              >
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[#8C7A6B] font-sans text-xs line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="text-[9px] font-sans font-semibold text-[#7A1F1F] bg-[#7A1F1F]/10 px-1.5 py-0.5 rounded">
                {discountPercent}% OFF
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
