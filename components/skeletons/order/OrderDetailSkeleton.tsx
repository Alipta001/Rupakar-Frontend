import React from 'react'
import { Skeleton } from '../common/Skeleton'

export function OrderDetailSkeleton() {
  return (
    <div className="space-y-8" role="status" aria-label="Loading order details">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#D4C4B0]">
        <div className="space-y-2">
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-64 h-8" />
          <Skeleton className="w-40 h-3" />
        </div>
        <Skeleton className="w-36 h-10 rounded-md" />
      </div>

      {/* Progress timeline */}
      <div className="p-6 border border-[#C89B3C]/20 bg-white/70 rounded-lg space-y-4">
        <Skeleton className="w-32 h-4 mb-2" />
        <Skeleton className="w-full h-12" />
      </div>

      {/* Main details grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Order items */}
          <div className="p-6 border border-[#C89B3C]/20 bg-white/70 rounded-lg space-y-4">
            <Skeleton className="w-36 h-5 mb-2" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-4 py-3 border-b border-[#D4C4B0]/40 last:border-none">
                <Skeleton className="w-20 h-24 rounded-none flex-shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <Skeleton className="w-3/4 h-4" />
                  <Skeleton className="w-1/3 h-3" />
                  <Skeleton className="w-20 h-4 mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Shipping address card */}
          <div className="p-6 border border-[#C89B3C]/20 bg-white/70 rounded-lg space-y-3">
            <Skeleton className="w-28 h-4 mb-2" />
            <Skeleton className="w-40 h-3.5" />
            <Skeleton className="w-full h-3" />
            <Skeleton className="w-3/4 h-3" />
            <Skeleton className="w-28 h-3" />
          </div>

          {/* Payment summary */}
          <div className="p-6 border border-[#C89B3C]/20 bg-white/70 rounded-lg space-y-3">
            <Skeleton className="w-28 h-4 mb-2" />
            <div className="space-y-2">
              <div className="flex justify-between"><Skeleton className="w-16 h-3" /><Skeleton className="w-14 h-3" /></div>
              <div className="flex justify-between"><Skeleton className="w-16 h-3" /><Skeleton className="w-12 h-3" /></div>
              <div className="flex justify-between"><Skeleton className="w-16 h-3" /><Skeleton className="w-14 h-3" /></div>
            </div>
            <div className="pt-2 border-t border-[#D4C4B0] flex justify-between">
              <Skeleton className="w-14 h-4" />
              <Skeleton className="w-20 h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
