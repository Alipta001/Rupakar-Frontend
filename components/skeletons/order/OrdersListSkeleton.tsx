import React from 'react'
import { Skeleton } from '../common/Skeleton'

export function OrderCardSkeleton() {
  return (
    <div className="rounded-lg border border-[#C89B3C]/20 bg-white/70 p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
        <div className="flex-1 space-y-2">
          <Skeleton className="w-36 h-5" />
          <div className="flex gap-4">
            <Skeleton className="w-24 h-3" />
            <Skeleton className="w-16 h-3" />
          </div>
        </div>

        <Skeleton className="w-28 h-8 rounded-md" />

        <div className="text-right md:text-left space-y-1">
          <Skeleton className="w-12 h-2.5" />
          <Skeleton className="w-20 h-6" />
        </div>

        <Skeleton className="w-24 h-4" />
      </div>
    </div>
  )
}

export function OrdersListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4" role="status" aria-label="Loading orders">
      {Array.from({ length: count }).map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  )
}
