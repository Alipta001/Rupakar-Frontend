'use client'

import React from 'react'
import { Star } from 'lucide-react'

interface RatingStarsProps {
  rating: number
  reviews?: number
  size?: number
  showNumber?: boolean
  showCount?: boolean
  className?: string
  starClassName?: string
}

export function RatingStars({
  rating,
  reviews,
  size = 11,
  showNumber = false,
  showCount = true,
  className = '',
  starClassName = '',
}: RatingStarsProps) {
  const numericRating = Math.max(0, Math.min(5, Number(rating) || 0))
  const roundedRating = Math.round(numericRating * 10) / 10

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`} aria-label={`Rating: ${roundedRating} out of 5 stars`}>
      {showNumber && (
        <span className="font-sans font-semibold text-xs text-[#1E1A17] tracking-tight">
          {roundedRating.toFixed(1)}
        </span>
      )}

      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((index) => {
          const isFull = numericRating >= index
          const isHalf = !isFull && numericRating >= index - 0.5

          return (
            <span key={index} className="relative inline-flex items-center justify-center">
              {/* Background empty star */}
              <Star
                size={size}
                strokeWidth={1.5}
                className={`text-[#D8D0C5] fill-[#F0ECE4] ${starClassName}`}
              />

              {/* Foreground filled/half star */}
              {(isFull || isHalf) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: isFull ? '100%' : '50%' }}
                >
                  <Star
                    size={size}
                    strokeWidth={1.5}
                    className={`text-[#C89B3C] fill-[#C89B3C] ${starClassName}`}
                  />
                </span>
              )}
            </span>
          )
        })}
      </div>

      {showCount && typeof reviews === 'number' && (
        <span className="text-[#5B4B3F] font-sans text-[10px] sm:text-[11px] tracking-tight">
          ({reviews.toLocaleString()})
        </span>
      )}
    </div>
  )
}

interface InteractiveRatingStarsProps {
  value: number
  onChange: (value: number) => void
  size?: number
  disabled?: boolean
  className?: string
}

export function InteractiveRatingStars({
  value,
  onChange,
  size = 22,
  disabled = false,
  className = '',
}: InteractiveRatingStarsProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null)
  const activeValue = hoverValue !== null ? hoverValue : value

  return (
    <div
      className={`inline-flex items-center gap-1 ${className}`}
      role="radiogroup"
      aria-label="Select rating"
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = activeValue >= star

        return (
          <button
            type="button"
            key={star}
            disabled={disabled}
            onClick={() => onChange(star)}
            onMouseEnter={() => !disabled && setHoverValue(star)}
            onMouseLeave={() => !disabled && setHoverValue(null)}
            className={`p-1 rounded transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-[#C89B3C]/30 ${
              disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:scale-110 active:scale-95'
            }`}
            aria-label={`${star} star${star === 1 ? '' : 's'}`}
            role="radio"
            aria-checked={value === star}
          >
            <Star
              size={size}
              strokeWidth={1.5}
              className={`transition-colors duration-200 ${
                isFilled
                  ? 'text-[#C89B3C] fill-[#C89B3C] drop-shadow-sm'
                  : 'text-[#D8D0C5] fill-[#F4EFEA]'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}
