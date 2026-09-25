'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, ShieldCheck, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from '@/hooks/use-toast'
import { AuthShell } from '@/components/auth-shell'
import { Button } from '@/components/ui/button'
import { verifyRegisterOtp, resendVerificationOtp, clearAuthStatus } from '@/redux/slice/authSlice/authSlice'
import { getSafeReturnTo } from '@/lib/auth-redirect'

const OTP_LENGTH = 6
const STORAGE_KEY = 'temp_verification_email'
const INITIAL_EXPIRATION_SECONDS = 300 // 5 minutes
const INITIAL_COOLDOWN_SECONDS = 60 // 60 seconds

export default function VerifyOtpPage() {
  const router = useRouter()
  const dispatch = useDispatch<any>()

  const [email, setEmail] = useState('')
  const [code, setCode] = useState(Array(OTP_LENGTH).fill(''))
  const [localError, setLocalError] = useState('')
  const [statusNotice, setStatusNotice] = useState<{ type: 'info' | 'success' | 'error'; text: string } | null>(null)
  const [expirationTimer, setExpirationTimer] = useState(INITIAL_EXPIRATION_SECONDS)
  const [cooldownTimer, setCooldownTimer] = useState(INITIAL_COOLDOWN_SECONDS)
  const [isResending, setIsResending] = useState(false)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const { loading, error: reduxError } = useSelector((state: any) => state.auth)

  // Initialize and load saved registration email
  useEffect(() => {
    dispatch(clearAuthStatus())
    inputRefs.current[0]?.focus()

    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem(STORAGE_KEY)
      if (savedEmail) {
        setEmail(savedEmail)
      } else {
        setLocalError('No email session found. Please sign up or sign in.')
      }
    }
  }, [dispatch])

  // Expiration timer (5-minute countdown)
  useEffect(() => {
    if (expirationTimer <= 0) return undefined
    const interval = window.setInterval(() => {
      setExpirationTimer((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => window.clearInterval(interval)
  }, [expirationTimer])

  // Resend cooldown timer
  useEffect(() => {
    if (cooldownTimer <= 0) return undefined
    const interval = window.setInterval(() => {
      setCooldownTimer((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => window.clearInterval(interval)
  }, [cooldownTimer])

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const updateCode = (index: number, value: string) => {
    const nextValue = value.replace(/\D/g, '').slice(-1)
    const nextCode = [...code]
    nextCode[index] = nextValue
    setCode(nextCode)

    if (nextValue && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    const nextCode = Array.from({ length: OTP_LENGTH }, (_, index) => pasted[index] ?? '')
    setCode(nextCode)
    const nextFocus = Math.min(pasted.length, OTP_LENGTH - 1)
    inputRefs.current[nextFocus]?.focus()
  }

  const resetInputsAndTimers = () => {
    setCode(Array(OTP_LENGTH).fill(''))
    setExpirationTimer(INITIAL_EXPIRATION_SECONDS)
    setCooldownTimer(INITIAL_COOLDOWN_SECONDS)
    inputRefs.current[0]?.focus()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLocalError('')
    setStatusNotice(null)
    dispatch(clearAuthStatus())

    const cleanEmail = email.trim()

    if (!cleanEmail) {
      setLocalError('No valid email session identified. Return to sign up.')
      return
    }

    if (code.some((digit) => digit.length === 0)) {
      setLocalError('Enter the full 6-digit verification code.')
      toast({ title: 'Incomplete code', description: 'Please enter all six digits.' })
      return
    }

    const otpPayload = code.join('')

    try {
      await dispatch(verifyRegisterOtp({ email: cleanEmail, otp: otpPayload })).unwrap()

      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY)
      }

      toast({ title: 'Verified Successfully', description: 'Your email is confirmed. Welcome to Rupakar!' })
      const returnTo = typeof window !== 'undefined' ? getSafeReturnTo(new URLSearchParams(window.location.search).get('returnTo')) : '/account'
      router.push(`/login?returnTo=${encodeURIComponent(returnTo)}`)
    } catch (err: any) {
      const errorMsg = String(err?.message || err || '')
      const isExpiredNotice =
        errorMsg.includes('previous OTP has expired') ||
        errorMsg.includes('A new OTP has been sent') ||
        errorMsg.includes('OTP_EXPIRED') ||
        errorMsg.toLowerCase().includes('expired')

      if (isExpiredNotice) {
        const exactMsg = 'Your previous OTP has expired. A new OTP has been sent to your email.'
        setStatusNotice({ type: 'info', text: exactMsg })
        setLocalError('')
        resetInputsAndTimers()
        toast({ title: 'OTP Expired', description: exactMsg })
      } else {
        setLocalError(errorMsg || 'The verification code provided is incorrect.')
        toast({ title: 'Verification failed', description: errorMsg || 'Invalid code entry.', variant: 'destructive' })
      }
    }
  }

  const handleResend = async () => {
    if (cooldownTimer > 0 || isResending) return
    setLocalError('')
    setStatusNotice(null)
    dispatch(clearAuthStatus())

    const cleanEmail = email.trim()

    if (!cleanEmail) {
      setLocalError('Cannot request a code without a valid email session.')
      return
    }

    setIsResending(true)
    try {
      await dispatch(resendVerificationOtp({ email: cleanEmail })).unwrap()
      resetInputsAndTimers()
      setStatusNotice({ type: 'success', text: 'A fresh verification code has been sent to your email.' })
      toast({ title: 'Code Sent', description: 'A fresh verification code is on its way to your inbox.' })
    } catch (err: any) {
      const errorMsg = String(err?.message || err || 'Failed to resend code. Please try again.')
      setStatusNotice({ type: 'error', text: errorMsg })
      toast({
        title: 'Resend failed',
        description: errorMsg,
        variant: 'destructive',
      })
    } finally {
      setIsResending(false)
    }
  }

  const activeError = localError || reduxError
  const isCodeExpired = expirationTimer === 0

  return (
    <AuthShell
      eyebrow="Secure Verification"
      title="A final touch to your artisan experience"
      description="Enter the one-time code sent to your inbox. This step keeps your account protected and your purchase journey seamless."
      imageSrc="/images/hero-artisan.jpg"
      imageAlt="Artisan working with clay"
    >
      <div className="space-y-7">
        <div>
          <span className="block text-[10px] uppercase tracking-[0.35em] text-[#C89B3C] font-sans mb-3">
            One-time passcode
          </span>
          <h1 className="text-3xl font-[var(--font-cormorant)] tracking-[-0.03em] text-[#1E1A17] mb-3">
            Verify your email
          </h1>
          <p className="text-sm leading-7 text-[#5B4B3F]">
            We sent a verification code to <span className="font-medium text-[#1E1A17]">{email || 'your email'}</span>. Use it below to complete your registration.
          </p>
        </div>

        {statusNotice && (
          <div
            className={`p-4 rounded-lg flex items-start gap-3 text-sm font-sans ${
              statusNotice.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : statusNotice.type === 'error'
                ? 'bg-rose-50 text-rose-900 border border-rose-200'
                : 'bg-amber-50 text-amber-900 border border-amber-200'
            }`}
          >
            {statusNotice.type === 'success' ? (
              <CheckCircle2 size={18} className="text-emerald-600 mt-0.5 shrink-0" />
            ) : statusNotice.type === 'error' ? (
              <AlertCircle size={18} className="text-rose-600 mt-0.5 shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-amber-600 mt-0.5 shrink-0" />
            )}
            <p className="leading-relaxed font-medium">{statusNotice.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs uppercase tracking-wider text-[#5B4B3F] font-sans">
                6-Digit Verification Code
              </label>
              <span
                className={`text-xs font-mono font-medium ${
                  isCodeExpired ? 'text-[#7A1F1F]' : 'text-[#6B3E26]'
                }`}
              >
                {isCodeExpired ? 'Expired' : `Expires in ${formatTimer(expirationTimer)}`}
              </span>
            </div>
            <div className="grid grid-cols-6 gap-3 justify-center">
              {code.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  disabled={!email || loading}
                  ref={(element) => {
                    inputRefs.current[index] = element
                  }}
                  onChange={(event) => updateCode(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  onPaste={handlePaste}
                  className={`auth-pin text-center font-mono text-lg ${
                    isCodeExpired ? 'border-[#7A1F1F] bg-rose-50/50' : ''
                  }`}
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {activeError && (
            <p className="text-sm text-[#7A1F1F] font-sans flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{activeError}</span>
            </p>
          )}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="submit"
              className="w-full sm:w-auto px-10 py-4 text-sm tracking-[0.18em] uppercase"
              disabled={loading || !email}
            >
              {loading ? 'Verifying…' : 'Verify Code'}
            </Button>
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldownTimer > 0 || !email || isResending}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D4C4B0] bg-[#F8F4EE] px-6 py-3 text-xs uppercase tracking-[0.22em] text-[#6B3E26] transition-colors duration-300 hover:border-[#C89B3C] hover:text-[#C89B3C] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isResending ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  Sending…
                </>
              ) : cooldownTimer > 0 ? (
                `Resend in ${cooldownTimer}s`
              ) : (
                'Resend code'
              )}
            </button>
          </div>

          <div className="flex items-center gap-3 pt-4 text-sm text-[#5B4B3F] font-sans">
            <ShieldCheck size={16} className="text-[#C89B3C]" />
            <span>Code protection is active. OTPs are securely hashed and expire after 5 minutes.</span>
          </div>
        </form>

        <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#D4C4B0]/70 pt-6">
          <Link href="/login" className="text-[#6B3E26] font-sans text-xs uppercase tracking-[0.2em] hover:text-[#C89B3C]">
            Return to sign in
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-[#1E1A17] text-xs uppercase tracking-[0.2em] hover:text-[#C89B3C]"
          >
            Change email
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </AuthShell>
  )
}