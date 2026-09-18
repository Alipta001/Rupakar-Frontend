'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { AuthShell } from '@/components/auth-shell'
import { Button } from '@/components/ui/button'
import { resetPassword } from '@/lib/customer-api'

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!password || !confirmPassword) {
      setError('Both password fields are required')
      toast({ title: 'Incomplete form', description: 'Please fill both password fields.' })
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      toast({ title: 'Weak password', description: 'Use at least eight characters.' })
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      toast({ title: 'Mismatch', description: 'Confirm the same password.' })
      return
    }

    if (!email || !/^\d{4,8}$/.test(otp)) {
      setError('Enter the reset code sent to your email')
      return
    }

    setLoading(true)
    try {
      await resetPassword({ email, otp, newPassword: password })
      toast({ title: 'Password updated', description: 'Your account is now protected with a new password.' })
      router.push('/login')
    } catch (resetError: any) {
      setError(resetError?.response?.data?.error?.message ?? resetError?.message ?? 'Unable to reset password')
      toast({ title: 'Password reset failed', description: 'The code may be invalid or expired.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      eyebrow="New credentials"
      title="Choose a stronger password"
      description="Create a fresh secure password for your account. This helps keep your artisan discoveries and personal details safe."
      imageSrc="/images/hero-artisan.jpg"
      imageAlt="Warm terracotta artwork"
    >
      <div className="space-y-7">
        <div>
          <span className="block text-[10px] uppercase tracking-[0.35em] text-[#C89B3C] font-sans mb-3">
            Reset credentials
          </span>
          <h1 className="text-3xl font-[var(--font-cormorant)] tracking-[-0.03em] text-[#1E1A17] mb-3">
            Secure your account again
          </h1>
          <p className="text-sm leading-7 text-[#5B4B3F]">
            {email ? 'Enter the reset code from your inbox to complete the reset process.' : 'Request a new reset code from the forgot password page.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[#1E1A17] font-sans text-[10px] tracking-[0.2em] uppercase mb-2">Reset code</label>
            <input
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 8))}
              placeholder="123456"
              className="w-full rounded-[1.25rem] border border-[#D4C4B0] bg-white/90 px-4 py-4 text-sm font-sans text-[#1E1A17] transition focus:border-[#C89B3C] focus:outline-none focus:ring-2 focus:ring-[#C89B3C]/20"
            />
          </div>
          <div>
            <label className="block text-[#1E1A17] font-sans text-[10px] tracking-[0.2em] uppercase mb-2">
              New password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="w-full rounded-[1.25rem] border border-[#D4C4B0] bg-white/90 px-4 py-4 text-sm font-sans text-[#1E1A17] transition focus:border-[#C89B3C] focus:outline-none focus:ring-2 focus:ring-[#C89B3C]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5B4B3F] hover:text-[#C89B3C]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[#1E1A17] font-sans text-[10px] tracking-[0.2em] uppercase mb-2">
              Confirm password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="••••••••"
                className="w-full rounded-[1.25rem] border border-[#D4C4B0] bg-white/90 px-4 py-4 text-sm font-sans text-[#1E1A17] transition focus:border-[#C89B3C] focus:outline-none focus:ring-2 focus:ring-[#C89B3C]/20"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5B4B3F] hover:text-[#C89B3C]"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error ? <p className="text-sm text-[#7A1F1F]">{error}</p> : null}

          <Button
            type="submit"
            className="w-full px-10 py-4 text-sm tracking-[0.18em] uppercase"
            disabled={loading}
          >
            {loading ? 'Updating…' : 'Update password'}
          </Button>
        </form>

        <div className="border-t border-[#D4C4B0]/60 pt-6">
          <p className="text-sm text-[#5B4B3F] font-sans leading-7">
            Remembered your password?{' '}
            <Link href="/login" className="text-[#C89B3C] hover:underline">
              Sign in now
            </Link>
          </p>
        </div>
      </div>
    </AuthShell>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F4EE]" />}>
      <ResetPasswordContent />
    </Suspense>
  )
}
