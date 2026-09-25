import React from 'react'
import { Skeleton } from '../common/Skeleton'

export function CategoryHeroSkeleton() {
  return (
    <section className="relative isolate min-h-[520px] overflow-hidden bg-[#241914] flex items-end px-6 pb-20 pt-32 md:px-12">
      <div className="max-w-2xl w-full space-y-4">
        <Skeleton className="w-28 h-3.5 bg-white/20" />
        <Skeleton className="w-4/5 h-16 bg-white/20" />
        <Skeleton className="w-3/5 h-6 bg-white/20" />
      </div>
    </section>
  )
}
