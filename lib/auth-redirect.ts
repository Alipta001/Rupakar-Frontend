export const getSafeReturnTo = (value: string | null | undefined, fallback = '/account') => {
  if (!value) return fallback
  try {
    const decoded = decodeURIComponent(value)
    if (decoded.startsWith('/') && !decoded.startsWith('//')) return decoded
  } catch {
    return fallback
  }
  return fallback
}

export const getCurrentReturnTo = () => {
  if (typeof window === 'undefined') return '/account'
  return `${window.location.pathname}${window.location.search}${window.location.hash}`
}

export const loginPathForCurrentLocation = () => `/login?returnTo=${encodeURIComponent(getCurrentReturnTo())}`
