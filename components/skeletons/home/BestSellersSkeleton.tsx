import React from 'react'
import { Skeleton } from '../common/Skeleton'
import { ProductCardSkeleton } from '../product/ProductCardSkeleton'

export function BestSellersSkeleton() {
  return (
    <div className="space-y-12" role="status" aria-label="Loading best sellers">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <Skeleton className="w-24 h-3 mb-3" />
          <Skeleton className="w-64 h-12" />
        </div>
        <Skeleton className="w-32 h-4" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
