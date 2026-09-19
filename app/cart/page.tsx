'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { clearCart, fetchCart, removeCartItem, updateCartItem } from '@/lib/customer-api'

export default function CartPage() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: fetchCart,
  })

  const items: any[] = Array.isArray(data?.items) ? data.items : []

  const subtotal = Number(data?.subtotal ?? 0)
  const total = Number(data?.total ?? subtotal)

  const removeMutation = useMutation({
    mutationFn: (variantId: string) => removeCartItem(variantId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  const updateQuantityMutation = useMutation({
    mutationFn: ({ variantId, quantity }: { variantId: string; quantity: number }) => updateCartItem(variantId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  const clearMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  const updateQuantity = async (variantId: string, nextQuantity: number) => {
    if (!variantId) return
    if (nextQuantity <= 0) {
      await removeMutation.mutateAsync(variantId)
      return
    }

    await updateQuantityMutation.mutateAsync({ variantId, quantity: nextQuantity })
  }

  const handleRemove = async (variantId: string) => {
    await removeMutation.mutateAsync(variantId)
  }

  const handleClear = async () => {
    await clearMutation.mutateAsync()
  }

  return (
    <main>
      <Navbar />
      <section className="min-h-screen bg-[#F8F4EE] pt-32">
        <div className="max-w-5xl mx-auto px-6 py-20">
          {isLoading ? (
            <div className="rounded-lg border border-[#D4C4B0] bg-white/60 p-10 text-center text-[#5B4B3F] font-sans text-sm">Loading your cart…</div>
          ) : items.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#EFE3D3] flex items-center justify-center">
                <ShoppingBag size={32} className="text-[#C89B3C]" strokeWidth={1.5} />
              </div>
              <h1 className="text-[#1E1A17] mb-3" style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '2.5rem', fontWeight: 400 }}>
                Your Cart is Empty
              </h1>
              <p className="text-[#5B4B3F] font-sans text-sm mb-8 max-w-md mx-auto">
                Explore our collection of handcrafted pieces and add your favorites to get started.
              </p>
              <Link href="/collections">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="group relative inline-flex items-center gap-3 bg-[#1E1A17] text-[#F8F4EE] px-8 py-4 font-sans text-xs tracking-[0.2em] uppercase overflow-hidden">
                  <span className="relative z-10">Continue Shopping</span>
                  <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  <motion.div className="absolute inset-0 bg-[#6B3E26]" initial={{ x: '-100%' }} whileHover={{ x: 0 }} transition={{ duration: 0.35 }} />
                </motion.div>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_0.8fr] gap-8">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h1 className="text-[#1E1A17]" style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '2.5rem', fontWeight: 400 }}>
                    Your Bag
                  </h1>
                  <button onClick={handleClear} className="text-[#5B4B3F] hover:text-[#C89B3C] font-sans text-xs tracking-[0.1em] uppercase transition-colors">
                    Clear Cart
                  </button>
                </div>

                {items.map((item) => {
                  const quantity = Number(item?.quantity ?? 1)
                  const price = Number(item?.price ?? item?.unitPrice ?? 0)
                  const variantId = String(item?.variantId ?? item?._id ?? item?.id ?? '')
                  const productName = item?.productName ?? item?.name ?? 'Handcrafted Piece'

                  return (
                    <motion.div key={variantId || productName} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-[#D4C4B0] bg-white/70 p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div className="flex-1">
                        <p className="font-sans text-[10px] tracking-[0.12em] uppercase text-[#5B4B3F] mb-2">Artisan Pick</p>
                        <h3 className="text-[#1E1A17] text-lg font-semibold mb-1">{productName}</h3>
                        <p className="text-[#C89B3C] font-sans text-sm">₹{price.toLocaleString()} each</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-[#D4C4B0] bg-[#F8F4EE]">
                          <button onClick={() => updateQuantity(variantId, quantity - 1)} className="w-9 h-9 flex items-center justify-center text-[#1E1A17] hover:bg-[#EFE3D3]">
                            <Minus size={14} />
                          </button>
                          <span className="min-w-10 text-center font-sans text-sm text-[#1E1A17]">{quantity}</span>
                          <button onClick={() => updateQuantity(variantId, quantity + 1)} className="w-9 h-9 flex items-center justify-center text-[#1E1A17] hover:bg-[#EFE3D3]">
                            <Plus size={14} />
                          </button>
                        </div>

                        <button onClick={() => handleRemove(variantId)} className="p-2 rounded-full hover:bg-[#EFE3D3] text-[#5B4B3F] hover:text-[#7A1F1F] transition-colors" aria-label="Remove item">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <div className="rounded-lg border border-[#D4C4B0] bg-white/80 p-6 h-fit">
                <h2 className="text-[#1E1A17] mb-6" style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.8rem' }}>Order Summary</h2>
                <div className="space-y-4 text-[#5B4B3F] font-sans text-sm">
                  <div className="flex justify-between pb-3 border-b border-[#D4C4B0]">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-[#D4C4B0]">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between pt-2 text-[#1E1A17] font-bold text-base">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <Link href="/checkout" className="mt-6 block w-full bg-[#1E1A17] text-[#F8F4EE] px-6 py-4 font-sans text-xs tracking-[0.2em] uppercase text-center transition-colors hover:bg-[#6B3E26]">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-20 pt-20 border-t border-[#D4C4B0]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Free Shipping', desc: 'On orders over ₹1,500' },
                { title: 'Easy Returns', desc: '15-day return window' },
                { title: 'Authentic', desc: 'Directly from artisans' },
              ].map((item, i) => (
                <motion.div key={item.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.1 }} className="text-center">
                  <h3 className="text-[#1E1A17] mb-2" style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.3rem' }}>{item.title}</h3>
                  <p className="text-[#5B4B3F] font-sans text-xs">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
