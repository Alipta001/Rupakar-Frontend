'use client'

import { use, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, Package, Truck, CheckCircle, AlertCircle, Clock, XCircle, MapPin, FileText, Download } from 'lucide-react'
import { downloadOrderInvoicePdf, fetchOrder, fetchOrderInvoice, cancelOrder } from '@/lib/customer-api'

interface Props {
  params: Promise<{ id: string }>
}

const ORDER_STEPS = [
  { status: 'PENDING', label: 'Order Placed', icon: Clock, color: 'text-yellow-600' },
  { status: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle, color: 'text-blue-600' },
  { status: 'PROCESSING', label: 'Processing', icon: Package, color: 'text-purple-600' },
  { status: 'SHIPPED', label: 'Shipped', icon: Truck, color: 'text-indigo-600' },
  { status: 'DELIVERED', label: 'Delivered', icon: CheckCircle, color: 'text-green-600' },
]

const STATUS_ORDER = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']

const itemImageUrl = (item: any) => {
  const snapshot = item?.productSnapshot ?? {}
  const images = [item?.image, snapshot.image, ...(Array.isArray(item?.images) ? item.images : []), ...(Array.isArray(snapshot.images) ? snapshot.images : [])]
  const image = images.find((candidate) => typeof candidate === 'string' ? candidate : typeof candidate?.url === 'string')
  return typeof image === 'string' ? image : image?.url ?? null
}

const itemName = (item: any) => item?.productName ?? item?.name ?? item?.productSnapshot?.name ?? 'Artisan Product'
const itemVariant = (item: any) => Object.values(item?.productSnapshot?.attributes ?? {}).filter(Boolean).join(' · ')
const displayStatus = (status?: string) => String(status ?? 'PENDING').replaceAll('_', ' ')

