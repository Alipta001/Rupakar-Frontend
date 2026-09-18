'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import { AuthShell } from '@/components/auth-shell'
import { Button } from '@/components/ui/button'
import { requestPasswordReset } from '@/lib/customer-api'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Email is required')
      toast({ title: 'Missing email', description: 'Please enter the address linked to your account.' })
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Use a valid email address')
      toast({ title: 'Invalid email', description: 'Please enter a valid email address.' })
      return
    }

    setLoading(true)
    try {
      await requestPasswordReset(email.trim())
      toast({ title: 'Reset code sent', description: 'Check your email for the password reset code.' })
      router.push(`/reset-password?email=${encodeURIComponent(email.trim())}`)
    } catch (requestError: any) {
      setError(requestError?.response?.data?.error?.message ?? requestError?.message ?? 'Unable to send reset code')
      toast({ title: 'Could not send reset code', description: 'Please check the email and try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Restore access with ease"
      description="Share your email and we’ll send a secure reset link so you can return to your handcrafted journey without interruption."
      imageSrc="/images/hero-pottery.jpg"
      imageAlt="Pottery studio scene"
    >
      <div className="space-y-7">
        <div>
          <span className="block text-[10px] uppercase tracking-[0.35em] text-[#C89B3C] font-sans mb-3">
            Forgot password
          </span>
          <h1 className="text-3xl font-[var(--font-cormorant)] tracking-[-0.03em] text-[#1E1A17] mb-3">
            Reset your password
          </h1>
          <p className="text-sm leading-7 text-[#5B4B3F]">
            Enter the email address used for your account. We’ll send a secure link so you can create a fresh password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[#1E1A17] font-sans text-[10px] tracking-[0.2em] uppercase mb-2">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="hello@yourdomain.com"
              className={`w-full rounded-[1.25rem] border px-4 py-4 text-sm font-sans text-[#1E1A17] transition focus:border-[#C89B3C] focus:outline-none focus:ring-2 focus:ring-[#C89B3C]/20 ${
                error ? 'border-[#7A1F1F]' : 'border-[#D4C4B0]'
              } bg-white/90`}
            />
            {error ? <p className="mt-3 text-sm text-[#7A1F1F]">{error}</p> : null}
          </div>

          <Button
            type="submit"
            className="w-full px-10 py-4 text-sm tracking-[0.18em] uppercase"
            disabled={loading}
          >
            {loading ? 'Sending…' : 'Send reset link'}
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
