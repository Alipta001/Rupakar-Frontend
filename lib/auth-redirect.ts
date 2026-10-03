export const getSafeReturnTo = (value: string | null | undefined, fallback = '/account') => {
  if (!value) return fallback
  try {
    const decoded = decodeURIComponent(value)
    if (decoded.startsWith('/') && !decoded.startsWith('//')) {
      const purePath = decoded.split('?')[0].split('#')[0]
      const authPaths = ['/login', '/register', '/verify-otp', '/reset-password', '/forgot-password']
      if (authPaths.includes(purePath)) {
        return fallback
      }
      return decoded
    }
  } catch {
    return fallback
  }
  return fallback
}

export const getCurrentReturnTo = () => {
  if (typeof window === 'undefined') return '/account'

  let hash = window.location.hash

  // If on landing page and no hash is set, detect which section is currently in view
  if (!hash && window.location.pathname === '/') {
    const sectionIds = [
      'newsletter',
      'instagram-gallery',
      'testimonials',
      'heritage-section',
      'shop-by-category',
      'best-sellers',
      'artisan-story',
      'terracotta-showcase',
      'featured-collections',
    ]

    const scrollY = window.scrollY
    if (scrollY > 100) {
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= 80) {
            hash = `#${id}`
            break
          }
        }
      }
    }
  }

  // Preserve scroll state in sessionStorage for exact pixel restoration if needed
  try {
    sessionStorage.setItem('rupakar_landing_scroll', JSON.stringify({
      path: window.location.pathname,
      y: window.scrollY,
      hash: hash || window.location.hash,
    }))
  } catch {
    // Ignore storage issues
  }

  return `${window.location.pathname}${window.location.search}${hash}`
}

export const loginPathForCurrentLocation = () => `/login?returnTo=${encodeURIComponent(getCurrentReturnTo())}`
