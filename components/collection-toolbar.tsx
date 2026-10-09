'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, ArrowUpDown, Grid3X3, LayoutGrid, Columns2, X, Check, Sparkles } from 'lucide-react'

export interface CollectionToolbarProps {
  collectionName: string
  totalCount: number
  isFetching?: boolean
  activeSort: string
  onSortChange: (sort: string) => void
  minPrice: string
  maxPrice: string
  onPriceChange: (min: string, max: string) => void
  onlyFeatured: boolean
  onToggleFeatured: (featured: boolean) => void
  onClearFilters: () => void
  viewColumns: 2 | 3 | 4
  onViewColumnsChange: (cols: 2 | 3 | 4) => void
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'best_sellers', label: 'Best Sellers' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'featured', label: 'Featured Heritage' },
]

const PRICE_PRESETS = [
  { label: 'Under ₹1,000', min: '0', max: '1000' },
  { label: '₹1,000 – ₹2,500', min: '1000', max: '2500' },
  { label: '₹2,500 – ₹5,000', min: '2500', max: '5000' },
  { label: 'Above ₹5,000', min: '5000', max: '' },
]

export function CollectionToolbar({
  collectionName,
  totalCount,
  isFetching = false,
  activeSort,
  onSortChange,
  minPrice,
  maxPrice,
  onPriceChange,
  onlyFeatured,
  onToggleFeatured,
  onClearFilters,
  viewColumns,
  onViewColumnsChange,
}: CollectionToolbarProps) {
  const [showFilterDrawer, setShowFilterDrawer] = useState(false)
  const [tempMin, setTempMin] = useState(minPrice)
  const [tempMax, setTempMax] = useState(maxPrice)

  const hasPriceFilter = Boolean(minPrice || maxPrice)
  const activeFilterCount = (hasPriceFilter ? 1 : 0) + (onlyFeatured ? 1 : 0)
  const hasActiveFilters = activeFilterCount > 0

  const handleApplyPrice = (e: React.FormEvent) => {
    e.preventDefault()
    onPriceChange(tempMin, tempMax)
  }

  const handleSelectPreset = (min: string, max: string) => {
    setTempMin(min)
    setTempMax(max)
    onPriceChange(min, max)
  }

  return (
    <div className="w-full mb-8">
      {/* ─── Main Toolbar Bar ─── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 py-4 px-4 sm:px-6 bg-[#FAF7F2] border border-[#D4C4B0]/80 rounded-2xl shadow-sm">
        {/* Left: Collection Name & Product Count */}
        <div className="flex items-center gap-3">
          <h3
            className="text-lg sm:text-xl text-[#1E1A17] font-medium tracking-tight"
            style={{ fontFamily: 'var(--font-cormorant), serif' }}
          >
            {collectionName} Catalog
          </h3>
          <span className="text-xs font-sans text-[#8C7A6B] border-l border-[#D4C4B0] pl-3 tracking-wider uppercase text-[10px]">
            {isFetching ? 'Updating…' : `${totalCount} ${totalCount === 1 ? 'piece' : 'pieces'}`}
          </span>
        </div>

        {/* Right: Controls (Filters, Sort, Grid density) */}
        <div className="flex items-center justify-between md:justify-end gap-2.5 sm:gap-4 flex-wrap">
          {/* Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border font-sans text-xs uppercase tracking-[0.14em] font-medium transition-all duration-300 shadow-sm active:scale-95 ${
              showFilterDrawer || hasActiveFilters
                ? 'bg-[#1E1A17] text-[#F8F4EE] border-[#1E1A17]'
                : 'bg-white hover:bg-[#FAF7F2] text-[#1E1A17] border-[#D4C4B0] hover:border-[#C89B3C]'
            }`}
            aria-expanded={showFilterDrawer}
            aria-label="Filter products"
          >
            <SlidersHorizontal size={13} className={showFilterDrawer || hasActiveFilters ? 'text-[#C89B3C]' : 'text-[#5B4B3F]'} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#C89B3C] text-[#1E1A17] text-[9px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Quick Featured Toggle */}
          <button
            type="button"
            onClick={() => onToggleFeatured(!onlyFeatured)}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border font-sans text-xs uppercase tracking-[0.12em] transition-all duration-300 active:scale-95 ${
              onlyFeatured
                ? 'bg-[#C89B3C] text-[#1E1A17] border-[#C89B3C] font-semibold shadow-sm'
                : 'bg-white text-[#5B4B3F] border-[#D4C4B0] hover:border-[#C89B3C]'
            }`}
          >
            <Sparkles size={12} className={onlyFeatured ? 'text-[#1E1A17]' : 'text-[#C89B3C]'} />
            <span>Featured Only</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative inline-flex items-center">
            <div className="relative flex items-center bg-white border border-[#D4C4B0] hover:border-[#C89B3C] rounded-xl px-3 py-2 transition-colors shadow-sm">
              <ArrowUpDown size={12} className="text-[#8C7A6B] mr-2 flex-shrink-0" />
              <select
                value={activeSort}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-transparent text-[#1E1A17] font-sans text-xs tracking-wider uppercase focus:outline-none cursor-pointer pr-1"
                aria-label="Sort collection by"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="text-black normal-case">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* View / Grid Density Switcher (Desktop) */}
          <div className="hidden lg:flex items-center gap-1 border-l border-[#D4C4B0] pl-3">
            <button
              type="button"
              onClick={() => onViewColumnsChange(4)}
              className={`p-2 rounded-lg transition-colors ${
                viewColumns === 4 ? 'bg-[#1E1A17] text-[#FAF7F2]' : 'text-[#8C7A6B] hover:text-[#1E1A17] hover:bg-white'
              }`}
              title="4 columns (compact)"
              aria-label="4 columns grid"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              onClick={() => onViewColumnsChange(3)}
              className={`p-2 rounded-lg transition-colors ${
                viewColumns === 3 ? 'bg-[#1E1A17] text-[#FAF7F2]' : 'text-[#8C7A6B] hover:text-[#1E1A17] hover:bg-white'
              }`}
              title="3 columns (editorial)"
              aria-label="3 columns grid"
            >
              <Grid3X3 size={15} />
            </button>
            <button
              type="button"
              onClick={() => onViewColumnsChange(2)}
              className={`p-2 rounded-lg transition-colors ${
                viewColumns === 2 ? 'bg-[#1E1A17] text-[#FAF7F2]' : 'text-[#8C7A6B] hover:text-[#1E1A17] hover:bg-white'
              }`}
              title="2 columns (large)"
              aria-label="2 columns grid"
            >
              <Columns2 size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Expandable Filter Panel ─── */}
      <AnimatePresence>
        {showFilterDrawer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-5 sm:p-6 bg-white border border-[#D4C4B0] rounded-2xl shadow-md">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                {/* Price Presets */}
                <div className="flex-1">
                  <span className="block text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-[#C89B3C] mb-2.5">
                    Price Filter
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {PRICE_PRESETS.map((preset) => {
                      const isSelected = minPrice === preset.min && maxPrice === preset.max
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => handleSelectPreset(preset.min, preset.max)}
                          className={`px-3 py-1.5 rounded-lg border font-sans text-xs tracking-wider transition-all ${
                            isSelected
                              ? 'bg-[#1E1A17] text-[#F8F4EE] border-[#1E1A17] font-medium'
                              : 'bg-[#FAF7F2] text-[#5B4B3F] border-[#D4C4B0]/80 hover:border-[#C89B3C]'
                          }`}
                        >
                          {preset.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Custom Min / Max Form */}
                <form onSubmit={handleApplyPrice} className="flex items-end gap-2.5 flex-wrap">
                  <div>
                    <label className="block text-[9px] font-sans uppercase tracking-[0.15em] text-[#8C7A6B] mb-1">
                      Min (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={tempMin}
                      onChange={(e) => setTempMin(e.target.value)}
                      className="w-24 px-2.5 py-1.5 text-xs bg-[#FAF7F2] border border-[#D4C4B0] rounded-lg focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-sans uppercase tracking-[0.15em] text-[#8C7A6B] mb-1">
                      Max (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="Max"
                      value={tempMax}
                      onChange={(e) => setTempMax(e.target.value)}
                      className="w-24 px-2.5 py-1.5 text-xs bg-[#FAF7F2] border border-[#D4C4B0] rounded-lg focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#1E1A17] text-[#F8F4EE] hover:bg-[#C89B3C] hover:text-[#1E1A17] font-sans text-xs uppercase tracking-wider transition-colors shadow-sm"
                  >
                    Apply
                  </button>
                </form>
              </div>

              {/* Mobile Quick Featured Toggle */}
              <div className="mt-4 pt-4 border-t border-[#E8DFD3] flex items-center justify-between sm:hidden">
                <span className="text-xs font-sans text-[#5B4B3F]">Featured Items Only</span>
                <button
                  type="button"
                  onClick={() => onToggleFeatured(!onlyFeatured)}
                  className={`px-3 py-1 rounded-lg border text-xs font-sans uppercase tracking-wider ${
                    onlyFeatured
                      ? 'bg-[#C89B3C] text-[#1E1A17] border-[#C89B3C] font-semibold'
                      : 'bg-[#FAF7F2] text-[#5B4B3F] border-[#D4C4B0]'
                  }`}
                >
                  {onlyFeatured ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Active Filter Chips Bar ─── */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="text-[10px] font-sans text-[#8C7A6B] uppercase tracking-[0.16em]">Active Filters:</span>
          {hasPriceFilter && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#D4C4B0] text-[#1E1A17] text-[10.5px] font-sans">
              <span>Price: ₹{minPrice || '0'} – {maxPrice ? `₹${maxPrice}` : 'Above'}</span>
              <button
                type="button"
                onClick={() => {
                  setTempMin('')
                  setTempMax('')
                  onPriceChange('', '')
                }}
                className="hover:text-[#7A1F1F]"
                aria-label="Remove price filter"
              >
                <X size={11} />
              </button>
            </span>
          )}

          {onlyFeatured && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#C89B3C] text-[#1E1A17] text-[10.5px] font-sans">
              <span>Featured Only</span>
              <button
                type="button"
                onClick={() => onToggleFeatured(false)}
                className="hover:text-[#7A1F1F]"
                aria-label="Remove featured filter"
              >
                <X size={11} />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={() => {
              setTempMin('')
              setTempMax('')
              onClearFilters()
            }}
            className="text-[10.5px] font-sans text-[#7A1F1F] hover:underline ml-1"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}

export default CollectionToolbar
