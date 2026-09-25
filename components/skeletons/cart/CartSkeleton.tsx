import React from 'react'
import { Skeleton } from '../common/Skeleton'

export function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10" role="status" aria-label="Loading cart">
      {/* Left column: Cart items */}
      <div className="lg:col-span-2 space-y-6">
        <Skeleton className="w-48 h-8 mb-6" />

        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex gap-5 p-5 border border-[#D4C4B0] bg-white/60 rounded-lg"
          >
            {/* Item thumbnail */}
            <Skeleton className="w-24 h-28 flex-shrink-0 rounded-none" />

            {/* Item details */}
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <div className="flex justify-between items-start">
                  <Skeleton className="w-1/2 h-5 mb-2" />
                  <Skeleton className="w-16 h-5" />
                </div>
                <Skeleton className="w-1/3 h-3 mb-1.5" />
                <Skeleton className="w-1/4 h-3" />
              </div>

              {/* Quantity and actions */}
              <div className="flex items-center justify-between pt-3">
                <Skeleton className="w-24 h-8" />
                <Skeleton className="w-16 h-3" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right column: Order Summary */}
      <div className="p-6 border border-[#D4C4B0] bg-white/70 rounded-lg h-fit space-y-5">
        <Skeleton className="w-36 h-6 mb-4" />

        <div className="space-y-3 pb-5 border-b border-[#D4C4B0]">
          <div className="flex justify-between">
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-16 h-4" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-14 h-4" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="w-16 h-4" />
            <Skeleton className="w-12 h-4" />
          </div>
        </div>

        <div className="flex justify-between items-baseline pt-1">
          <Skeleton className="w-20 h-5" />
          <Skeleton className="w-24 h-7" />
        </div>

        <Skeleton className="w-full h-12 mt-4" />
      </div>
    </div>
  )
}
