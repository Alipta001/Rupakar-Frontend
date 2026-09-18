'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Trash2, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { addCartItem, fetchWishlist, removeWishlistItem } from '@/lib/customer-api'

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
  const [wishlist, setWishlist] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const payload = await fetchWishlist().catch(() => ({ items: [] }))
        const list = Array.isArray(payload?.items) ? payload.items : Array.isArray(payload) ? payload : []
        setWishlist(list.map(normalizeWishlistItem))
      } catch {
        setWishlist([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const handleRemove = async (productId: string) => {
    await removeWishlistItem(productId).catch(() => undefined)
    setWishlist((current) => current.filter((item) => item.id !== productId))
  }

  const handleAddToCart = async (item: any) => {
    await addCartItem({
      productId: item.id,
      variantId: item.variantId,
      quantity: 1,
    }).catch(() => undefined)
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl md:text-4xl tracking-[-0.02em] mb-2" style={{ fontFamily: 'var(--font-cormorant)' }}>
          My Wishlist
        </h1>
        <p className="text-[#5B4B3F] font-sans text-sm tracking-[0.05em]">
          {loading ? 'Loading…' : `${wishlist.length} item${wishlist.length === 1 ? '' : 's'} saved`}
        </p>
      </motion.div>

      {loading ? (
        <div className="rounded-lg border border-[#C89B3C]/20 bg-white/70 p-6 text-sm text-[#5B4B3F]">Loading your wishlist…</div>
      ) : wishlist.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="text-center py-16 rounded-lg border border-dashed border-[#D4C4B0] bg-white/30">
          <Heart size={48} className="mx-auto mb-4 text-[#C89B3C]/40" strokeWidth={1.5} />
          <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-cormorant)' }}>Your wishlist is empty</h3>
          <p className="text-[#5B4B3F] font-sans text-sm tracking-[0.05em] mb-4">Start adding items to save them for later</p>
          <Link href="/collections" className="inline-block px-6 py-2.5 bg-[#C89B3C] hover:bg-[#B7792B] text-white rounded-md font-sans text-xs tracking-[0.1em] uppercase transition-all font-medium">Explore Collections</Link>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item, index) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }} className="rounded-lg border border-[#C89B3C]/20 bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden hover:shadow-md transition-all group">
              <div className="relative aspect-square overflow-hidden bg-[#EFE3D3]">
                <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => handleRemove(item.id)} className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-[#7A1F1F] hover:text-white hover:bg-[#7A1F1F] transition-colors shadow-lg">
                  <Trash2 size={16} strokeWidth={1.5} />
                </motion.button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <p className="font-sans text-[10px] tracking-[0.1em] uppercase text-[#5B4B3F] mb-2">{item.artisan}</p>
                  <h3 className="text-base font-semibold tracking-[-0.01em] mb-2">{item.name}</h3>
                  <p className="text-2xl font-bold text-[#C89B3C]">₹{Number(item.price).toLocaleString()}</p>
                </div>

                <div className="flex gap-2 pt-2 border-t border-[#D4C4B0]">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleAddToCart(item)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-[#C89B3C] hover:bg-[#B7792B] text-white rounded-md font-sans text-xs tracking-[0.1em] uppercase transition-all font-medium">
                    <ShoppingBag size={14} />
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
