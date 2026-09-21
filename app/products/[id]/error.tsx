'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { getCustomerErrorMessage } from '@/lib/api-errors'

export default function ProductError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') console.error(error)
  }, [error])

  return (
    <main className="min-h-screen bg-[#F8F4EE] pt-32">
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <p className="text-[#C89B3C] font-sans text-[10px] tracking-[0.3em] uppercase mb-4">Product details</p>
        <h1 className="text-[#1E1A17] mb-4" style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '2.5rem', fontWeight: 400 }}>
          We couldn&apos;t load this product
        </h1>
        <p className="text-[#5B4B3F] font-sans text-sm mb-8">{getCustomerErrorMessage(error, 'product')}</p>
        <div className="flex justify-center gap-4">
          <button onClick={reset} className="bg-[#1E1A17] text-[#F8F4EE] px-6 py-3 font-sans text-xs tracking-[0.15em] uppercase">
            Try again
          </button>
          <Link href="/collections" className="border border-[#D4C4B0] text-[#5B4B3F] px-6 py-3 font-sans text-xs tracking-[0.15em] uppercase">
            Browse collections
          </Link>
        </div>
      </div>
    </main>
  )
}
