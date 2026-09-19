'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Truck, Package, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { fetchOrders } from '@/lib/customer-api'

const statusConfig = {
  pending: { icon: AlertCircle, color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
  pending_payment: { icon: AlertCircle, color: 'bg-yellow-100 text-yellow-800', label: 'Pending Payment' },
  confirmed: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Confirmed' },
  failed: { icon: AlertCircle, color: 'bg-red-100 text-red-800', label: 'Failed' },
  cancelled: { icon: AlertCircle, color: 'bg-red-100 text-red-800', label: 'Cancelled' },
  processing: { icon: Package, color: 'bg-blue-100 text-blue-800', label: 'Processing' },
  shipped: { icon: Truck, color: 'bg-purple-100 text-purple-800', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Delivered' },
} as const

export default function OrdersPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    retry: false,
  })

  const orders = Array.isArray(data) ? data : []

  const normalizedOrders = orders.map((order) => ({
    id: order?._id ?? order?.id ?? order?.orderId ?? 'unknown',
    orderNumber: order?.orderNumber ?? order?.number ?? order?.id ?? '—',
    date: order?.createdAt ?? order?.date ?? new Date().toISOString(),
    total: Number(order?.total ?? order?.grandTotal ?? order?.amount ?? 0),
    status: (order?.status ?? 'pending').toLowerCase(),
    items: Array.isArray(order?.items) ? order.items.length : Number(order?.itemCount ?? 0),
  }))

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl md:text-4xl tracking-[-0.02em] mb-2" style={{ fontFamily: 'var(--font-cormorant)' }}>Order History</h1>
        <p className="text-[#5B4B3F] font-sans text-sm tracking-[0.05em]">Track and manage all your orders</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="space-y-4">
        {isLoading ? (
          <div className="rounded-lg border border-[#C89B3C]/20 bg-white/70 p-6 text-sm text-[#5B4B3F]">Loading your orders…</div>
        ) : isError ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 rounded-lg border border-dashed border-[#D4C4B0] bg-white/30">
            <p className="text-[#7A1F1F] font-sans text-sm tracking-[0.05em]">Your session has expired. Please sign in again.</p>
          </motion.div>
        ) : normalizedOrders.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-center py-12 rounded-lg border border-dashed border-[#D4C4B0] bg-white/30">
            <Package size={48} className="mx-auto mb-4 text-[#C89B3C]/40" strokeWidth={1.5} />
            <p className="text-[#5B4B3F] font-sans text-sm tracking-[0.05em]">No orders to display yet.</p>
          </motion.div>
        ) : (
          normalizedOrders.map((order, index) => {
            const statusInfo = statusConfig[order.status as keyof typeof statusConfig] ?? statusConfig.pending
            const Icon = statusInfo.icon

            return (
              <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }} className="rounded-lg border border-[#C89B3C]/20 bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden hover:shadow-md transition-all">
                <div className="px-6 py-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold tracking-[-0.01em]" style={{ fontFamily: 'var(--font-cormorant)' }}>Order #{order.orderNumber}</h3>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-[#5B4B3F]">
                        <span className="font-sans text-[11px] tracking-[0.05em] uppercase">{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        <span className="font-sans text-[11px] tracking-[0.05em] uppercase">{order.items} {order.items === 1 ? 'Item' : 'Items'}</span>
                      </div>
                    </div>

                    <motion.div className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${statusInfo.color}`}>
                      <Icon size={16} strokeWidth={1.5} />
                      <span className="font-sans text-xs tracking-[0.05em] uppercase font-medium">{statusInfo.label}</span>
                    </motion.div>

                    <div className="text-right md:text-left">
                      <p className="font-sans text-[11px] tracking-[0.1em] uppercase text-[#5B4B3F] mb-1">Total</p>
                      <p className="text-2xl font-bold text-[#C89B3C]">₹{order.total.toLocaleString()}</p>
                    </div>

                    <Link href={`/account/orders/${order.id}`} className="text-[#C89B3C] hover:text-[#B7792B] font-sans text-xs tracking-[0.1em] uppercase transition-colors whitespace-nowrap">View Details →</Link>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </motion.div>
    </div>
  )
}
