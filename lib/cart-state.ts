export function getCartVariantId(item: any) {
  return String(item?.variantId ?? '')
}

export function hasCartVariant(cart: any, variantId: string) {
  if (!variantId || !Array.isArray(cart?.items)) return false
  return cart.items.some((item: any) => getCartVariantId(item) === variantId)
}

export function getProductVariantId(product: any) {
  return String(product?.variantId ?? product?.variants?.[0]?._id ?? '')
}
