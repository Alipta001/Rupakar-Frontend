'use client'

import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, MapPin, CreditCard, Truck, CheckCircle, Plus, X } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { cancelOrder, confirmPayment, createAddress, createOrder, fetchAddresses, fetchCart, fetchOrder, fetchPaymentConfig, previewCheckout } from '@/lib/customer-api'
import { refreshCheckoutAfterPaymentCancellation } from '@/lib/checkout-state'
import { loginPathForCurrentLocation } from '@/lib/auth-redirect'
import { useSelector } from 'react-redux'

type Step = 'address' | 'payment' | 'review'

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', description: 'Pay when your order arrives', icon: '🏠' },
  { id: 'razorpay', label: 'Online Payment', description: 'UPI, Net Banking, Cards via Razorpay', icon: '💳' },
]

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void }
  }
}

const loadRazorpayCheckout = async () => {
  if (window.Razorpay) return window.Razorpay

  await new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true })
      existingScript.addEventListener('error', () => reject(new Error('Unable to load Razorpay Checkout')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Unable to load Razorpay Checkout'))
    document.body.appendChild(script)
  })

  if (!window.Razorpay) throw new Error('Razorpay Checkout is unavailable')
  return window.Razorpay
}

export default function CheckoutPage() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { hydrated: authHydrated, isAuthenticated } = useSelector((state: any) => state.auth)
  const [step, setStep] = useState<Step>('address')
  const [selectedAddressIdOverride, setSelectedAddressIdOverride] = useState<string | null>(null)
  const [newAddressMode, setNewAddressMode] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null)
  const [orderError, setOrderError] = useState('')
  const [addressError, setAddressError] = useState('')
  const [newAddress, setNewAddress] = useState({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  })

  useEffect(() => {
    if (authHydrated && !isAuthenticated) router.replace(loginPathForCurrentLocation())
  }, [authHydrated, isAuthenticated, router])

  const { data: cartData, isLoading: cartLoading, isError: cartError } = useQuery({
    queryKey: ['cart'],
    queryFn: fetchCart,
    enabled: authHydrated && isAuthenticated,
  })

  const { data: addressesData = [], isLoading: addressesLoading, isError: addressesError } = useQuery({
    queryKey: ['addresses'],
    queryFn: fetchAddresses,
    enabled: authHydrated && isAuthenticated,
    retry: false,
  })

  const { data: paymentConfig, isError: paymentConfigError } = useQuery({
    queryKey: ['payment-config'],
    queryFn: fetchPaymentConfig,
    retry: false,
  })

  const razorpayEnabled = paymentConfig?.razorpayEnabled === true
  const paymentMethods = PAYMENT_METHODS.filter((method) => {
    if (method.id === 'razorpay') return razorpayEnabled
    return true
  })

  const addresses = Array.isArray(addressesData) ? addressesData : []
  const selectedAddressId = selectedAddressIdOverride ?? (addresses[0] ? String(addresses[0]._id ?? addresses[0].id) : null)
  const items: any[] = Array.isArray(cartData?.items) ? cartData.items : []

  const previewQuery = useQuery({
    queryKey: ['checkout-preview', selectedAddressId, items.map((i) => `${i.productId}:${i.variantId}:${i.quantity}`)],
    enabled: items.length > 0,
    queryFn: () =>
      previewCheckout({
        items: items.map((item: any) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: Number(item.quantity ?? 1),
        })),
        ...(selectedAddressId ? { shippingAddressId: selectedAddressId } : {}),
      }),
    staleTime: 30 * 1000,
  })

  const summary = previewQuery.data
  const subtotal = Number(summary?.subtotal ?? 0)
  const shipping = Number(summary?.shipping ?? 0)
  const total = Number(summary?.total ?? 0)
  const previewError = previewQuery.isError
  const previewLoading = previewQuery.isLoading || previewQuery.isFetching
  const previewErrorMessage = (previewQuery.error as any)?.response?.data?.error?.message ?? 'Unable to calculate the current total.'

  const saveAddressMutation = useMutation({
    mutationFn: async () => {
      setAddressError('')
      return createAddress({
        fullName: newAddress.name,
        name: newAddress.name,
        addressLine1: newAddress.line1,
        line1: newAddress.line1,
        addressLine2: newAddress.line2,
        city: newAddress.city,
        district: newAddress.city,
        state: newAddress.state,
        postalCode: newAddress.pincode,
        pincode: newAddress.pincode,
        phone: newAddress.phone,
        country: 'India',
      })
    },
    onSuccess: (saved: any) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      const savedId = saved?._id ?? saved?.id ?? null
      if (savedId) setSelectedAddressIdOverride(String(savedId))
      setNewAddressMode(false)
      setAddressError('')
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.error?.message ?? err?.response?.data?.message ?? err?.message ?? 'Failed to save address'
      setAddressError(msg)
    },
  })

  const placeOrderMutation = useMutation({
    mutationFn: async () => {
      setOrderError('')
      let addressId = selectedAddressId

      // If user filled in a new address but didn't click save, save it automatically
      if (!addressId && newAddress.name && newAddress.line1 && newAddress.city && newAddress.pincode) {
        try {
          const saved = await createAddress({
            fullName: newAddress.name,
            name: newAddress.name,
            addressLine1: newAddress.line1,
            line1: newAddress.line1,
            addressLine2: newAddress.line2,
            city: newAddress.city,
            district: newAddress.city,
            state: newAddress.state,
            postalCode: newAddress.pincode,
            pincode: newAddress.pincode,
            phone: newAddress.phone,
            country: 'India',
          })
          addressId = String(saved?._id ?? saved?.id ?? '')
          if (addressId) setSelectedAddressIdOverride(addressId)
        } catch {
          // Fall through to passing shippingAddress object
        }
      }

      const order = await createOrder({
        ...(addressId ? { shippingAddressId: addressId } : {
          shippingAddress: {
            fullName: newAddress.name,
            name: newAddress.name,
            addressLine1: newAddress.line1,
            addressLine2: newAddress.line2,
            city: newAddress.city,
            state: newAddress.state,
            postalCode: newAddress.pincode,
            phone: newAddress.phone,
            country: 'India',
          }
        }),
        paymentMethod,
        idempotencyKey: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      })

      if (paymentMethod !== 'razorpay') return order

      const payment = order?.payment
      const orderId = String(order?._id ?? order?.id ?? '')
      if (!payment?.publicKey || !payment?.providerOrderId || !orderId) {
        throw new Error('Online payment is not available for this order')
      }

      let paymentSubmitted = false
      try {
        const Razorpay = await loadRazorpayCheckout()
        await new Promise<void>((resolve, reject) => {
          const checkout = new Razorpay({
            key: payment.publicKey,
            amount: Math.round(Number(payment.amount) * 100),
            currency: payment.currency ?? 'INR',
            name: 'Rupakar',
            description: 'Handcrafted artisan order',
            order_id: payment.providerOrderId,
            handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
              paymentSubmitted = true
              let confirmationError: unknown
              try {
                for (let attempt = 0; attempt < 2; attempt += 1) {
                  try {
                    await confirmPayment({ orderId, ...response })
                    resolve()
                    return
                  } catch (error) {
                    confirmationError = error
                  }
                }
                reject(confirmationError)
              } catch (error) {
                reject(error)
              }
            },
            modal: { ondismiss: () => reject(new Error('Payment was cancelled')) },
          })
          checkout.open()
        })
      } catch (error) {
        if (!paymentSubmitted) {
          await cancelOrder(orderId)
            .then(() => refreshCheckoutAfterPaymentCancellation(queryClient))
            .catch(() => undefined)
        }
        throw error
      }

      return paymentMethod === 'razorpay'
        ? await fetchOrder(orderId)
        : order
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      router.replace('/account/orders')
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.error?.message ?? err?.response?.data?.message ?? err?.message ?? 'Failed to place order. Please try again.'
      setOrderError(msg)
    },
  })

  const showNewAddressMode = newAddressMode || addresses.length === 0
  const canProceedFromAddress = selectedAddressId || (showNewAddressMode && newAddress.name && newAddress.line1 && newAddress.city && newAddress.pincode)

  // Order success screen
  if (orderSuccess) {
    return (
      <main>
        <Navbar />
        <section className="min-h-screen bg-[#F8F4EE] pt-32 flex items-center">
          <div className="max-w-2xl mx-auto px-6 py-20 text-center w-full">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
              <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-[#EFE3D3] flex items-center justify-center">
                <CheckCircle size={40} className="text-[#C89B3C]" strokeWidth={1.5} />
              </div>
              <h1
                className="text-[#1E1A17] mb-4"
                style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '3rem', fontWeight: 400 }}
              >
                Order Placed!
              </h1>
              <p className="text-[#5B4B3F] font-sans text-sm mb-2">
                Your artisan order has been confirmed. You will receive an email confirmation shortly.
              </p>
              <p className="text-[#5B4B3F] font-sans text-xs mb-10 tracking-[0.05em]">
                Order ID: <span className="text-[#1E1A17] font-mono">{orderSuccess}</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/account/orders">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 bg-[#1E1A17] text-[#F8F4EE] px-8 py-4 font-sans text-xs tracking-[0.2em] uppercase"
                  >
                    Track Order
                    <ArrowRight size={13} />
                  </motion.div>
                </Link>
                <Link href="/products">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 border border-[#D4C4B0] text-[#5B4B3F] px-8 py-4 font-sans text-xs tracking-[0.2em] uppercase hover:border-[#C89B3C] hover:text-[#C89B3C] transition-colors"
                  >
                    Continue Shopping
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main>
      <Navbar />
      <section className="min-h-screen bg-[#F8F4EE] pt-28">
        <div className="max-w-6xl mx-auto px-6 py-10">
          {cartLoading ? (
            <div className="rounded-lg border border-[#D4C4B0] bg-white/60 p-10 text-center text-[#5B4B3F] font-sans text-sm">
              Preparing your checkout…
            </div>
          ) : cartError ? (
            <div className="rounded-lg border border-[#D4C4B0] bg-white/60 p-10 text-center text-[#7A1F1F] font-sans text-sm">
              Unable to load your cart. Please refresh and try again.
            </div>
          ) : items.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
              <h1 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '2.5rem', fontWeight: 400 }} className="text-[#1E1A17] mb-3">
                Checkout
              </h1>
              <p className="text-[#5B4B3F] font-sans text-sm mb-8">Your cart is empty. Add some beautiful artisan pieces first.</p>
              <Link href="/products">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-flex items-center gap-3 bg-[#1E1A17] text-[#F8F4EE] px-8 py-4 font-sans text-xs tracking-[0.2em] uppercase">
                  Browse Collections
                  <ArrowRight size={13} />
                </motion.div>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Steps */}
              <div className="lg:col-span-2 space-y-6">
                {/* Step indicators */}
                <div className="flex items-center gap-0 mb-2 overflow-x-auto">
                  {(['address', 'payment', 'review'] as Step[]).map((s, i) => {
                    const labels = { address: 'Shipping', payment: 'Payment', review: 'Review' }
                    const icons = { address: MapPin, payment: CreditCard, review: Truck }
                    const Icon = icons[s]
                    const isDone = (step === 'payment' && s === 'address') || (step === 'review' && s !== 'review')
                    const isActive = step === s
                    return (
                      <div key={s} className="flex items-center flex-1 min-w-[80px]">
                        <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 transition-all font-sans text-[9px] sm:text-[10px] tracking-[0.05em] sm:tracking-[0.1em] uppercase whitespace-nowrap ${isActive ? 'text-[#C89B3C]' : isDone ? 'text-[#5B4B3F]' : 'text-[#D4C4B0]'}`}>
                          <Icon size={12} className="shrink-0" />
                          {labels[s]}
                        </div>
                        {i < 2 && <div className={`flex-1 h-px ${isDone ? 'bg-[#C89B3C]' : 'bg-[#D4C4B0]'}`} />}
                      </div>
                    )
                  })}
                </div>

                {/* Step 1: Shipping Address */}
                <AnimatePresence mode="wait">
                  {step === 'address' && (
                    <motion.div key="address" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                      <div className="bg-white border border-[#D4C4B0] p-6 md:p-8">
                        <h2 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.6rem' }} className="text-[#1E1A17] mb-6">
                          Shipping Address
                        </h2>

                        {addressesLoading && (
                          <p className="text-[#5B4B3F] font-sans text-xs mb-4">Loading saved addresses…</p>
                        )}
                        {addressesError && (
                          <p className="text-[#7A1F1F] font-sans text-xs mb-4">Unable to load saved addresses. You can enter a new address.</p>
                        )}

                        {addresses.length > 0 && (
                          <div className="space-y-3 mb-6">
                            {addresses.map((addr: any) => {
                              const addrId = String(addr._id ?? addr.id)
                              return (
                                <label
                                  key={addrId}
                                  className={`flex gap-3 p-4 border cursor-pointer transition-all ${selectedAddressId === addrId ? 'border-[#C89B3C] bg-[#FBF6EE]' : 'border-[#D4C4B0] hover:border-[#C89B3C]/50'}`}
                                >
                                  <input
                                    type="radio"
                                    name="address"
                                    value={addrId}
                                    checked={selectedAddressId === addrId}
                                    onChange={() => { setSelectedAddressIdOverride(addrId); setNewAddressMode(false) }}
                                    className="mt-1 accent-[#C89B3C]"
                                  />
                                  <div>
                                    <p className="font-sans text-sm font-semibold text-[#1E1A17]">{addr.fullName || addr.name || 'Shipping Address'}</p>
                                    <p className="font-sans text-xs text-[#5B4B3F] mt-0.5">
                                      {addr.addressLine1 || addr.line1}{(addr.addressLine2 || addr.line2) ? `, ${addr.addressLine2 || addr.line2}` : ''}, {addr.city}, {addr.state} — {addr.postalCode || addr.pincode}
                                    </p>
                                    {(addr.phone || addr.phoneNumber) && <p className="font-sans text-xs text-[#5B4B3F]">{addr.phone || addr.phoneNumber}</p>}
                                  </div>
                                </label>
                              )
                            })}

                            {!showNewAddressMode && (
                              <button
                                onClick={() => { setNewAddressMode(true); setSelectedAddressIdOverride(null) }}
                                className="flex items-center gap-2 text-[#C89B3C] font-sans text-xs tracking-[0.1em] uppercase hover:text-[#B7792B] transition-colors mt-2"
                              >
                                <Plus size={13} />
                                Add New Address
                              </button>
                            )}
                          </div>
                        )}

                        {showNewAddressMode && (
                          <div className="border border-[#D4C4B0] p-5 bg-[#FAFAF8]">
                            <div className="flex items-center justify-between mb-4">
                              <p className="font-sans text-xs tracking-[0.15em] uppercase text-[#5B4B3F]">New Shipping Address</p>
                              {addresses.length > 0 && (
                                <button onClick={() => { setNewAddressMode(false); setSelectedAddressIdOverride(addresses[0] ? String(addresses[0]._id ?? addresses[0].id) : null) }}>
                                  <X size={14} className="text-[#5B4B3F] hover:text-[#1E1A17]" />
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {[
                                { key: 'name', label: 'Full Name', col: 2 },
                                { key: 'line1', label: 'Address Line 1', col: 2 },
                                { key: 'line2', label: 'Address Line 2 (Optional)', col: 2 },
                                { key: 'city', label: 'City', col: 1 },
                                { key: 'state', label: 'State', col: 1 },
                                { key: 'pincode', label: 'PIN Code', col: 1 },
                                { key: 'phone', label: 'Phone Number', col: 1 },
                              ].map(({ key, label, col }) => (
                                <div key={key} className={col === 2 ? 'md:col-span-2' : ''}>
                                  <label className="block font-sans text-[10px] tracking-[0.15em] uppercase text-[#5B4B3F] mb-1.5">{label}</label>
                                  <input
                                    type={key === 'phone' || key === 'pincode' ? 'tel' : 'text'}
                                    value={newAddress[key as keyof typeof newAddress]}
                                    onChange={(e) => setNewAddress((prev) => ({ ...prev, [key]: e.target.value }))}
                                    className="w-full border border-[#D4C4B0] px-3 py-2.5 font-sans text-xs text-[#1E1A17] focus:outline-none focus:border-[#C89B3C] transition-colors bg-white"
                                  />
                                </div>
                              ))}
                            </div>
                            {addressError && (
                              <p className="text-[#7A1F1F] font-sans text-xs mt-3 tracking-[0.05em]">{addressError}</p>
                            )}
                            <div className="mt-4 flex gap-3">
                              <button
                                onClick={() => saveAddressMutation.mutate()}
                                disabled={saveAddressMutation.isPending}
                                className="bg-[#1E1A17] text-[#F8F4EE] px-5 py-2.5 font-sans text-xs tracking-[0.15em] uppercase hover:bg-[#6B3E26] transition-colors disabled:opacity-60"
                              >
                                {saveAddressMutation.isPending ? 'Saving…' : 'Save Address'}
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="mt-6 flex justify-end">
                          <motion.button
                            onClick={() => setStep('payment')}
                            disabled={!canProceedFromAddress}
                            whileHover={{ scale: canProceedFromAddress ? 1.02 : 1 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-3 bg-[#1E1A17] text-[#F8F4EE] px-8 py-4 font-sans text-xs tracking-[0.2em] uppercase hover:bg-[#6B3E26] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Continue to Payment
                            <ArrowRight size={13} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 'payment' && (
                    <motion.div key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                      <div className="bg-white border border-[#D4C4B0] p-6 md:p-8">
                        <h2 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.6rem' }} className="text-[#1E1A17] mb-6">
                          Payment Method
                        </h2>
                        {paymentConfigError && (
                          <p className="text-[#7A1F1F] font-sans text-xs mb-4">Online payment configuration is unavailable. Cash on Delivery remains available.</p>
                        )}
                        <div className="space-y-3 mb-8">
                          {paymentMethods.map((method) => (
                            <label
                              key={method.id}
                              className={`flex items-start gap-4 p-4 border cursor-pointer transition-all ${paymentMethod === method.id ? 'border-[#C89B3C] bg-[#FBF6EE]' : 'border-[#D4C4B0] hover:border-[#C89B3C]/50'}`}
                            >
                              <input
                                type="radio"
                                name="payment"
                                value={method.id}
                                checked={paymentMethod === method.id}
                                onChange={() => setPaymentMethod(method.id)}
                                className="mt-1 accent-[#C89B3C]"
                              />
                              <span className="text-xl">{method.icon}</span>
                              <div>
                                <p className="font-sans text-sm font-semibold text-[#1E1A17]">{method.label}</p>
                                <p className="font-sans text-xs text-[#5B4B3F] mt-0.5">{method.description}</p>
                              </div>
                            </label>
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <button onClick={() => setStep('address')} className="text-[#5B4B3F] font-sans text-xs tracking-[0.1em] uppercase hover:text-[#1E1A17] transition-colors">
                            ← Back
                          </button>
                          <motion.button
                            onClick={() => setStep('review')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-3 bg-[#1E1A17] text-[#F8F4EE] px-8 py-4 font-sans text-xs tracking-[0.2em] uppercase hover:bg-[#6B3E26] transition-colors"
                          >
                            Review Order
                            <ArrowRight size={13} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 'review' && (
                    <motion.div key="review" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                      <div className="bg-white border border-[#D4C4B0] p-6 md:p-8">
                        <h2 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.6rem' }} className="text-[#1E1A17] mb-6">
                          Review & Place Order
                        </h2>

                        {/* Items */}
                        <div className="space-y-3 mb-6 border-b border-[#EFE3D3] pb-6">
                          {items.map((item: any, i: number) => (
                            <div key={item.variantId ?? i} className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-[#EFE3D3] flex-shrink-0 overflow-hidden">
                                {item.image && (
                                  <Image src={item.image} alt={item.name ?? ''} width={56} height={56} className="w-full h-full object-cover" unoptimized />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-sans text-xs text-[#1E1A17] font-medium truncate">{item.name ?? 'Artisan Craft'}</p>
                                <p className="font-sans text-[10px] text-[#5B4B3F]">Qty: {item.quantity}</p>
                              </div>
                              <p className="font-sans text-sm text-[#1E1A17] font-semibold">₹{(Number(item.price ?? 0) * Number(item.quantity ?? 1)).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>

                        {/* Summary */}
                        <div className="space-y-2 text-[#5B4B3F] font-sans text-sm mb-6">
                          {previewLoading && (
                            <p className="text-xs">Calculating your order total…</p>
                          )}
                          {previewError && (
                            <div className="flex items-center justify-between gap-3 text-[#7A1F1F] text-xs">
                              <span>{previewErrorMessage}</span>
                              <button type="button" onClick={() => previewQuery.refetch()} disabled={previewLoading} className="underline">Retry</button>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{previewLoading ? '—' : `₹${subtotal.toLocaleString()}`}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>{previewLoading ? '—' : shipping === 0 ? <span className="text-green-700">Free</span> : `₹${shipping}`}</span>
                          </div>
                          <div className="flex justify-between pt-3 border-t border-[#EFE3D3] text-[#1E1A17] font-bold text-base">
                            <span>Total</span>
                            <span>{previewLoading ? '—' : `₹${total.toLocaleString()}`}</span>
                          </div>
                        </div>

                        {/* Payment method */}
                        <div className="bg-[#F8F4EE] px-4 py-3 mb-6 border border-[#EFE3D3]">
                          <p className="font-sans text-[10px] tracking-[0.1em] uppercase text-[#5B4B3F] mb-1">Payment</p>
                          <p className="font-sans text-xs text-[#1E1A17]">{paymentMethods.find((m) => m.id === paymentMethod)?.label}</p>
                        </div>

                        {orderError && (
                          <p className="text-[#7A1F1F] font-sans text-xs mb-4 tracking-[0.05em]">{orderError}</p>
                        )}

                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <button onClick={() => setStep('payment')} className="text-[#5B4B3F] font-sans text-xs tracking-[0.1em] uppercase hover:text-[#1E1A17] transition-colors">
                            ← Back
                          </button>
                          <motion.button
                            onClick={() => placeOrderMutation.mutate()}
                            disabled={placeOrderMutation.isPending || previewLoading || previewError || !summary}
                            whileHover={{ scale: placeOrderMutation.isPending || previewLoading || previewError || !summary ? 1 : 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-3 bg-[#C89B3C] text-[#1E1A17] px-8 py-4 font-sans text-xs tracking-[0.2em] uppercase hover:bg-[#B7792B] transition-colors disabled:opacity-60 disabled:cursor-not-allowed font-bold"
                          >
                            {placeOrderMutation.isPending ? 'Placing Order…' : previewLoading ? 'Calculating…' : 'Place Order'}
                            {!placeOrderMutation.isPending && <ArrowRight size={13} />}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right: Order summary sticky */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-[#D4C4B0] p-6 lg:sticky lg:top-28">
                  <h3 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.3rem' }} className="text-[#1E1A17] mb-5">
                    Order Summary
                  </h3>
                  <div className="space-y-3 mb-5 border-b border-[#EFE3D3] pb-5">
                    {items.slice(0, 3).map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#EFE3D3] overflow-hidden flex-shrink-0">
                          {item.image && <Image src={item.image} alt={item.name ?? ''} width={48} height={48} className="w-full h-full object-cover" unoptimized />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-sans text-[11px] text-[#1E1A17] truncate">{item.name}</p>
                          <p className="font-sans text-[10px] text-[#5B4B3F]">×{item.quantity}</p>
                        </div>
                        <p className="font-sans text-xs text-[#1E1A17] font-semibold">₹{(Number(item.price) * Number(item.quantity)).toLocaleString()}</p>
                      </div>
                    ))}
                    {items.length > 3 && (
                      <p className="text-[#5B4B3F] font-sans text-[10px] text-center">+{items.length - 3} more items</p>
                    )}
                  </div>
                  <div className="space-y-2 text-[#5B4B3F] font-sans text-xs">
                    <div className="flex justify-between">
                      <span>Subtotal ({items.length} items)</span>
                      <span>{previewLoading ? '—' : `₹${subtotal.toLocaleString()}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{previewLoading ? '—' : shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                    </div>
                    {!previewLoading && subtotal < 1500 && (
                      <p className="text-[#6B3E26] text-[10px]">Add ₹{(1500 - subtotal).toLocaleString()} more for free shipping!</p>
                    )}
                    <div className="flex justify-between pt-3 border-t border-[#EFE3D3] text-[#1E1A17] font-bold text-sm">
                      <span>Total</span>
                      <span>{previewLoading ? '—' : `₹${total.toLocaleString()}`}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
