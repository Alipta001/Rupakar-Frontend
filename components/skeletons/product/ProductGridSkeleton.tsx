import React from 'react'
import { ProductCardSkeleton } from './ProductCardSkeleton'

export interface ProductGridSkeletonProps {
  count?: number
  columns?: 2 | 3 | 4 | 5
  className?: string
}

export function ProductGridSkeleton({
  count = 8,
  columns = 4,
  className = '',
}: ProductGridSkeletonProps) {
  const colClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  }

  return (
    <div
      className={`grid ${colClasses[columns]} gap-5 ${className}`}
      role="status"
      aria-label="Loading products"
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}
