import { AxiosInstance, ACCESS_TOKEN_STORAGE_KEY } from '@/api/axios/axios'
import { endPoints } from '@/api/endPoints/endPoints'
import {
  getGuestWishlist,
  addToGuestWishlist,
  removeFromGuestWishlist,
  clearGuestWishlist,
  GuestWishlistItem,
} from './guest-wishlist'

export type ApiEnvelope<T> = {
  success: boolean
  data: T
  message?: string
}

const unwrap = <T>(payload: any): T => payload?.data ?? payload ?? ({} as T)

export async function fetchCurrentUser() {
  const response = await AxiosInstance.get(endPoints.user.me)
  return unwrap<any>(response.data)
}

export async function updateCurrentUser(payload: Record<string, any>) {
  const response = await AxiosInstance.patch(endPoints.user.me, payload)
  return unwrap<any>(response.data)
}

export async function changePassword(payload: { currentPassword: string; newPassword: string }) {
  const response = await AxiosInstance.post(endPoints.user.changePassword, payload)
  return unwrap<any>(response.data)
}

export async function requestPasswordReset(email: string) {
  const response = await AxiosInstance.post(endPoints.auth.forgotPassword, { email })
  return unwrap<any>(response.data)
}

export async function resetPassword(payload: { email: string; otp: string; newPassword: string }) {
  const response = await AxiosInstance.post(endPoints.auth.resetPassword, payload)
  return unwrap<any>(response.data)
}

export async function fetchAddresses() {
  const response = await AxiosInstance.get(endPoints.user.addresses)
  return unwrap<any[]>(response.data)
}

export async function createAddress(payload: Record<string, any>) {
  const response = await AxiosInstance.post(endPoints.user.addresses, payload)
  return unwrap<any>(response.data)
}

export async function updateAddress(addressId: string, payload: Record<string, any>) {
  const response = await AxiosInstance.patch(`${endPoints.user.addresses}/${addressId}`, payload)
  return unwrap<any>(response.data)
}

export async function deleteAddress(addressId: string) {
  const response = await AxiosInstance.delete(`${endPoints.user.addresses}/${addressId}`)
  return unwrap<any>(response.data)
}

const isClientAuthenticated = () => {
  if (typeof window === 'undefined') return false
  try {
    return Boolean(window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY))
  } catch {
    return false
  }
}

export async function fetchWishlistPage(page = 1, limit = 12) {
  if (!isClientAuthenticated()) {
    const items = getGuestWishlist()
    return { items: items.slice((page - 1) * limit, page * limit), page, limit, total: items.length, totalPages: Math.ceil(items.length / limit), hasNext: page * limit < items.length, hasPrevious: page > 1 }
  }
  try {
    const response = await AxiosInstance.get(endPoints.wishlist.list, { params: { page, limit } })
    return unwrap<{ userId?: string; items?: any[] }>(response.data)
  } catch (error: any) {
    if (error?.response?.status === 401) {
      return { items: getGuestWishlist() }
    }
    throw error
  }
}

export async function fetchWishlist() { return fetchWishlistPage() }

export async function addWishlistItem(productId: string, itemDetails?: Partial<GuestWishlistItem>) {
  if (!isClientAuthenticated()) {
    const updated = addToGuestWishlist({ productId, ...itemDetails })
    return { success: true, items: updated }
  }
  const response = await AxiosInstance.post(`${endPoints.wishlist.list}/${productId}`)
  return unwrap<any>(response.data)
}

export async function removeWishlistItem(productId: string) {
  if (!isClientAuthenticated()) {
    const updated = removeFromGuestWishlist(productId)
    return { success: true, items: updated }
  }
  const response = await AxiosInstance.delete(`${endPoints.wishlist.list}/${productId}`)
  return unwrap<any>(response.data)
}

export async function syncGuestWishlistToServer() {
  const guestItems = getGuestWishlist()
  if (guestItems.length === 0) return
  for (const item of guestItems) {
    try {
      const pid = item.productId || item.id
      if (pid) {
        await AxiosInstance.post(`${endPoints.wishlist.list}/${pid}`)
      }
    } catch {
      // Continue sync even if individual item already exists on server
    }
  }
  clearGuestWishlist()
}

export async function mergeGuestCart(guestSessionId?: string) {
  const response = await AxiosInstance.post(`${endPoints.cart.list}/merge`, { guestSessionId })
  return unwrap<any>(response.data)
}

export async function fetchCart() {
  const response = await AxiosInstance.get(endPoints.cart.list)
  return unwrap<any>(response.data)
}

export async function addCartItem(payload: { productId: string; variantId: string; quantity: number }) {
  if (!payload.productId || !payload.variantId) {
    throw new Error('A persisted product and variant are required to add an item to the cart')
  }
  const response = await AxiosInstance.post(endPoints.cart.items, payload)
  return unwrap<any>(response.data)
}

export async function updateCartItem(variantId: string, quantity: number) {
  const response = await AxiosInstance.patch(`${endPoints.cart.items}/${variantId}`, { quantity })
  return unwrap<any>(response.data)
}

export async function removeCartItem(variantId: string) {
  const response = await AxiosInstance.delete(`${endPoints.cart.items}/${variantId}`)
  return unwrap<any>(response.data)
}

