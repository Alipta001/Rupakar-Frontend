import React from 'react'
import { Skeleton } from '../common/Skeleton'

export function CheckoutSkeleton() {
  return (
    <div className="space-y-10" role="status" aria-label="Preparing checkout">
      {/* Steps bar */}
      <div className="flex items-center justify-center gap-6 max-w-md mx-auto py-2">
        <Skeleton className="w-24 h-8 rounded-full" />
        <div className="w-12 h-0.5 bg-[#D4C4B0]" />
        <Skeleton className="w-24 h-8 rounded-full" />
        <div className="w-12 h-0.5 bg-[#D4C4B0]" />
        <Skeleton className="w-24 h-8 rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left column: Checkout step content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 border border-[#D4C4B0] bg-white/70 rounded-lg space-y-4">
            <Skeleton className="w-48 h-6 mb-2" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-32 rounded-md" />
              <Skeleton className="h-32 rounded-md" />
            </div>
            <Skeleton className="w-40 h-10 mt-2" />
          </div>

          <div className="p-6 border border-[#D4C4B0] bg-white/70 rounded-lg space-y-4">
            <Skeleton className="w-36 h-6 mb-2" />
            <Skeleton className="w-full h-14" />
          </div>
        </div>

        {/* Right column: Order summary */}
        <div className="p-6 border border-[#D4C4B0] bg-white/70 rounded-lg h-fit space-y-5">
          <Skeleton className="w-36 h-6 mb-2" />
          <div className="space-y-3 pb-5 border-b border-[#D4C4B0]">
            <div className="flex gap-3">
              <Skeleton className="w-14 h-16 rounded-none flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-3/4 h-3.5" />
                <Skeleton className="w-1/2 h-3" />
                <Skeleton className="w-16 h-3" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-16 h-4" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-16 h-4" />
            </div>
          </div>
          <Skeleton className="w-full h-12 mt-4" />
        </div>
      </div>
    </div>
  )
}
