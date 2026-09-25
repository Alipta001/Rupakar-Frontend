import { OrdersListSkeleton } from '@/components/skeletons'

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-[#D4C4B0]/30 rounded w-1/4 animate-pulse" />
      <OrdersListSkeleton count={4} />
    </div>
  )
}
