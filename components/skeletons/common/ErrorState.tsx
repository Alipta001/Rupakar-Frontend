'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, WifiOff, AlertTriangle } from 'lucide-react'
import { isColdStartError, getCustomerErrorMessage } from '@/lib/api-errors'

export interface ErrorStateProps {
  error?: unknown
  message?: string
  title?: string
  onRetry?: () => void
  isRetrying?: boolean
  className?: string
}

export function ErrorState({
  error,
  message,
  title,
  onRetry,
  isRetrying = false,
  className = '',
}: ErrorStateProps) {
  const isCold = error ? isColdStartError(error) : false
  const defaultTitle = isCold
    ? "Connecting to Rupakar..."
    : title || 'Something went wrong'
  const displayMessage =
    message ||
    (error ? getCustomerErrorMessage(error) : "We're taking a little longer than usual to connect. Please try again.")

  const Icon = isCold ? WifiOff : AlertTriangle

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`text-center py-16 px-6 max-w-lg mx-auto rounded-lg border border-[#D4C4B0] bg-white/60 backdrop-blur-sm ${className}`}
      role="alert"
    >
      <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#EFE3D3] flex items-center justify-center text-[#7A1F1F]">
        <Icon size={24} strokeWidth={1.5} />
      </div>

      <h3
        className="text-[#1E1A17] text-2xl mb-2 font-normal"
        style={{ fontFamily: 'var(--font-cormorant), serif' }}
      >
        {defaultTitle}
      </h3>

      <p className="text-[#5B4B3F] font-sans text-xs leading-relaxed mb-6">
        {displayMessage}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center gap-2 bg-[#1E1A17] text-[#F8F4EE] px-5 py-2.5 font-sans text-xs tracking-[0.15em] uppercase hover:bg-[#6B3E26] transition-colors disabled:opacity-50"
        >
          <RefreshCw size={13} className={isRetrying ? 'animate-spin' : ''} />
          {isRetrying ? 'Connecting…' : 'Try Again'}
        </button>
      )}
    </motion.div>
  )
}
