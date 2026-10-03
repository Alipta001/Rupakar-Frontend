import React from 'react'
import { Skeleton } from '../common/Skeleton'
import { ProductCardSkeleton } from '../product/ProductCardSkeleton'

export function BestSellersSkeleton() {
  return (
    <div className="space-y-8" role="status" aria-label="Loading best sellers">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <Skeleton className="w-24 h-3 mb-3" />
          <Skeleton className="w-64 h-10 sm:h-12" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="w-28 h-4" />
          <div className="hidden sm:flex gap-2">
            <Skeleton className="w-9 h-9 rounded-full" />
            <Skeleton className="w-9 h-9 rounded-full" />
          </div>
        </div>
      </div>

      <div className="flex gap-4 sm:gap-6 overflow-hidden pb-6 pt-3 px-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-[185px] sm:w-[225px] md:w-[255px] lg:w-[270px] flex-shrink-0">
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  )
}
