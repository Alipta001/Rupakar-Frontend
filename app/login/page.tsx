'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import { AuthShell } from '@/components/auth-shell'
import { authLogin, setAuth, AUTH_USER_STORAGE_KEY } from '@/redux/slice/authSlice/authSlice'
import { syncGuestWishlistToServer, mergeGuestCart } from '@/lib/customer-api'
import { getSafeReturnTo } from '@/lib/auth-redirect'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState(() => {
    if (typeof window === 'undefined') return ''
    return new URLSearchParams(window.location.search).get('reason') === 'bag'
      ? 'Please sign in to add items to your bag.'
      : ''
  })
  const dispatch = useDispatch<any>()
  const queryClient = useQueryClient()
  const { loading } = useSelector((state: any) => state.auth)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await dispatch(authLogin({ email, password })).unwrap()

      // Normalize possible response shapes and update the client store immediately
      const payload = (result as any) || {}
      const nested = payload.data || {}
      const token = payload.accessToken ?? payload.token ?? nested.accessToken ?? nested.token ?? null
      const user = payload.user ?? nested.user ?? null

      if (token || user) {
        const normalizedUser = user
          ? {
              ...user,
              name: user.name ?? ([user.firstName, user.lastName].filter(Boolean).join(' ') || user.email),
            }
          : null

        dispatch(setAuth({ token, user: normalizedUser, isAuthenticated: Boolean(token || normalizedUser) }))

        if (typeof window !== 'undefined' && normalizedUser) {
          window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(normalizedUser))
        }

        // Merge guest cart and guest wishlist into user account
        try {
          await mergeGuestCart()
          await syncGuestWishlistToServer()
        } catch {
          // Merge handled best-effort on client and server
        }

        queryClient.invalidateQueries({ queryKey: ['cart'] })
        queryClient.invalidateQueries({ queryKey: ['wishlist'] })
        queryClient.invalidateQueries({ queryKey: ['orders'] })
      }

      const returnTo = typeof window !== 'undefined' ? getSafeReturnTo(new URLSearchParams(window.location.search).get('returnTo')) : '/account'
      router.push(returnTo)
    } catch (error: any) {
      const msg = error?.message || (typeof error === 'string' ? error : 'Invalid email or password. Please try again.')
      setErrorMessage(msg)
    }
  }

  return (
    <AuthShell
      eyebrow="Welcome Back"
      title="Sign In to Rupakar"
      description="Access your account to view orders, manage your profile, and explore your saved items. Join thousands of collectors who trust Rupakar."
      imageSrc="/images/register.jpeg"
      imageAlt="Terracotta pottery collection"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMessage && (
          <div className="p-3.5 bg-[#7A1F1F]/10 border border-[#7A1F1F]/30 text-[#7A1F1F] rounded-lg text-xs font-sans">
            {errorMessage}
          </div>
        )}
        {/* Email Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <label className="block font-sans text-xs tracking-[0.1em] uppercase text-[#1E1A17] mb-3">
            Email Address
          </label>
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C89B3C]/50"
              strokeWidth={1.5}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full pl-12 pr-4 py-3 border border-[#D4C4B0] rounded-lg bg-white/50 font-sans text-sm focus:outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all placeholder:text-[#5B4B3F]/40"
            />
          </div>
        </motion.div>

        {/* Password Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <label className="block font-sans text-xs tracking-[0.1em] uppercase text-[#1E1A17] mb-3">
            Password
          </label>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C89B3C]/50"
              strokeWidth={1.5}
            />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full pl-12 pr-12 py-3 border border-[#D4C4B0] rounded-lg bg-white/50 font-sans text-sm focus:outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all placeholder:text-[#5B4B3F]/40"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C89B3C]/50 hover:text-[#C89B3C] transition-colors"
            >
              {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
            </motion.button>
          </div>
        </motion.div>

        {/* Remember Me & Forgot Password */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-between"
        >
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-[#D4C4B0] text-[#C89B3C] focus:ring-[#C89B3C]/20"
            />
            <span className="font-sans text-xs text-[#5B4B3F]">Remember me</span>
          </label>
          <a href="/forgot-password" className="font-sans text-xs text-[#C89B3C] hover:text-[#B7792B] transition-colors">
            Forgot password?
          </a>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#C89B3C] to-[#B7792B] hover:from-[#B7792B] hover:to-[#A66B25] text-white rounded-lg font-sans text-sm font-medium tracking-[0.1em] uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#C89B3C]/20"
        >
          {loading ? 'Signing in...' : <>Sign In <ArrowRight size={16} strokeWidth={2} /></>}
        </motion.button>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative py-4"
        >
          <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#D4C4B0] to-transparent" />
          <div className="relative flex justify-center">
            <span className="px-3 bg-white/85 text-xs font-sans text-[#5B4B3F]">OR</span>
          </div>
        </motion.div>

        {/* New Customer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-center"
        >
          <p className="font-sans text-sm text-[#5B4B3F] mb-4">
            New to Rupakar?
          </p>
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="/register"
            className="inline-block px-6 py-3 border-2 border-[#C89B3C] hover:bg-[#C89B3C] text-[#C89B3C] hover:text-white rounded-lg font-sans text-sm font-medium tracking-[0.1em] uppercase transition-all"
          >
            Create an Account
          </motion.a>
        </motion.div>
      </form>
    </AuthShell>
  )
}