export async function clearCart() {
  const response = await AxiosInstance.delete(endPoints.cart.list)
  return unwrap<any>(response.data)
}

export async function fetchOrdersPage(page = 1, limit = 12, status?: string) {
  const response = await AxiosInstance.get(endPoints.orders.list, { params: { page, limit, ...(status && status !== 'ALL' ? { status } : {}) } })
  const payload = unwrap<any>(response.data)
  return Array.isArray(payload) ? { items: payload, page, limit, total: payload.length, totalPages: 1, hasNext: false, hasPrevious: false } : payload
}

export async function fetchOrders() { return fetchOrdersPage() }

export async function fetchProductReviews(productId: string, page = 1, limit = 10) {
  const response = await AxiosInstance.get(`${endPoints.reviews.product}/${encodeURIComponent(productId)}`, { params: { page, limit } })
  return unwrap<{ items: any[]; page: number; limit: number; total: number; averageRating: number; breakdown: Record<string, number>; hasNextPage: boolean }>(response.data)
}

export async function createProductReview(payload: { productId: string; orderId: string; rating: number; title: string; comment: string }) {
  const response = await AxiosInstance.post(endPoints.reviews.create, payload)
  return unwrap<any>(response.data)
}

export async function fetchOrder(orderId: string) {
  const response = await AxiosInstance.get(`${endPoints.orders.list}/${orderId}`)
  return unwrap<any>(response.data)
}

export async function fetchOrderInvoice(orderId: string) {
  const response = await AxiosInstance.get(`${endPoints.orders.list}/${encodeURIComponent(orderId)}/invoice`)
  return unwrap<any>(response.data)
}

export async function downloadOrderInvoice(invoiceId: string) {
  const response = await AxiosInstance.post(`/invoices/${encodeURIComponent(invoiceId)}/download`)
  return unwrap<{ invoiceNumber: string; downloadUrl?: string; storageUrl?: string }>(response.data)
}

const invoiceDownloadRequests = new Map<string, Promise<{ invoiceNumber: string; downloadUrl: string }>>()
const invoicePollIntervalMs = 2500
const invoicePollAttempts = 6

const waitForInvoice = () => new Promise((resolve) => window.setTimeout(resolve, invoicePollIntervalMs))

export async function downloadOrderInvoicePdf(orderId: string) {
  const existingRequest = invoiceDownloadRequests.get(orderId)
  if (existingRequest) return existingRequest

  const request = (async () => {
    for (let attempt = 0; attempt < invoicePollAttempts; attempt += 1) {
      try {
        const response = await AxiosInstance.get(`/invoices/order/${encodeURIComponent(orderId)}/download`)
        return unwrap<{ invoiceNumber: string; downloadUrl: string }>(response.data)
      } catch (error: any) {
        if (error?.response?.status !== 425 || attempt === invoicePollAttempts - 1) throw error
        await waitForInvoice()
      }
    }
    throw new Error('Invoice download polling ended unexpectedly')
  })()

  invoiceDownloadRequests.set(orderId, request)
  try {
    return await request
  } finally {
    invoiceDownloadRequests.delete(orderId)
  }
}

export async function cancelOrder(orderId: string) {
  const response = await AxiosInstance.post(`${endPoints.orders.list}/${orderId}/cancel`)
  return unwrap<any>(response.data)
}

export async function createCancellationRequest(orderId: string, payload: { variantId: string; quantity?: number; reason: string; customerNote?: string }) {
  const response = await AxiosInstance.post(`${endPoints.orders.list}/${orderId}/cancellation-requests`, payload)
  return unwrap<any>(response.data)
}

export async function fetchOrderCancellationRequests(orderId: string) {
  const response = await AxiosInstance.get(`${endPoints.orders.list}/${orderId}/cancellation-requests`)
  return unwrap<any[]>(response.data)
}

export async function previewCheckout(payload: Record<string, any> = {}) {
  const response = await AxiosInstance.post(endPoints.checkout.preview, payload)
  return unwrap<any>(response.data)
}

export async function createOrder(payload: {
  shippingAddressId?: string
  shippingAddress?: Record<string, any>
  paymentMethod: string
  couponCode?: string
  idempotencyKey?: string
}) {
  const response = await AxiosInstance.post(endPoints.checkout.placeOrder, payload)
  return unwrap<any>(response.data)
}

export async function fetchPaymentConfig() {
  const response = await AxiosInstance.get(endPoints.payments.config)
  return unwrap<{ razorpayEnabled: boolean; mockEnabled: boolean; publicKey: string | null }>(response.data)
}

export async function confirmPayment(payload: {
  orderId: string
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}) {
  const response = await AxiosInstance.post(endPoints.payments.verify, payload)
  return unwrap<any>(response.data)
}

export async function fetchCategories() {
  const response = await AxiosInstance.get(endPoints.categories.list)
  const payload = response.data?.data ?? response.data ?? []
  return Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : []
}

export async function fetchBrands() {
  const response = await AxiosInstance.get(endPoints.brands.list)
  const payload = response.data?.data ?? response.data ?? []
  return Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : []
}
