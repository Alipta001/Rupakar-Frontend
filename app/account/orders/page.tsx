'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Truck, Package, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { fetchOrdersPage } from '@/lib/customer-api'
import { OrdersListSkeleton, ErrorState, EmptyState } from '@/components/skeletons'

const statusConfig = {
  pending: { icon: AlertCircle, color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
  pending_payment: { icon: AlertCircle, color: 'bg-yellow-100 text-yellow-800', label: 'Pending Payment' },
  paid: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Paid' },
  confirmed: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Confirmed' },
  processing: { icon: Package, color: 'bg-blue-100 text-blue-800', label: 'Processing' },
  packed: { icon: Package, color: 'bg-indigo-100 text-indigo-800', label: 'Packed' },
  ready_to_ship: { icon: Truck, color: 'bg-indigo-100 text-indigo-800', label: 'Ready to Ship' },
  shipped: { icon: Truck, color: 'bg-purple-100 text-purple-800', label: 'Shipped' },
  in_transit: { icon: Truck, color: 'bg-violet-100 text-violet-800', label: 'In Transit' },
  out_for_delivery: { icon: Truck, color: 'bg-orange-100 text-orange-800', label: 'Out for Delivery' },
  delivered: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Delivered' },
  failed: { icon: AlertCircle, color: 'bg-red-100 text-red-800', label: 'Failed' },
  cancelled: { icon: AlertCircle, color: 'bg-red-100 text-red-800', label: 'Cancelled' },
} as const

export default function OrdersPage() {
  const router = useRouter(); const searchParams = useSearchParams()
  const page = Math.max(Number(searchParams.get('page')) || 1, 1); const status = searchParams.get('status') || 'ALL'
  const setPage = (next: number, nextStatus = status) => { const params = new URLSearchParams(); if (next > 1) params.set('page', String(next)); if (nextStatus !== 'ALL') params.set('status', nextStatus); router.replace(`/account/orders${params.size ? `?${params}` : ''}`) }
  const authHydrated = useSelector((state: any) => state.auth.hydrated)
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['orders', page, status],
    queryFn: () => fetchOrdersPage(page, 12, status),
    enabled: authHydrated,
    retry: false,
    placeholderData: (prev: any) => prev,
    refetchInterval: (query) => {
      const items = Array.isArray(query.state.data?.items) ? query.state.data.items : []
      const hasActiveOrder = items.some((order: any) => {
        const currentStatus = String(order?.status ?? '').toUpperCase();
        return !['DELIVERED', 'CANCELLED', 'FAILED'].includes(currentStatus)
      })
      return hasActiveOrder ? 10000 : false
    },
    refetchIntervalInBackground: true,
  })

  const orders = Array.isArray(data?.items) ? data.items : []

  const normalizedOrders = orders.map((order: any) => ({
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
        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-2 px-2 sm:mx-0 sm:px-0">
          {['ALL','PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED'].map((value) => (
            <button
              key={value}
              onClick={() => setPage(1, value)}
              className={`whitespace-nowrap flex-shrink-0 px-3.5 py-2 text-xs font-sans tracking-wider uppercase border border-[#D4C4B0] transition-colors ${
                status === value ? 'bg-[#1E1A17] text-white border-[#1E1A17]' : 'bg-white/60 text-[#5B4B3F] hover:border-[#C89B3C]'
              }`}
            >
              {value === 'ALL' ? 'All' : value[0] + value.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="space-y-4">
        {(isLoading || isFetching) && normalizedOrders.length === 0 ? (
          <OrdersListSkeleton count={4} />
        ) : isError && normalizedOrders.length === 0 ? (
          <ErrorState
            error={error}
            onRetry={() => refetch()}
            className="py-12"
          />
        ) : normalizedOrders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="When you place orders, they will appear here with live tracking updates."
            actionLabel="Start Shopping"
            actionHref="/products"
            className="py-12"
          />
        ) : (
          normalizedOrders.map((order: any, index: number) => {
            const statusInfo = statusConfig[order.status as keyof typeof statusConfig] ?? statusConfig.pending
            const Icon = statusInfo.icon

            return (
              <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }} className="rounded-lg border border-[#C89B3C]/20 bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden hover:shadow-md transition-all">
                <div className="p-4 sm:p-6">
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
      {!isLoading && !isError && data?.totalPages > 1 && <div className="flex items-center justify-between border-t border-[#E6D8C6] pt-4 text-sm">
        <button onClick={() => setPage(page - 1)} disabled={!data.hasPrevious} className="px-4 py-2 border disabled:opacity-40">Previous</button>
        <span>Page {data.page} of {data.totalPages}</span>
        <button onClick={() => setPage(page + 1)} disabled={!data.hasNext} className="px-4 py-2 border disabled:opacity-40">Next</button>
      </div>}
    </div>
  )
}
