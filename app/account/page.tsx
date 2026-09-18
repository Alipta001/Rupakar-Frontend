'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Package, Heart, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { fetchAddresses, fetchCurrentUser, fetchOrders, fetchWishlist } from '@/lib/customer-api'

interface StatCard {
  icon: React.ComponentType<any>
  label: string
  value: string | number
  href: string
}

export default function AccountDashboard() {
  const { data: reduxUser } = useSelector((state: any) => state.auth)

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: fetchCurrentUser,
    retry: false,
  })

  const user = profileQuery.data || reduxUser

  const addressesQuery = useQuery({
    queryKey: ['addresses'],
    queryFn: fetchAddresses,
    retry: false,
  })

  const wishlistQuery = useQuery({
    queryKey: ['wishlist'],
    queryFn: fetchWishlist,
    retry: false,
  })

  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    retry: false,
  })

  const orderCount = Array.isArray(ordersQuery.data) ? ordersQuery.data.length : 0
  const addressCount = Array.isArray(addressesQuery.data) ? addressesQuery.data.length : 0
  const wishlistCount = Array.isArray(wishlistQuery.data?.items) ? wishlistQuery.data.items.length : 0
  const loading = profileQuery.isLoading || addressesQuery.isLoading || wishlistQuery.isLoading || ordersQuery.isLoading

  const stats: StatCard[] = useMemo(
    () => [
      { icon: Package, label: 'Total Orders', value: loading ? '—' : orderCount, href: '/account/orders' },
      { icon: Heart, label: 'Wishlist Items', value: loading ? '—' : wishlistCount, href: '/account/wishlist' },
      { icon: MapPin, label: 'Saved Addresses', value: loading ? '—' : addressCount, href: '/account/addresses' },
      { icon: TrendingUp, label: 'Loyalty Points', value: '2,450', href: '/account/settings' },
    ],
    [addressCount, loading, orderCount, wishlistCount],
  )

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl md:text-4xl tracking-[-0.02em] mb-2" style={{ fontFamily: 'var(--font-cormorant)' }}>
          Welcome, {user?.name?.split(' ')[0] || 'Customer'}
        </h1>
        <p className="text-[#5B4B3F] font-sans text-sm tracking-[0.05em]">
          Manage your profile, orders, and preferences in one place.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}>
              <Link href={stat.href}>
                <motion.div whileHover={{ y: -4 }} className="rounded-lg border border-[#C89B3C]/20 bg-white/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-md hover:border-[#C89B3C]/40 transition-all duration-300 cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-[#C89B3C]/30 to-[#6B3E26]/20 flex items-center justify-center group-hover:from-[#C89B3C]/40 group-hover:to-[#6B3E26]/30 transition-all">
                      <Icon size={20} className="text-[#C89B3C]" strokeWidth={1.5} />
                    </div>
                  </div>
                  <p className="font-sans text-[10px] tracking-[0.1em] uppercase text-[#5B4B3F] mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#1E1A17]">{stat.value}</p>
                </motion.div>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }} className="rounded-lg border border-[#C89B3C]/20 bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#D4C4B0]">
          <h2 className="text-lg tracking-[-0.01em] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>Recent Orders</h2>
        </div>
        <div className="divide-y divide-[#D4C4B0]">
          {loading ? (
            <div className="px-6 py-6 text-sm text-[#5B4B3F]">Loading your recent orders…</div>
          ) : orderCount === 0 ? (
            <div className="px-6 py-6 text-sm text-[#5B4B3F]">No orders yet. Start shopping to create your first order.</div>
          ) : (
            Array.from({ length: Math.min(orderCount, 3) }).map((_, index) => (
              <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.35 + index * 0.05 }} className="px-6 py-4 hover:bg-[#F4E8D8]/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-sans text-sm font-semibold tracking-[0.05em] uppercase text-[#1E1A17]">Order #{index + 1}</p>
                    <p className="text-xs text-[#5B4B3F] mt-1">Recently placed</p>
                  </div>
                  <div className="text-right">
                    <p className="font-sans text-sm font-semibold text-[#C89B3C]">—</p>
                    <span className="inline-block px-3 py-1 mt-1 text-[10px] font-sans tracking-[0.05em] uppercase bg-[#C89B3C]/15 text-[#C89B3C] rounded-md">Processing</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
        <div className="px-6 py-3 bg-[#F4E8D8]/30 border-t border-[#D4C4B0]">
          <Link href="/account/orders" className="text-[#C89B3C] font-sans text-xs tracking-[0.1em] uppercase hover:text-[#B7792B] transition-colors">View All Orders →</Link>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/account/profile">
          <motion.div whileHover={{ y: -4 }} className="rounded-lg border border-[#C89B3C]/20 bg-gradient-to-br from-white/80 to-[#F4E8D8]/50 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
            <h3 className="text-lg tracking-[-0.01em] font-semibold mb-2" style={{ fontFamily: 'var(--font-cormorant)' }}>Complete Your Profile</h3>
            <p className="text-sm text-[#5B4B3F] mb-4">Add a profile picture and keep your information up to date.</p>
            <span className="text-[#C89B3C] font-sans text-xs tracking-[0.1em] uppercase hover:text-[#B7792B] transition-colors">Update Now →</span>
          </motion.div>
        </Link>

        <Link href="/account/addresses">
          <motion.div whileHover={{ y: -4 }} className="rounded-lg border border-[#C89B3C]/20 bg-gradient-to-br from-white/80 to-[#F4E8D8]/50 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
            <h3 className="text-lg tracking-[-0.01em] font-semibold mb-2" style={{ fontFamily: 'var(--font-cormorant)' }}>Add Delivery Address</h3>
            <p className="text-sm text-[#5B4B3F] mb-4">Save addresses for faster checkout on future orders.</p>
            <span className="text-[#C89B3C] font-sans text-xs tracking-[0.1em] uppercase hover:text-[#B7792B] transition-colors">Add Address →</span>
          </motion.div>
        </Link>
      </motion.div>
    </div>
  )
}
