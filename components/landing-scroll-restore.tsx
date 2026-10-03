'use client'

import { useEffect } from 'react'

export function LandingScrollRestore() {
  useEffect(() => {
    // 1. Check if a hash is present in the current URL
    const hash = window.location.hash
    if (hash) {
      const targetId = hash.replace('#', '')
      const el = document.getElementById(targetId)
      if (el) {
        const timer = setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 120)
        return () => clearTimeout(timer)
      }
    }

    // 2. Check if a previous landing-page scroll position was saved
    try {
      const saved = sessionStorage.getItem('rupakar_landing_scroll')
      if (saved) {
        const parsed = JSON.parse(saved)
        sessionStorage.removeItem('rupakar_landing_scroll')

        if (parsed.path === '/' && typeof parsed.y === 'number' && parsed.y > 0) {
          if (parsed.hash) {
            const el = document.getElementById(parsed.hash.replace('#', ''))
            if (el) {
              const timer = setTimeout(() => {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }, 120)
              return () => clearTimeout(timer)
            }
          }
          const timer = setTimeout(() => {
            window.scrollTo({ top: parsed.y, behavior: 'smooth' })
          }, 120)
          return () => clearTimeout(timer)
        }
      }
    } catch {
      // Ignore errors
    }
  }, [])

  return null
}
