export interface GuestWishlistItem {
  id: string
  productId: string
  variantId?: string
  name: string
  price: number
  image: string
  artisan?: string
}

const GUEST_WISHLIST_KEY = 'rupakar_guest_wishlist'

export function getGuestWishlist(): GuestWishlistItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(GUEST_WISHLIST_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function addToGuestWishlist(item: {
  id?: string
  productId?: string
  variantId?: string
  name?: string
  price?: number
  image?: string
  artisan?: string
}): GuestWishlistItem[] {
  if (typeof window === 'undefined') return []
  const items = getGuestWishlist()
  const productId = String(item.productId || item.id || '')
  if (!productId) return items

  const exists = items.some((i) => String(i.productId || i.id) === productId)
  if (!exists) {
    const newItem: GuestWishlistItem = {
      id: productId,
      productId,
      variantId: item.variantId ? String(item.variantId) : productId,
      name: item.name || 'Handcrafted Piece',
      price: Number(item.price || 0),
      image: item.image || '/images/product-vase.jpg',
      artisan: item.artisan || 'Rupakar Artisan',
    }
    const updated = [...items, newItem]
    try {
      window.localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(updated))
    } catch {}
    return updated
  }
  return items
}

export function removeFromGuestWishlist(productId: string): GuestWishlistItem[] {
  if (typeof window === 'undefined') return []
  const items = getGuestWishlist()
  const targetId = String(productId)
  const updated = items.filter((i) => String(i.productId || i.id) !== targetId)
  try {
    window.localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(updated))
  } catch {}
  return updated
}

export function isInGuestWishlist(productId: string): boolean {
  if (typeof window === 'undefined') return false
  const items = getGuestWishlist()
  const targetId = String(productId)
  return items.some((i) => String(i.productId || i.id) === targetId)
}

export function clearGuestWishlist(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(GUEST_WISHLIST_KEY)
  } catch {}
}
