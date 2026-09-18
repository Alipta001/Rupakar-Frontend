import { AxiosInstance } from '@/api/axios/axios'
import { endPoints } from '@/api/endPoints/endPoints'

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

export async function fetchWishlist() {
  try {
    const response = await AxiosInstance.get(endPoints.wishlist.list)
    return unwrap<{ userId?: string; items?: any[] }>(response.data)
  } catch {
    return { items: [] }
  }
}

export async function addWishlistItem(productId: string) {
  const response = await AxiosInstance.post(`${endPoints.wishlist.list}/${productId}`)
  return unwrap<any>(response.data)
}

export async function removeWishlistItem(productId: string) {
  const response = await AxiosInstance.delete(`${endPoints.wishlist.list}/${productId}`)
  return unwrap<any>(response.data)
}

export async function fetchCart() {
  const response = await AxiosInstance.get(endPoints.cart.list)
  return unwrap<any>(response.data)
}

export async function addCartItem(payload: { productId: string; variantId: string; quantity: number }) {
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

export async function fetchOrders() {
  const response = await AxiosInstance.get(endPoints.orders.list)
  const payload = unwrap<any>(response.data)
  return Array.isArray(payload) ? payload : payload?.items ?? []
}

export async function fetchOrder(orderId: string) {
  const response = await AxiosInstance.get(`${endPoints.orders.list}/${orderId}`)
  return unwrap<any>(response.data)
}

export async function cancelOrder(orderId: string) {
  const response = await AxiosInstance.post(`${endPoints.orders.list}/${orderId}/cancel`)
  return unwrap<any>(response.data)
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

export async function simulateMockPayment(payload: { orderId: string; outcome: 'success' | 'failure' | 'cancel' }) {
  const response = await AxiosInstance.post('/payments/mock/simulate', payload)
  return unwrap<any>(response.data)
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
