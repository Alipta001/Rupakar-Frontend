import React from 'react'
import { Skeleton } from '../common/Skeleton'

export function AccountDashboardSkeleton() {
  return (
    <div className="space-y-8" role="status" aria-label="Loading account dashboard">
      {/* Welcome header */}
      <div className="space-y-2">
        <Skeleton className="w-56 h-9" />
        <Skeleton className="w-80 h-4" />
      </div>

      {/* 4 Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-[#C89B3C]/20 bg-white/70 p-6 shadow-sm space-y-3">
            <Skeleton className="w-10 h-10 rounded-md" />
            <Skeleton className="w-20 h-2.5" />
            <Skeleton className="w-14 h-7" />
          </div>
        ))}
      </div>

      {/* Recent orders card */}
      <div className="rounded-lg border border-[#C89B3C]/20 bg-white/70 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#D4C4B0]">
          <Skeleton className="w-36 h-5" />
        </div>
        <div className="divide-y divide-[#D4C4B0]/60 p-6 space-y-4">
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-12" />
        </div>
      </div>
    </div>
  )
}

export function AddressCardSkeleton({ count = 1 }: { count?: number } = {}) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-lg border-2 border-[#D4C4B0] bg-white/70 p-6 space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="w-32 h-5" />
            <div className="flex gap-2">
              <Skeleton className="w-8 h-8 rounded-md" />
              <Skeleton className="w-8 h-8 rounded-md" />
            </div>
          </div>
          <Skeleton className="w-3/4 h-3.5" />
          <Skeleton className="w-1/2 h-3.5" />
          <Skeleton className="w-28 h-3.5" />
        </div>
      ))}
    </>
  )
}

