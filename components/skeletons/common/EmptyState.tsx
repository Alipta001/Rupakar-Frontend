'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LucideIcon, Sparkles } from 'lucide-react'

export interface EmptyStateProps {
  icon?: LucideIcon
  eyebrow?: string
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon: Icon = Sparkles,
  eyebrow = 'Curated Catalog',
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`text-center py-20 px-6 max-w-xl mx-auto ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#EFE3D3] flex items-center justify-center text-[#C89B3C]">
        <Icon size={28} strokeWidth={1.5} />
      </div>

      {eyebrow && (
        <p className="text-[#C89B3C] font-sans text-[10px] tracking-[0.25em] uppercase mb-2">
          {eyebrow}
        </p>
      )}

      <h3
        className="text-[#1E1A17] text-3xl mb-3 font-light"
        style={{ fontFamily: 'var(--font-cormorant), serif' }}
      >
        {title}
      </h3>

      {description && (
        <p className="text-[#5B4B3F] font-sans text-sm leading-relaxed mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}

      {actionLabel && (
        <div>
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-2 bg-[#1E1A17] text-[#F8F4EE] px-6 py-3 font-sans text-xs tracking-[0.15em] uppercase hover:bg-[#6B3E26] transition-colors"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 bg-[#1E1A17] text-[#F8F4EE] px-6 py-3 font-sans text-xs tracking-[0.15em] uppercase hover:bg-[#6B3E26] transition-colors"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}
