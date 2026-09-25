'use client'

import React from 'react'
import { ErrorState, ErrorStateProps } from './ErrorState'
import { EmptyState, EmptyStateProps } from './EmptyState'

export interface StateBoundaryProps {
  isLoading: boolean
  isError?: boolean
  error?: unknown
  isEmpty?: boolean
  loadingComponent: React.ReactNode
  emptyProps?: EmptyStateProps
  emptyComponent?: React.ReactNode
  errorProps?: Partial<ErrorStateProps>
  errorComponent?: React.ReactNode
  children: React.ReactNode
  keepPreviousDataDuringRefetch?: boolean
  isFetching?: boolean
}

export function StateBoundary({
  isLoading,
  isError = false,
  error,
  isEmpty = false,
  loadingComponent,
  emptyProps,
  emptyComponent,
  errorProps,
  errorComponent,
  children,
  keepPreviousDataDuringRefetch = false,
  isFetching = false,
}: StateBoundaryProps) {
  // If initial load or fetching while empty: show skeleton loading
  if ((isLoading || (isFetching && isEmpty)) && (!keepPreviousDataDuringRefetch || isEmpty)) {
    return (
      <div role="status" aria-busy="true" aria-live="polite">
        {loadingComponent}
      </div>
    )
  }

  // If error occurred and we don't have existing data to display
  if (isError && (!keepPreviousDataDuringRefetch || isEmpty)) {
    if (errorComponent) return <>{errorComponent}</>
    return <ErrorState error={error} {...errorProps} />
  }

  // If successfully resolved and zero results
  if (!isLoading && !isFetching && !isError && isEmpty) {
    if (emptyComponent) return <>{emptyComponent}</>
    if (emptyProps) return <EmptyState {...emptyProps} />
    return null
  }

  // Data state (with subtle refetch overlay if background fetching)
  return (
    <div className="relative">
      {isFetching && !isLoading && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#F8F4EE]/40 backdrop-blur-[1px] pointer-events-none z-10 transition-opacity duration-300"
        />
      )}
      {children}
    </div>
  )
}
