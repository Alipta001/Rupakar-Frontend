import React from 'react'
import { Skeleton } from '../common/Skeleton'
import { ProductGridSkeleton } from '../product/ProductGridSkeleton'

export function CollectionsGridSkeleton() {
  return (
    <div className="space-y-10" role="status" aria-label="Loading collection">
      {/* Filter and sorting bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#D4C4B0]">
        {/* Category tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-20 h-9" rounded="sm" />
          ))}
        </div>

        {/* Sort controls and count */}
        <div className="flex items-center gap-4">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-40 h-9" rounded="sm" />
        </div>
      </div>

      {/* Products grid */}
      <ProductGridSkeleton count={8} columns={4} />
    </div>
  )
}
