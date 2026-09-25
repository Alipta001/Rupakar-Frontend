import React from 'react'
import { Skeleton } from '../common/Skeleton'

export interface ProductCardSkeletonProps {
  aspectRatio?: 'square' | 'portrait'
  className?: string
}

export function ProductCardSkeleton({
  aspectRatio = 'portrait',
  className = '',
}: ProductCardSkeletonProps) {
  const aspectClass = aspectRatio === 'square' ? 'aspect-square' : 'aspect-[3/4]'

  return (
    <div className={`group flex flex-col ${className}`}>
      {/* Product Image */}
      <Skeleton className={`w-full ${aspectClass} mb-3.5`} rounded="none" />

      {/* Craft / Category */}
      <Skeleton className="w-20 h-2.5 mb-2" rounded="sm" />

      {/* Title */}
      <Skeleton className="w-11/12 h-4 mb-2" rounded="sm" />

      {/* Rating */}
      <div className="flex items-center gap-2 mb-2">
        <Skeleton className="w-16 h-3" rounded="sm" />
        <Skeleton className="w-6 h-2.5" rounded="sm" />
      </div>

      {/* Price */}
      <div className="flex items-center gap-2 mt-auto">
        <Skeleton className="w-16 h-5" rounded="sm" />
        <Skeleton className="w-10 h-3" rounded="sm" />
      </div>
    </div>
  )
}
