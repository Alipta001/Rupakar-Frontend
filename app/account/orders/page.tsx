'use client'

import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Truck,
  Package,
  CheckCircle,
  AlertCircle,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RotateCcw,
} from 'lucide-react'
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

const STATUS_TABS = [
  { value: 'ALL', label: 'All Orders' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
] as const

const TIMEFRAME_OPTIONS = [
  { value: 'ALL', label: 'All Time' },
  { value: '30days', label: 'Last 30 Days' },
  { value: '3months', label: 'Last 3 Months' },
  { value: '6months', label: 'Last 6 Months' },
  { value: 'year', label: 'Past Year' },
  { value: '2026', label: '2026' },
  { value: '2025', label: '2025' },
] as const

const PAGE_SIZE = 10

export default function OrdersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = Math.max(Number(searchParams.get('page')) || 1, 1)
  const status = (searchParams.get('status') || 'ALL').toUpperCase()
  const search = searchParams.get('search') || searchParams.get('q') || ''
  const timeframe = searchParams.get('timeframe') || 'ALL'

  // Local state for search input to allow smooth typing without lagging
  const [searchInput, setSearchInput] = useState(search)

  useEffect(() => {
    setSearchInput(search)
  }, [search])

  const updateQueryParams = (updates: {
    page?: number
    status?: string
    search?: string
    timeframe?: string
  }) => {
    const params = new URLSearchParams()
    const targetPage = updates.page !== undefined ? updates.page : page
    const targetStatus = (updates.status !== undefined ? updates.status : status).toUpperCase()
    const targetSearch = updates.search !== undefined ? updates.search : search
    const targetTimeframe = updates.timeframe !== undefined ? updates.timeframe : timeframe

    if (targetPage > 1) params.set('page', String(targetPage))
    if (targetStatus && targetStatus !== 'ALL') params.set('status', targetStatus)
    if (targetSearch && targetSearch.trim()) params.set('search', targetSearch.trim())
    if (targetTimeframe && targetTimeframe !== 'ALL') params.set('timeframe', targetTimeframe)

    const queryString = params.toString()
    router.replace(`/account/orders${queryString ? `?${queryString}` : ''}`, { scroll: false })
  }

  const handleStatusChange = (newStatus: string) => {
    // Reset to page 1 on status change
    updateQueryParams({ status: newStatus, page: 1 })
  }

  const handleTimeframeChange = (newTimeframe: string) => {
    // Reset to page 1 on timeframe change
    updateQueryParams({ timeframe: newTimeframe, page: 1 })
  }

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    // Reset to page 1 on search change
    updateQueryParams({ search: searchInput, page: 1 })
  }

  const handleClearSearch = () => {
    setSearchInput('')
    updateQueryParams({ search: '', page: 1 })
  }

  const handleClearAllFilters = () => {
    setSearchInput('')
    updateQueryParams({ status: 'ALL', search: '', timeframe: 'ALL', page: 1 })
  }

  const handlePageChange = (newPage: number) => {
    updateQueryParams({ page: newPage })
    // Smoothly scroll back to top of orders list
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 120, behavior: 'smooth' })
    }
  }

  const authHydrated = useSelector((state: any) => state.auth.hydrated)

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['orders', page, status, search, timeframe],
    queryFn: () =>
      fetchOrdersPage(page, PAGE_SIZE, status, {
        search,
        timeframe,
      }),
    enabled: authHydrated,
    retry: false,
    placeholderData: (prev: any) => prev,
    refetchInterval: (query) => {
      const items = Array.isArray(query.state.data?.items) ? query.state.data.items : []
      const hasActiveOrder = items.some((order: any) => {
        const currentStatus = String(order?.status ?? '').toUpperCase()
        return !['DELIVERED', 'CANCELLED', 'FAILED'].includes(currentStatus)
      })
      return hasActiveOrder ? 10000 : false
    },
    refetchIntervalInBackground: true,
  })

  const orders = Array.isArray(data?.items) ? data.items : []
  const total = Number(data?.total) || 0
  const totalPages = Math.max(Number(data?.totalPages) || (total ? Math.ceil(total / PAGE_SIZE) : 1), 1)
  const hasNext = Boolean(data?.hasNext || page < totalPages)
  const hasPrevious = Boolean(data?.hasPrevious || page > 1)

  const hasActiveFilters = status !== 'ALL' || Boolean(search.trim()) || timeframe !== 'ALL'

  const normalizedOrders = orders.map((order: any) => ({
    id: order?._id ?? order?.id ?? order?.orderId ?? 'unknown',
    orderNumber: order?.orderNumber ?? order?.number ?? order?.id ?? '—',
    date: order?.createdAt ?? order?.date ?? new Date().toISOString(),
    total: Number(order?.total ?? order?.grandTotal ?? order?.amount ?? 0),
    status: String(order?.status ?? 'pending').toLowerCase(),
    items: Array.isArray(order?.items) ? order.items.length : Number(order?.itemCount ?? 0),
  }))

  // Generate pagination page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (page > 3) pages.push('ellipsis-start')

      const start = Math.max(2, page - 1)
      const end = Math.min(totalPages - 1, page + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (page < totalPages - 2) pages.push('ellipsis-end')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl tracking-[-0.02em] mb-1.5" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Order History
            </h1>
            <p className="text-[#5B4B3F] font-sans text-xs sm:text-sm tracking-[0.05em]">
              Track, manage, and view status for all your handcrafted orders
            </p>
          </div>
          {total > 0 && !isLoading && (
            <div className="text-xs font-sans tracking-[0.1em] text-[#5B4B3F] bg-white/70 border border-[#D4C4B0]/60 px-3 py-1.5 rounded-md self-start sm:self-auto">
              Total Orders: <span className="font-semibold text-[#1E1A17]">{total}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Filter and Search Bar */}
      <div className="space-y-3.5 bg-white/70 border border-[#C89B3C]/20 rounded-lg p-3.5 sm:p-5 backdrop-blur-sm shadow-sm">
        {/* Search input & Timeframe dropdown */}
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5B4B3F]/70" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by Order # or item name..."
              className="w-full pl-9 pr-16 py-2.5 bg-white border border-[#D4C4B0] text-xs font-sans tracking-wide text-[#1E1A17] placeholder:text-[#5B4B3F]/50 rounded-md focus:outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C] transition-all"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search"
                className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-[#5B4B3F]/60 hover:text-[#1E1A17]"
              >
                <X size={13} />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#1E1A17] hover:bg-[#C89B3C] text-white text-[10px] font-sans uppercase tracking-[0.1em] rounded transition-colors"
            >
              Search
            </button>
          </form>

          {/* Timeframe Select */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[11px] font-sans tracking-[0.1em] uppercase text-[#5B4B3F] whitespace-nowrap hidden sm:inline">
              Period:
            </span>
            <select
              value={timeframe}
              onChange={(e) => handleTimeframeChange(e.target.value)}
              aria-label="Filter by order period"
              className="w-full sm:w-auto px-3 py-2.5 bg-white border border-[#D4C4B0] text-xs font-sans text-[#1E1A17] rounded-md focus:outline-none focus:border-[#C89B3C] tracking-wide"
            >
              {TIMEFRAME_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#E6D8C6]/50">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-2 px-2 sm:mx-0 sm:px-0 flex-1">
            {STATUS_TABS.map((tab) => {
              const isActive = status === tab.value
              return (
                <button
                  key={tab.value}
                  onClick={() => handleStatusChange(tab.value)}
                  className={`whitespace-nowrap flex-shrink-0 px-3.5 py-1.5 text-[11px] font-sans tracking-wider uppercase rounded border transition-all ${
                    isActive
                      ? 'bg-[#1E1A17] text-white border-[#1E1A17] shadow-sm font-medium'
                      : 'bg-white/60 text-[#5B4B3F] border-[#D4C4B0] hover:border-[#C89B3C] hover:text-[#1E1A17]'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Clear Filters Button (shown only when active) */}
          {hasActiveFilters && (
            <button
              onClick={handleClearAllFilters}
              className="flex-shrink-0 inline-flex items-center gap-1.5 text-[10px] font-sans tracking-[0.1em] uppercase text-[#C89B3C] hover:text-[#6B3E26] ml-2 transition-colors whitespace-nowrap"
            >
              <RotateCcw size={11} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Orders List Content */}
      <div className="space-y-4">
        {isLoading && normalizedOrders.length === 0 ? (
          <OrdersListSkeleton count={4} />
        ) : isError && normalizedOrders.length === 0 ? (
          <ErrorState error={error} onRetry={() => refetch()} isRetrying={isFetching} className="py-12" />
        ) : normalizedOrders.length === 0 ? (
          hasActiveFilters ? (
            <div className="rounded-lg border border-[#D4C4B0] bg-white/70 p-8 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#D4C4B0]/20 flex items-center justify-center text-[#5B4B3F]">
                <Search size={22} />
              </div>
              <div>
                <h3 className="text-xl" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  No orders match your filter criteria
                </h3>
                <p className="text-xs font-sans text-[#5B4B3F] mt-1 max-w-md mx-auto">
                  {search
                    ? `No orders found matching "${search}". Try searching with a different order number or item name.`
                    : 'No orders found with the selected status or time period.'}
                </p>
              </div>
              <button
                onClick={handleClearAllFilters}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E1A17] text-white text-xs font-sans uppercase tracking-[0.1em] rounded hover:bg-[#C89B3C] transition-colors"
              >
                <RotateCcw size={12} />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <EmptyState
              title="No orders yet"
              description="When you place orders, they will appear here with live tracking updates and invoice downloads."
              actionLabel="Start Shopping"
              actionHref="/products"
              className="py-12"
            />
          )
        ) : (
          <>
            {/* Orders list cards */}
            <div className={`space-y-3.5 transition-opacity duration-200 ${isFetching ? 'opacity-70' : 'opacity-100'}`}>
              <AnimatePresence mode="popLayout">
                {normalizedOrders.map((order: any, index: number) => {
                  const statusInfo = statusConfig[order.status as keyof typeof statusConfig] ?? statusConfig.pending
                  const Icon = statusInfo.icon

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.35, delay: index * 0.03 }}
                      className="rounded-lg border border-[#C89B3C]/20 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden hover:shadow-md hover:border-[#C89B3C]/40 transition-all"
                    >
                      <div className="p-4 sm:p-5">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                              <h3
                                className="text-lg font-semibold tracking-[-0.01em] text-[#1E1A17]"
                                style={{ fontFamily: 'var(--font-cormorant)' }}
                              >
                                Order #{order.orderNumber}
                              </h3>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-[#5B4B3F]">
                              <span className="font-sans text-[11px] tracking-[0.05em] uppercase text-[#5B4B3F]/90">
                                {new Date(order.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                              <span className="text-[#D4C4B0]">•</span>
                              <span className="font-sans text-[11px] tracking-[0.05em] uppercase text-[#5B4B3F]/90">
                                {order.items} {order.items === 1 ? 'Item' : 'Items'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md self-start md:self-auto border border-black/5" style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}>
                            <div className={`p-1 rounded ${statusInfo.color}`}>
                              <Icon size={14} strokeWidth={2} />
                            </div>
                            <span className="font-sans text-[11px] tracking-[0.05em] uppercase font-semibold text-[#1E1A17]">
                              {statusInfo.label}
                            </span>
                          </div>

                          <div className="text-left md:text-right">
                            <p className="font-sans text-[10px] tracking-[0.1em] uppercase text-[#5B4B3F] mb-0.5">
                              Total Amount
                            </p>
                            <p className="text-xl sm:text-2xl font-bold text-[#C89B3C]">
                              ₹{order.total.toLocaleString()}
                            </p>
                          </div>

                          <div className="flex items-center">
                            <Link
                              href={`/account/orders/${order.id}`}
                              className="w-full sm:w-auto text-center px-4 py-2 bg-[#1E1A17] hover:bg-[#C89B3C] text-white font-sans text-xs tracking-[0.1em] uppercase rounded transition-colors whitespace-nowrap shadow-sm"
                            >
                              View Details →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* Pagination Controls */}
            {total > 0 && (
              <div className="border-t border-[#E6D8C6] pt-5 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Status Indicator */}
                <p className="text-xs font-sans tracking-wide text-[#5B4B3F] text-center sm:text-left">
                  Showing{' '}
                  <span className="font-semibold text-[#1E1A17]">
                    {(page - 1) * PAGE_SIZE + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-semibold text-[#1E1A17]">
                    {Math.min(page * PAGE_SIZE, total)}
                  </span>{' '}
                  of <span className="font-semibold text-[#1E1A17]">{total}</span> orders
                  {isFetching && <span className="ml-2 text-[#C89B3C] animate-pulse">Updating…</span>}
                </p>

                {/* Navigation Buttons */}
                {totalPages > 1 && (
                  <nav aria-label="Orders pagination" className="flex items-center gap-1.5 flex-wrap justify-center">
                    {/* First Page */}
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={!hasPrevious || page === 1}
                      aria-label="First page"
                      title="First page"
                      className="p-2 border border-[#D4C4B0] bg-white rounded text-[#5B4B3F] hover:border-[#C89B3C] hover:text-[#1E1A17] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <ChevronsLeft size={14} />
                    </button>

                    {/* Previous Page */}
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={!hasPrevious}
                      aria-label="Previous page"
                      className="px-3 py-1.5 border border-[#D4C4B0] bg-white rounded text-xs font-sans tracking-wider text-[#5B4B3F] hover:border-[#C89B3C] hover:text-[#1E1A17] disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 transition-colors"
                    >
                      <ChevronLeft size={14} />
                      <span className="hidden sm:inline">Prev</span>
                    </button>

                    {/* Numeric Page Buttons */}
                    <div className="flex items-center gap-1">
                      {getPageNumbers().map((p, idx) => {
                        if (typeof p === 'string') {
                          return (
                            <span key={`ellipsis-${idx}`} className="px-2 text-xs text-[#5B4B3F]">
                              …
                            </span>
                          )
                        }
                        const isCurrent = p === page
                        return (
                          <button
                            key={p}
                            onClick={() => handlePageChange(p)}
                            aria-current={isCurrent ? 'page' : undefined}
                            className={`min-w-[32px] h-8 px-2 text-xs font-sans tracking-wide rounded border transition-colors ${
                              isCurrent
                                ? 'bg-[#1E1A17] text-white border-[#1E1A17] font-semibold'
                                : 'bg-white border-[#D4C4B0] text-[#5B4B3F] hover:border-[#C89B3C] hover:text-[#1E1A17]'
                            }`}
                          >
                            {p}
                          </button>
                        )
                      })}
                    </div>

                    {/* Next Page */}
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={!hasNext}
                      aria-label="Next page"
                      className="px-3 py-1.5 border border-[#D4C4B0] bg-white rounded text-xs font-sans tracking-wider text-[#5B4B3F] hover:border-[#C89B3C] hover:text-[#1E1A17] disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 transition-colors"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight size={14} />
                    </button>

                    {/* Last Page */}
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={!hasNext || page === totalPages}
                      aria-label="Last page"
                      title="Last page"
                      className="p-2 border border-[#D4C4B0] bg-white rounded text-[#5B4B3F] hover:border-[#C89B3C] hover:text-[#1E1A17] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <ChevronsRight size={14} />
                    </button>
                  </nav>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
