import axios from 'axios'

export type CustomerApiError = Error & {
  status: number
  code?: string
  requestId?: string
  isNetworkError?: boolean
}

export const normalizeApiError = (cause: unknown): CustomerApiError => {
  if (axios.isAxiosError(cause)) {
    const status = cause.response?.status ?? 0
    const payload = cause.response?.data as {
      error?: { code?: string; message?: string }
      message?: string
      requestId?: string
    } | undefined
    const rawMessage = payload?.error?.message || payload?.message || cause.message || 'Request failed'
    const requestId = payload?.requestId || (cause.response?.headers?.['x-request-id'] as string | undefined)

    const error = new Error(rawMessage) as CustomerApiError
    error.name = 'CustomerApiError'
    error.status = status
    error.code = payload?.error?.code
    error.requestId = requestId
    error.isNetworkError = !cause.response
    return error
  }

  if (cause instanceof Error) {
    return Object.assign(cause, { status: 0, isNetworkError: false }) as CustomerApiError
  }

  return Object.assign(new Error('Request failed'), { status: 0, isNetworkError: true }) as CustomerApiError
}

export const getCustomerErrorMessage = (
  cause: unknown,
  context: 'cart' | 'product' | 'order' | 'general' = 'general'
): string => {
  const error = normalizeApiError(cause)

  // Direct business error code mappings across the application
  if (error.code === 'ORDER_ALREADY_PACKED') {
    return 'This order can no longer be cancelled because it has already been packed.'
  }
  if (error.code === 'REFUND_FAILED') {
    return "We couldn't complete the refund yet. Your order has not been cancelled. Please try again."
  }
  if (error.code === 'DUPLICATE_CANCELLATION_REQUEST') {
    return 'A cancellation request is already pending for this item.'
  }
  if (error.code === 'INVALID_CANCELLATION_PAYLOAD') {
    return 'Please select a cancellation reason before continuing.'
  }
  if (error.code === 'ORDER_NOT_ELIGIBLE' || error.code === 'VENDOR_ORDER_NOT_ELIGIBLE') {
    return 'This order is no longer eligible for cancellation.'
  }
  if (error.code === 'REVIEW_ALREADY_EXISTS') {
    return "You've already reviewed this product."
  }
  if (error.code === 'ORDER_NOT_ELIGIBLE_FOR_REVIEW' || error.code === 'PRODUCT_NOT_PURCHASED') {
    return "You can review products you've purchased."
  }

  // Support / debugging suffix
  const supportSuffix = error.requestId ? ` If the problem continues, contact support with Request ID ${error.requestId}.` : ''

  if (context === 'order') {
    if (error.code === 'ORDER_NOT_FOUND') return "We couldn't find this order."
    if (error.status === 409) {
      return error.message || 'This order cannot be modified at this time due to a state conflict.'
    }
    if (error.status === 400 || error.status === 422) {
      return error.message || 'Please check the entered information and try again.'
    }
    if (error.status === 401 || error.code === 'UNAUTHORIZED') {
      return 'Your session has expired. Please sign in again.'
    }
    if (error.status === 403 || error.code === 'FORBIDDEN') {
      return 'You are not authorized to perform this action on this order.'
    }
    if (error.isNetworkError) {
      return "We couldn't connect right now. Please check your internet connection and try again."
    }
    if (error.status >= 500) {
      return `We couldn't cancel this order right now. Your order has not been cancelled. Please try again.${supportSuffix}`
    }
    return `We couldn't complete your order request. Please try again.${supportSuffix}`
  }

  if (context === 'cart') {
    if (error.code === 'INSUFFICIENT_STOCK') {
      const available = error.message.match(/(?:only|available)\D+(\d+)/i)?.[1]
      return available && Number(available) > 0 ? `Only ${available} left in stock.` : 'This item is currently out of stock.'
    }
    if (error.code === 'VARIANT_NOT_FOUND' || error.code === 'PRODUCT_VARIANT_NOT_FOUND') {
      return 'This option is currently unavailable. Please choose another option.'
    }
    if (error.code === 'PRODUCT_NOT_FOUND') return 'This product is no longer available.'
    if (error.code === 'PRODUCT_UNAVAILABLE' || error.code === 'PRODUCT_NOT_AVAILABLE') {
      return 'This product is currently unavailable.'
    }
    if (error.status === 401 || error.code === 'UNAUTHORIZED') return 'Your session has expired. Please sign in again.'
    if (error.status === 403) return 'Please sign in to continue.'
    if (error.isNetworkError) return "We couldn't add this item right now. Please try again."
    if (error.status >= 500) return `We couldn't update your cart right now. Please try again.${supportSuffix}`
    if (error.status === 429) return 'Too many requests. Please wait a moment and try again.'
    if (error.status === 409) return 'This item is no longer available in the requested quantity.'
    if (error.status === 400 || error.status === 422) return 'Please check the selected option and quantity.'
    return 'Something went wrong while adding this item. Please try again.'
  }

  if (context === 'product') {
    if (error.status === 404 || error.code === 'PRODUCT_NOT_FOUND') return "We couldn't find this product."
    if (error.isNetworkError) return "We couldn't connect right now. Please try again."
    if (error.status >= 500) return `Something went wrong on our side. Please try again.${supportSuffix}`
  }

  if (error.status === 401 || error.code === 'UNAUTHORIZED') return 'Please sign in to continue.'
  if (error.status === 403) return 'You are not authorized to perform this action.'
  if (error.isNetworkError) return "We couldn't connect right now. Please try again."
  if (error.status >= 500) return `Something went wrong on our side. Please try again.${supportSuffix}`
  if (error.status === 404) return "We couldn't find what you were looking for."
  if (error.status === 400 || error.status === 422) return error.message || 'Please check the information and try again.'
  if (error.status === 429) return 'Too many requests. Please wait a moment and try again.'
  return `Something went wrong. Please try again.${supportSuffix}`
}
