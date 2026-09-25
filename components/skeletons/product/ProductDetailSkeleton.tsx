import React from 'react'
import { Skeleton } from '../common/Skeleton'

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12" role="status" aria-label="Loading product details">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-8">
        <Skeleton className="w-12 h-3" />
        <span className="text-[#D4C4B0]">/</span>
        <Skeleton className="w-20 h-3" />
        <span className="text-[#D4C4B0]">/</span>
        <Skeleton className="w-32 h-3" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left: Image gallery */}
        <div className="space-y-4">
          <Skeleton className="w-full aspect-[4/5] rounded-none" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-none" />
            ))}
          </div>
        </div>

        {/* Right: Product information */}
        <div className="flex flex-col space-y-6">
          {/* Craft tag */}
          <Skeleton className="w-28 h-3" />

          {/* Title */}
          <div className="space-y-2">
            <Skeleton className="w-4/5 h-8" />
            <Skeleton className="w-3/5 h-8" />
          </div>

          {/* Ratings */}
          <div className="flex items-center gap-3">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-16 h-3" />
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 py-2 border-y border-[#D4C4B0]/50">
            <Skeleton className="w-28 h-8" />
            <Skeleton className="w-16 h-4" />
          </div>

          {/* Short description */}
          <div className="space-y-2 pt-2">
            <Skeleton className="w-full h-3" />
            <Skeleton className="w-11/12 h-3" />
            <Skeleton className="w-4/5 h-3" />
          </div>

          {/* Variant options */}
          <div className="space-y-3 pt-4">
            <Skeleton className="w-24 h-3" />
            <div className="flex gap-3">
              <Skeleton className="w-28 h-10" />
              <Skeleton className="w-28 h-10" />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 pt-4">
            <Skeleton className="flex-1 h-14" />
            <Skeleton className="w-14 h-14" />
          </div>

          {/* Artisan badge card */}
          <div className="p-5 border border-[#D4C4B0] bg-[#EFE3D3]/40 mt-6 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="w-32 h-3.5" />
                <Skeleton className="w-24 h-2.5" />
              </div>
            </div>
            <Skeleton className="w-full h-3" />
            <Skeleton className="w-4/5 h-3" />
          </div>
        </div>
      </div>
    </div>
  )
}