export default function OrderDetailPage({ params }: Props) {
  const { id } = use(params)
  const queryClient = useQueryClient()

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrder(id),
    retry: false,
  })
  const { data: invoice } = useQuery({
    queryKey: ['order-invoice', id],
    queryFn: () => fetchOrderInvoice(id),
    enabled: Boolean(order?.paymentStatus === 'PAID' || order?.status === 'CONFIRMED'),
    retry: false,
  })
  const [isDownloadingInvoice, setIsDownloadingInvoice] = useState(false)

  const handleInvoiceDownload = async () => {
    setIsDownloadingInvoice(true)
    try {
      const download = await downloadOrderInvoicePdf(id)
      const url = download.downloadUrl
      if (url) {
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.target = '_blank'
        anchor.rel = 'noreferrer'
        anchor.download = `${download.invoiceNumber || invoice.invoiceNumber || 'rupakar-invoice'}.pdf`
        anchor.click()
      } else throw new Error('The invoice PDF is not ready yet.')
    } finally {
      setIsDownloadingInvoice(false)
    }
  }

  const cancelMutation = useMutation({
    mutationFn: () => cancelOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-[#D4C4B0]/30 rounded w-1/3" />
        <div className="h-32 bg-[#D4C4B0]/30 rounded" />
        <div className="h-48 bg-[#D4C4B0]/30 rounded" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <AlertCircle size={40} className="mx-auto mb-4 text-[#7A1F1F]/50" strokeWidth={1.5} />
        <p className="text-[#5B4B3F] font-sans text-sm mb-4">Order not found.</p>
        <Link href="/account/orders" className="text-[#C89B3C] font-sans text-xs underline">
          ← Back to Orders
        </Link>
      </div>
    )
  }

  const statusUpperCase = (order.status ?? 'PENDING').toUpperCase()
  const isCancelled = statusUpperCase === 'CANCELLED'
  const canCancel = ['PENDING', 'CONFIRMED'].includes(statusUpperCase)
  const currentStepIndex = isCancelled ? -1 : STATUS_ORDER.indexOf(statusUpperCase)
  const items = Array.isArray(order.items) ? order.items : []
  const vendorOrders = Array.isArray(order.vendorOrders) ? order.vendorOrders.filter((vendorOrder: any) => vendorOrder && typeof vendorOrder === 'object') : []
  const itemGroups = vendorOrders.length ? vendorOrders.map((vendorOrder: any) => ({
    id: String(vendorOrder._id ?? vendorOrder.vendorId?._id ?? vendorOrder.vendorId),
    name: vendorOrder.vendorId?.businessName ?? vendorOrder.vendorId?.legalName ?? 'Seller fulfillment',
    status: vendorOrder.status,
    items: Array.isArray(vendorOrder.items) ? vendorOrder.items : [],
  })) : [{ id: 'order-items', name: 'Order items', status: order.status, items }]
  const shippingAddr = order.shippingAddressSnapshot ?? order.shippingAddress ?? order.address ?? null
  const total = Number(order.total ?? order.grandTotal ?? order.amount ?? 0)
  const orderNumber = order.orderNumber ?? order.number ?? id

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-[#5B4B3F] hover:text-[#C89B3C] font-sans text-xs tracking-[0.1em] uppercase transition-colors mb-4"
        >
          <ArrowLeft size={12} />
          All Orders
        </Link>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl tracking-[-0.02em] mb-1" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Order #{orderNumber}
            </h1>
            <p className="text-[#5B4B3F] font-sans text-[11px] tracking-[0.05em]">
              {order.createdAt
                ? `Placed on ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
                : 'Placement date unavailable'}
            </p>
          </div>

          {!isCancelled && canCancel && (
            <motion.button
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 border border-[#7A1F1F] text-[#7A1F1F] px-5 py-2.5 font-sans text-xs tracking-[0.1em] uppercase hover:bg-[#7A1F1F] hover:text-white transition-all disabled:opacity-60"
            >
              <XCircle size={13} />
              {cancelMutation.isPending ? 'Cancelling…' : 'Cancel Order'}
            </motion.button>
          )}

          {(order.paymentStatus === 'PAID' || order.status === 'CONFIRMED') && (
            <button
              onClick={handleInvoiceDownload}
              disabled={isDownloadingInvoice}
              className="flex items-center gap-2 border border-[#C89B3C] bg-[#C89B3C] text-[#1E1A17] px-4 py-2.5 font-sans text-[10px] tracking-[0.1em] uppercase hover:bg-[#B7792B] hover:border-[#B7792B] transition-colors disabled:opacity-60"
            >
              {isDownloadingInvoice ? <FileText size={13} className="animate-pulse" /> : <Download size={13} />}
              {isDownloadingInvoice ? 'Preparing…' : invoice?.generationStatus === 'FAILED' ? 'Retry Invoice' : invoice?.generationStatus !== 'AVAILABLE' ? 'Preparing Invoice…' : 'Download Invoice'}
            </button>
          )}

          {isCancelled && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-700 font-sans text-xs tracking-[0.1em] uppercase">
              <XCircle size={13} />
              Cancelled
            </div>
          )}
        </div>
      </motion.div>

      {/* Status timeline */}
      {!isCancelled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-[#C89B3C]/20 rounded-lg p-6 backdrop-blur-sm"
        >
          <h2 className="text-sm font-sans tracking-[0.1em] uppercase text-[#5B4B3F] mb-6">Order Status</h2>
          <div className="relative">
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-[#EFE3D3]" />
            <div
              className="absolute top-5 left-5 h-0.5 bg-[#C89B3C] transition-all duration-700"
              style={{ width: `${Math.max(0, currentStepIndex / (ORDER_STEPS.length - 1)) * 100}%` }}
            />
            <div className="relative flex justify-between">
              {ORDER_STEPS.map((stepInfo, i) => {
                const isDone = i <= currentStepIndex
                const isActive = i === currentStepIndex
                const Icon = stepInfo.icon
                return (
                  <div key={stepInfo.status} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        isDone ? 'bg-[#C89B3C] border-[#C89B3C]' : 'bg-white border-[#D4C4B0]'
                      } ${isActive ? 'ring-2 ring-[#C89B3C]/30 ring-offset-2' : ''}`}
                    >
                      <Icon size={16} className={isDone ? 'text-white' : 'text-[#D4C4B0]'} strokeWidth={1.5} />
                    </div>
                    <div className="text-center">
                      <p className={`font-sans text-[9px] tracking-[0.1em] uppercase ${isDone ? 'text-[#1E1A17]' : 'text-[#D4C4B0]'}`}>
                        {stepInfo.label}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-[#C89B3C]/20 rounded-lg p-6 md:col-span-2"
        >
          <h2 className="text-sm font-sans tracking-[0.1em] uppercase text-[#5B4B3F] mb-5">
            Items ({items.length})
          </h2>
          <div className="space-y-6">
            {itemGroups.map((group: any) => (
              <section key={group.id} className="border border-[#EFE3D3] rounded-md overflow-hidden">
                <header className="flex items-center justify-between gap-3 bg-[#FCF9F4] px-4 py-3">
                  <p className="font-sans text-xs font-semibold text-[#1E1A17]">{group.name}</p>
                  <span className="font-sans text-[10px] tracking-[0.08em] uppercase text-[#6B3E26]">{displayStatus(group.status)}</span>
                </header>
                <div className="px-4">
                  {group.items.map((item: any, i: number) => {
                    const imageUrl = itemImageUrl(item)
                    const unitPrice = Number(item.unitPrice ?? item.price ?? item.productSnapshot?.price ?? 0)
                    return <div key={`${item.variantId ?? item.sku ?? i}`} className="flex items-center gap-4 py-3 border-b border-[#EFE3D3] last:border-0">
                      <div className="w-16 h-16 bg-[#EFE3D3] flex-shrink-0 overflow-hidden rounded">
                        {imageUrl ? <Image src={imageUrl} alt={itemName(item)} width={64} height={64} className="w-full h-full object-cover" unoptimized /> : <Package aria-label="Product image unavailable" size={22} className="m-[21px] text-[#A88D70]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-sm text-[#1E1A17] font-medium">{itemName(item)}</p>
                        {itemVariant(item) && <p className="font-sans text-[10px] text-[#C89B3C] tracking-[0.06em] uppercase">{itemVariant(item)}</p>}
                        <p className="font-sans text-xs text-[#5B4B3F] mt-0.5">SKU: {item.sku ?? item.productSnapshot?.sku ?? '—'} · Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-sans text-sm text-[#1E1A17] font-semibold">₹{Number(item.lineTotal ?? unitPrice * Number(item.quantity ?? 1)).toLocaleString()}</p>
                        <p className="font-sans text-[10px] text-[#5B4B3F]">₹{unitPrice.toLocaleString()} each</p>
                      </div>
                    </div>
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* Total */}
          <div className="mt-5 pt-4 border-t border-[#EFE3D3] space-y-1.5 font-sans text-xs text-[#5B4B3F]">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{Number(order.subtotal ?? 0).toLocaleString()}</span></div>
            {Number(order.discount ?? 0) > 0 && <div className="flex justify-between"><span>Discount</span><span>− ₹{Number(order.discount).toLocaleString()}</span></div>}
            <div className="flex justify-between"><span>Tax</span><span>₹{Number(order.tax ?? 0).toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>₹{Number(order.shipping ?? 0).toLocaleString()}</span></div>
            <div className="pt-2 mt-2 border-t border-[#EFE3D3] flex justify-between text-sm text-[#1E1A17] font-bold"><span>Order Total</span><span className="text-lg text-[#C89B3C]">₹{total.toLocaleString()}</span></div>
          </div>
        </motion.div>

        {/* Shipping address */}
        {shippingAddr && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-[#C89B3C]/20 rounded-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={14} className="text-[#C89B3C]" strokeWidth={1.5} />
              <h2 className="text-sm font-sans tracking-[0.1em] uppercase text-[#5B4B3F]">Shipping Address</h2>
            </div>
            <div className="text-[#5B4B3F] font-sans text-xs space-y-1">
              <p className="font-semibold text-[#1E1A17] text-sm">{shippingAddr.name ?? 'Recipient'}</p>
              <p>{shippingAddr.line1}</p>
              {shippingAddr.line2 && <p>{shippingAddr.line2}</p>}
              <p>{shippingAddr.city}, {shippingAddr.state} — {shippingAddr.pincode}</p>
              {shippingAddr.phone && <p className="mt-1">{shippingAddr.phone}</p>}
            </div>
          </motion.div>
        )}

        {/* Payment info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white border border-[#C89B3C]/20 rounded-lg p-6"
        >
          <h2 className="text-sm font-sans tracking-[0.1em] uppercase text-[#5B4B3F] mb-4">Payment</h2>
          <div className="text-[#5B4B3F] font-sans text-xs space-y-1.5">
            <div className="flex justify-between">
              <span>Method</span>
              <span className="text-[#1E1A17] capitalize">{order.paymentMethod ?? order.payment?.method ?? 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              <span className={`font-semibold ${order.paymentStatus === 'PAID' ? 'text-green-700' : 'text-yellow-700'}`}>
                {order.paymentStatus ?? 'Pending'}
              </span>
            </div>
            {total > 0 && (
              <div className="flex justify-between border-t border-[#EFE3D3] pt-2 mt-2 text-[#1E1A17] font-bold text-sm">
                <span>Total Paid</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
