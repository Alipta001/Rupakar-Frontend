// 'use client'

// import { useEffect, useRef, useState } from 'react'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { motion } from 'framer-motion'
// import { ArrowRight, ShieldCheck } from 'lucide-react'
// import { toast } from '@/hooks/use-toast'
// import { AuthShell } from '@/components/auth-shell'
// import { Button } from '@/components/ui/button'

// const OTP_LENGTH = 6

// export default function VerifyOtpPage() {
//   const router = useRouter()
//   const [code, setCode] = useState(Array(OTP_LENGTH).fill(''))
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const [resendTimer, setResendTimer] = useState(30)
//   const inputRefs = useRef<Array<HTMLInputElement | null>>([])

//   useEffect(() => {
//     inputRefs.current[0]?.focus()
//   }, [])

//   useEffect(() => {
//     if (resendTimer <= 0) return undefined
//     const timer = window.setTimeout(() => setResendTimer((value) => value - 1), 1000)
//     return () => window.clearTimeout(timer)
//   }, [resendTimer])

//   const updateCode = (index: number, value: string) => {
//     const nextValue = value.replace(/\D/g, '').slice(-1)
//     const nextCode = [...code]
//     nextCode[index] = nextValue
//     setCode(nextCode)

//     if (nextValue && index < OTP_LENGTH - 1) {
//       inputRefs.current[index + 1]?.focus()
//     }
//   }

//   const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === 'Backspace' && !code[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus()
//     }
//   }

//   const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
//     event.preventDefault()
//     const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
//     if (!pasted) return
//     const nextCode = Array.from({ length: OTP_LENGTH }, (_, index) => pasted[index] ?? '')
//     setCode(nextCode)
//     const nextFocus = Math.min(pasted.length, OTP_LENGTH - 1)
//     inputRefs.current[nextFocus]?.focus()
//   }

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault()
//     setError('')

//     if (code.some((digit) => digit.length === 0)) {
//       setError('Enter the full 6-digit verification code.')
//       toast({ title: 'Invalid code', description: 'Please complete all six digits.' })
//       return
//     }

//     setLoading(true)
//     await new Promise((resolve) => window.setTimeout(resolve, 900))
//     setLoading(false)
//     toast({ title: 'Verified', description: 'Your email is now confirmed.' })
//     router.push('/email-verification-success')
//   }

//   const handleResend = () => {
//     if (resendTimer > 0) return
//     setResendTimer(60)
//     toast({ title: 'Code resent', description: 'A fresh verification code is on its way.' })
//   }

//   return (
//     <AuthShell
//       eyebrow="Secure Verification"
//       title="A final touch to your artisan experience"
//       description="Enter the one-time code sent to your inbox. This step keeps your account protected and your purchase journey seamless."
//       imageSrc="/images/hero-artisan.jpg"
//       imageAlt="Artisan working with clay"
//     >
//       <div className="space-y-7">
//         <div>
//           <span className="block text-[10px] uppercase tracking-[0.35em] text-[#C89B3C] font-sans mb-3">
//             One-time passcode
//           </span>
//           <h1 className="text-3xl font-[var(--font-cormorant)] tracking-[-0.03em] text-[#1E1A17] mb-3">
//             Verify your email
//           </h1>
//           <p className="text-sm leading-7 text-[#5B4B3F]">
//             We sent a premium verification code to your inbox. Use it to complete access and continue exploring handcrafted treasures.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-6 gap-3 justify-center">
//             {code.map((digit, index) => (
//               <input
//                 key={index}
//                 type="text"
//                 inputMode="numeric"
//                 maxLength={1}
//                 value={digit}
//                 ref={(element) => {
//                   inputRefs.current[index] = element
//                 }}
//                 onChange={(event) => updateCode(index, event.target.value)}
//                 onKeyDown={(event) => handleKeyDown(index, event)}
//                 onPaste={handlePaste}
//                 className="auth-pin"
//                 aria-label={`Digit ${index + 1}`}
//               />
//             ))}
//           </div>

//           {error ? (
//             <p className="text-sm text-[#7A1F1F] font-sans">{error}</p>
//           ) : (
//             <p className="text-sm text-[#5B4B3F] font-sans">The code expires in {resendTimer > 0 ? `${resendTimer}s` : 'a moment'}.</p>
//           )}

//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <Button
//               type="submit"
//               className="w-full sm:w-auto px-10 py-4 text-sm tracking-[0.18em] uppercase"
//               disabled={loading}
//             >
//               {loading ? 'Verifying…' : 'Verify Code'}
//             </Button>
//             <button
//               type="button"
//               onClick={handleResend}
//               disabled={resendTimer > 0}
//               className="inline-flex items-center justify-center rounded-full border border-[#D4C4B0] bg-[#F8F4EE] px-6 py-3 text-xs uppercase tracking-[0.22em] text-[#6B3E26] transition-colors duration-300 hover:border-[#C89B3C] hover:text-[#C89B3C] disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
//             </button>
//           </div>

//           <div className="flex items-center gap-3 pt-4 text-sm text-[#5B4B3F] font-sans">
//             <ShieldCheck size={16} className="text-[#C89B3C]" />
//             <span>Code protection is active for every sign-in attempt.</span>
//           </div>
//         </form>

//         <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#D4C4B0]/70 pt-6">
//           <Link href="/login" className="text-[#6B3E26] font-sans text-xs uppercase tracking-[0.2em] hover:text-[#C89B3C]">
//             Return to sign in
//           </Link>
//           <Link
//             href="/"
//             className="inline-flex items-center gap-2 text-[#1E1A17] text-xs uppercase tracking-[0.2em] hover:text-[#C89B3C]"
//           >
//             Skip verification
//             <ArrowRight size={14} />
//           </Link>
//         </div>
//       </div>
//     </AuthShell>
//   )
// }


// 'use client'

// import { useEffect, useRef, useState } from 'react'
// import Link from 'next/link'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { motion } from 'framer-motion'
// import { ArrowRight, ShieldCheck } from 'lucide-react'
// import { useSelector, useDispatch } from 'react-redux'
// import { toast } from '@/hooks/use-toast'
// import { AuthShell } from '@/components/auth-shell'
// import { Button } from '@/components/ui/button'
// import { verifyRegisterOtp, forgotPassword } from '@/redux/slice/authSlice/authSlice' // Adjust this path if your slice file is named differently

// const OTP_LENGTH = 6

// export default function VerifyOtpPage() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const dispatch = useDispatch<any>()
  
//   // Extract email address directly from URL parameters (e.g., /verify-otp?email=artisans@bengal.com)
//   const email = searchParams.get('email') || ''

//   const [code, setCode] = useState(Array(OTP_LENGTH).fill(''))
//   const [error, setError] = useState('')
//   const [resendTimer, setResendTimer] = useState(30)
//   const inputRefs = useRef<Array<HTMLInputElement | null>>([])

//   // Hook into central Redux state for loading configurations
//   const { loading } = useSelector((state: any) => state.auth)

//   useEffect(() => {
//     inputRefs.current[0]?.focus()
    
//     // Throw error feedback if the context email value cannot be found in the route parameters
//     if (!email) {
//       setError('Verification context lost. Missing email parameter in the URL.')
//     }
//   }, [email])

//   useEffect(() => {
//     if (resendTimer <= 0) return undefined
//     const timer = window.setTimeout(() => setResendTimer((value) => value - 1), 1000)
//     return () => window.clearTimeout(timer)
//   }, [resendTimer])

//   const updateCode = (index: number, value: string) => {
//     const nextValue = value.replace(/\D/g, '').slice(-1)
//     const nextCode = [...code]
//     nextCode[index] = nextValue
//     setCode(nextCode)

//     if (nextValue && index < OTP_LENGTH - 1) {
//       inputRefs.current[index + 1]?.focus()
//     }
//   }

//   const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === 'Backspace' && !code[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus()
//     }
//   }

//   const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
//     event.preventDefault()
//     const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
//     if (!pasted) return
//     const nextCode = Array.from({ length: OTP_LENGTH }, (_, index) => pasted[index] ?? '')
//     setCode(nextCode)
//     const nextFocus = Math.min(pasted.length, OTP_LENGTH - 1)
//     inputRefs.current[nextFocus]?.focus()
//   }

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault()
//     setError('')

//     if (!email) {
//       setError('Cannot verify code without a valid email reference.')
//       return
//     }

//     if (code.some((digit) => digit.length === 0)) {
//       setError('Enter the full 6-digit verification code.')
//       toast({ title: 'Invalid code', description: 'Please complete all six digits.' })
//       return
//     }

//     const otpPayload = code.join('')

//     try {
//       // Dispatches the payload directly through your asynchronous Redux Thunk action
//       await dispatch(verifyRegisterOtp({ email, otp: otpPayload })).unwrap()
      
//       toast({ title: 'Verified Successfully', description: 'Your email is now confirmed. Please sign in.' })
//       router.push('/login')
//     } catch (err: any) {
//       console.error('OTP Verification Failure:', err)
//       setError(err || 'The verification code provided is incorrect or has expired.')
//       toast({ title: 'Verification failed', description: err || 'Invalid code entry.', variant: 'destructive' })
//     }
//   }

//   const handleResend = async () => {
//     if (resendTimer > 0 || !email) return
    
//     try {
//       // Leverages the forgotPassword action to cleanly regenerate an OTP token to the mailbox
//       await dispatch(forgotPassword({ email })).unwrap()
      
//       setResendTimer(60)
//       toast({ title: 'Code resent', description: 'A fresh verification code is on its way.' })
//     } catch (err: any) {
//       console.error('OTP Resend Failure:', err)
//       toast({ 
//         title: 'Resend failed', 
//         description: err || 'Unable to request a new code. Please try again.',
//         variant: 'destructive'
//       })
//     }
//   }

//   return (
//     <AuthShell
//       eyebrow="Secure Verification"
//       title="A final touch to your artisan experience"
//       description="Enter the one-time code sent to your inbox. This step keeps your account protected and your purchase journey seamless."
//       imageSrc="/images/hero-artisan.jpg"
//       imageAlt="Artisan working with clay"
//     >
//       <div className="space-y-7">
//         <div>
//           <span className="block text-[10px] uppercase tracking-[0.35em] text-[#C89B3C] font-sans mb-3">
//             One-time passcode
//           </span>
//           <h1 className="text-3xl font-[var(--font-cormorant)] tracking-[-0.03em] text-[#1E1A17] mb-3">
//             Verify your email
//           </h1>
//           <p className="text-sm leading-7 text-[#5B4B3F]">
//             We sent a premium verification code to <span className="font-medium text-[#1E1A17]">{email || 'your email'}</span>. Use it to complete access and continue exploring handcrafted treasures.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-6 gap-3 justify-center">
//             {code.map((digit, index) => (
//               <input
//                 key={index}
//                 type="text"
//                 inputMode="numeric"
//                 maxLength={1}
//                 value={digit}
//                 disabled={!email}
//                 ref={(element) => {
//                   inputRefs.current[index] = element
//                 }}
//                 onChange={(event) => updateCode(index, event.target.value)}
//                 onKeyDown={(event) => handleKeyDown(index, event)}
//                 onPaste={handlePaste}
//                 className="auth-pin"
//                 aria-label={`Digit ${index + 1}`}
//               />
//             ))}
//           </div>

//           {error ? (
//             <p className="text-sm text-[#7A1F1F] font-sans">{error}</p>
//           ) : (
//             <p className="text-sm text-[#5B4B3F] font-sans">The code expires in {resendTimer > 0 ? `${resendTimer}s` : 'a moment'}.</p>
//           )}

//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <Button
//               type="submit"
//               className="w-full sm:w-auto px-10 py-4 text-sm tracking-[0.18em] uppercase"
//               disabled={loading || !email}
//             >
//               {loading ? 'Verifying…' : 'Verify Code'}
//             </Button>
//             <button
//               type="button"
//               onClick={handleResend}
//               disabled={resendTimer > 0 || !email}
//               className="inline-flex items-center justify-center rounded-full border border-[#D4C4B0] bg-[#F8F4EE] px-6 py-3 text-xs uppercase tracking-[0.22em] text-[#6B3E26] transition-colors duration-300 hover:border-[#C89B3C] hover:text-[#C89B3C] disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
//             </button>
//           </div>

//           <div className="flex items-center gap-3 pt-4 text-sm text-[#5B4B3F] font-sans">
//             <ShieldCheck size={16} className="text-[#C89B3C]" />
//             <span>Code protection is active for every sign-in attempt.</span>
//           </div>
//         </form>

//         <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#D4C4B0]/70 pt-6">
//           <Link href="/login" className="text-[#6B3E26] font-sans text-xs uppercase tracking-[0.2em] hover:text-[#C89B3C]">
//             Return to sign in
//           </Link>
//           <Link
//             href="/"
//             className="inline-flex items-center gap-2 text-[#1E1A17] text-xs uppercase tracking-[0.2em] hover:text-[#C89B3C]"
//           >
//             Skip verification
//             <ArrowRight size={14} />
//           </Link>
//         </div>
//       </div>
//     </AuthShell>
//   )
// }



// 'use client'

// import { useEffect, useRef, useState } from 'react'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { motion } from 'framer-motion'
// import { ArrowRight, ShieldCheck, Mail } from 'lucide-react'
// import { useSelector, useDispatch } from 'react-redux'
// import { toast } from '@/hooks/use-toast'
// import { AuthShell } from '@/components/auth-shell'
// import { Button } from '@/components/ui/button'
// import { verifyRegisterOtp, forgotPassword, clearAuthStatus } from '@/redux/slice/authSlice/authSlice'

// const OTP_LENGTH = 6

// export default function VerifyOtpPage() {
//   const router = useRouter()
//   const dispatch = useDispatch<any>()
  
//   // State variables for manual user input and verification metrics
//   const [email, setEmail] = useState('')
//   const [code, setCode] = useState(Array(OTP_LENGTH).fill(''))
//   const [localError, setLocalError] = useState('')
//   const [resendTimer, setResendTimer] = useState(30)
//   const inputRefs = useRef<Array<HTMLInputElement | null>>([])

//   // Pull dynamic loading states directly from Redux slice
//   const { loading, error: reduxError } = useSelector((state: any) => state.auth)

//   // Clear global auth states on component initialization
//   useEffect(() => {
//     dispatch(clearAuthStatus())
//     inputRefs.current[0]?.focus()
//   }, [dispatch])

//   useEffect(() => {
//     if (resendTimer <= 0) return undefined
//     const timer = window.setTimeout(() => setResendTimer((value) => value - 1), 1000)
//     return () => window.clearTimeout(timer)
//   }, [resendTimer])

//   const updateCode = (index: number, value: string) => {
//     const nextValue = value.replace(/\D/g, '').slice(-1)
//     const nextCode = [...code]
//     nextCode[index] = nextValue
//     setCode(nextCode)

//     if (nextValue && index < OTP_LENGTH - 1) {
//       inputRefs.current[index + 1]?.focus()
//     }
//   }

//   const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === 'Backspace' && !code[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus()
//     }
//   }

//   const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
//     event.preventDefault()
//     const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
//     if (!pasted) return
//     const nextCode = Array.from({ length: OTP_LENGTH }, (_, index) => pasted[index] ?? '')
//     setCode(nextCode)
//     const nextFocus = Math.min(pasted.length, OTP_LENGTH - 1)
//     inputRefs.current[nextFocus]?.focus()
//   }

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault()
//     setLocalError('')
//     dispatch(clearAuthStatus())

//     if (!email.trim()) {
//       setLocalError('Please enter the email address linked to your account.')
//       return
//     }

//     if (code.some((digit) => digit.length === 0)) {
//       setLocalError('Enter the full 6-digit verification code.')
//       toast({ title: 'Invalid code', description: 'Please complete all six digits.' })
//       return
//     }

//     const otpPayload = code.join('')

//     try {
//       await dispatch(verifyRegisterOtp({ email: email.trim(), otp: otpPayload })).unwrap()
//       toast({ title: 'Verified Successfully', description: 'Your email is now confirmed. Please sign in.' })
//       router.push('/login')
//     } catch (err: any) {
//       console.error('OTP Verification Failure:', err)
//       setLocalError(err || 'The verification code provided is incorrect or has expired.')
//       toast({ title: 'Verification failed', description: err || 'Invalid code entry.', variant: 'destructive' })
//     }
//   }

//   const handleResend = async () => {
//     if (resendTimer > 0) return
//     setLocalError('')
//     dispatch(clearAuthStatus())

//     if (!email.trim()) {
//       setLocalError('Please enter your email address before requesting a fresh code.')
//       return
//     }
    
//     try {
//       await dispatch(forgotPassword({ email: email.trim() })).unwrap()
//       setResendTimer(60)
//       toast({ title: 'Code resent', description: 'A fresh verification code is on its way.' })
//     } catch (err: any) {
//       console.error('OTP Resend Failure:', err)
//       toast({ 
//         title: 'Resend failed', 
//         description: err || 'Unable to request a new code. Please try again.',
//         variant: 'destructive'
//       })
//     }
//   }

//   // Combine local state validations with explicit Redux backend error returns
//   const activeError = localError || reduxError

//   return (
//     <AuthShell
//       eyebrow="Secure Verification"
//       title="A final touch to your artisan experience"
//       description="Enter the one-time code sent to your inbox. This step keeps your account protected and your purchase journey seamless."
//       imageSrc="/images/hero-artisan.jpg"
//       imageAlt="Artisan working with clay"
//     >
//       <div className="space-y-7">
//         <div>
//           <span className="block text-[10px] uppercase tracking-[0.35em] text-[#C89B3C] font-sans mb-3">
//             One-time passcode
//           </span>
//           <h1 className="text-3xl font-[var(--font-cormorant)] tracking-[-0.03em] text-[#1E1A17] mb-3">
//             Verify your email
//           </h1>
//           <p className="text-sm leading-7 text-[#5B4B3F]">
//             Provide your email address and verification pin down below to complete access and continue exploring handcrafted treasures.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Email input field box */}
//           <div className="space-y-2">
//             <label htmlFor="email" className="block text-xs uppercase tracking-wider text-[#5B4B3F] font-sans">
//               Email Address
//             </label>
//             <div className="relative">
//               <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#A19284]">
//                 <Mail size={16} />
//               </span>
//               <input
//                 id="email"
//                 type="email"
//                 placeholder="name@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full pl-11 pr-4 py-3 bg-[#FBF9F6] border border-[#D4C4B0] rounded-md text-sm text-[#1E1A17] placeholder-[#A19284] focus:outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C] font-sans transition-colors"
//                 required
//               />
//             </div>
//           </div>

//           {/* Six digit sequence input grid blocks */}
//           <div className="space-y-2">
//             <label className="block text-xs uppercase tracking-wider text-[#5B4B3F] font-sans">
//               6-Digit Verification Code
//             </label>
//             <div className="grid grid-cols-6 gap-3 justify-center">
//               {code.map((digit, index) => (
//                 <input
//                   key={index}
//                   type="text"
//                   inputMode="numeric"
//                   maxLength={1}
//                   value={digit}
//                   ref={(element) => {
//                     inputRefs.current[index] = element
//                   }}
//                   onChange={(event) => updateCode(index, event.target.value)}
//                   onKeyDown={(event) => handleKeyDown(index, event)}
//                   onPaste={handlePaste}
//                   className="auth-pin"
//                   aria-label={`Digit ${index + 1}`}
//                 />
//               ))}
//             </div>
//           </div>

//           {activeError ? (
//             <p className="text-sm text-[#7A1F1F] font-sans">{activeError}</p>
//           ) : (
//             <p className="text-sm text-[#5B4B3F] font-sans">
//               The code expires in {resendTimer > 0 ? `${resendTimer}s` : 'a moment'}.
//             </p>
//           )}

//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <Button
//               type="submit"
//               className="w-full sm:w-auto px-10 py-4 text-sm tracking-[0.18em] uppercase"
//               disabled={loading}
//             >
//               {loading ? 'Verifying…' : 'Verify Code'}
//             </Button>
//             <button
//               type="button"
//               onClick={handleResend}
//               disabled={resendTimer > 0}
//               className="inline-flex items-center justify-center rounded-full border border-[#D4C4B0] bg-[#F8F4EE] px-6 py-3 text-xs uppercase tracking-[0.22em] text-[#6B3E26] transition-colors duration-300 hover:border-[#C89B3C] hover:text-[#C89B3C] disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
//             </button>
//           </div>

//           <div className="flex items-center gap-3 pt-4 text-sm text-[#5B4B3F] font-sans">
//             <ShieldCheck size={16} className="text-[#C89B3C]" />
//             <span>Code protection is active for every sign-in attempt.</span>
//           </div>
//         </form>

//         <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#D4C4B0]/70 pt-6">
//           <Link href="/login" className="text-[#6B3E26] font-sans text-xs uppercase tracking-[0.2em] hover:text-[#C89B3C]">
//             Return to sign in
//           </Link>
//           <Link
//             href="/"
//             className="inline-flex items-center gap-2 text-[#1E1A17] text-xs uppercase tracking-[0.2em] hover:text-[#C89B3C]"
//           >
//             Skip verification
//             <ArrowRight size={14} />
//           </Link>
//         </div>
//       </div>
//     </AuthShell>
//   )
// }



'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from '@/hooks/use-toast'
import { AuthShell } from '@/components/auth-shell'
import { Button } from '@/components/ui/button'
import { verifyRegisterOtp, forgotPassword, clearAuthStatus } from '@/redux/slice/authSlice/authSlice'
import { getSafeReturnTo } from '@/lib/auth-redirect'

const OTP_LENGTH = 6
const STORAGE_KEY = 'temp_verification_email'

export default function VerifyOtpPage() {
  const router = useRouter()
  const dispatch = useDispatch<any>()
  
  // State variables for background email storage and verification metrics
  const [email, setEmail] = useState('')
  const [code, setCode] = useState(Array(OTP_LENGTH).fill(''))
  const [localError, setLocalError] = useState('')
  const [resendTimer, setResendTimer] = useState(30)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  // Pull dynamic loading states directly from Redux slice
  const { loading, error: reduxError } = useSelector((state: any) => state.auth)

  // Clear global auth states and read from localStorage on component initialization.
  useEffect(() => {
    dispatch(clearAuthStatus())
    inputRefs.current[0]?.focus()

    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem(STORAGE_KEY)
      if (savedEmail) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setEmail(savedEmail)
      } else {
        setLocalError('No email session found. Please try signing up again.')
      }
    }
  }, [dispatch])

  useEffect(() => {
    if (resendTimer <= 0) return undefined
    const timer = window.setTimeout(() => setResendTimer((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [resendTimer])

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLocalError('')
    dispatch(clearAuthStatus())

    const cleanEmail = email.trim()

    if (!cleanEmail) {
      setLocalError('No valid email session identified. Return to sign up.')
      return
    }

    if (code.some((digit) => digit.length === 0)) {
      setLocalError('Enter the full 6-digit verification code.')
      toast({ title: 'Invalid code', description: 'Please complete all six digits.' })
      return
    }

    const otpPayload = code.join('')

    try {
      await dispatch(verifyRegisterOtp({ email: cleanEmail, otp: otpPayload })).unwrap()
      
      // Clean up localStorage upon successful verification
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY)
      }
      
      toast({ title: 'Verified Successfully', description: 'Your email is now confirmed. Please sign in.' })
      const returnTo = typeof window !== 'undefined' ? getSafeReturnTo(new URLSearchParams(window.location.search).get('returnTo')) : '/account'
      router.push(`/login?returnTo=${encodeURIComponent(returnTo)}`)
    } catch (err: any) {
      console.error('OTP Verification Failure:', err)
      setLocalError(err || 'The verification code provided is incorrect or has expired.')
      toast({ title: 'Verification failed', description: err || 'Invalid code entry.', variant: 'destructive' })
    }
  }

  const handleResend = async () => {
    if (resendTimer > 0) return
    setLocalError('')
    dispatch(clearAuthStatus())

    const cleanEmail = email.trim()

    if (!cleanEmail) {
      setLocalError('Cannot request a code without a valid email session.')
      return
    }
    
    try {
      await dispatch(forgotPassword({ email: cleanEmail })).unwrap()
      setResendTimer(60)
      toast({ title: 'Code resent', description: 'A fresh verification code is on its way.' })
    } catch (err: any) {
      console.error('OTP Resend Failure:', err)
      toast({ 
        title: 'Resend failed', 
        description: err || 'Unable to request a new code. Please try again.',
        variant: 'destructive'
      })
    }
  }

  // Combine local state validations with explicit Redux backend error returns
  const activeError = localError || reduxError

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
            We sent a premium verification code to <span className="font-medium text-[#1E1A17]">{email || 'your email'}</span>. Use it below to complete access and continue exploring handcrafted treasures.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Six digit sequence input grid blocks */}
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider text-[#5B4B3F] font-sans">
              6-Digit Verification Code
            </label>
            <div className="grid grid-cols-6 gap-3 justify-center">
              {code.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  disabled={!email}
                  ref={(element) => {
                    inputRefs.current[index] = element
                  }}
                  onChange={(event) => updateCode(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  onPaste={handlePaste}
                  className="auth-pin"
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {activeError ? (
            <p className="text-sm text-[#7A1F1F] font-sans">{activeError}</p>
          ) : (
            <p className="text-sm text-[#5B4B3F] font-sans">
              The code expires in {resendTimer > 0 ? `${resendTimer}s` : 'a moment'}.
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
              disabled={resendTimer > 0 || !email}
              className="inline-flex items-center justify-center rounded-full border border-[#D4C4B0] bg-[#F8F4EE] px-6 py-3 text-xs uppercase tracking-[0.22em] text-[#6B3E26] transition-colors duration-300 hover:border-[#C89B3C] hover:text-[#C89B3C] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
            </button>
          </div>

          <div className="flex items-center gap-3 pt-4 text-sm text-[#5B4B3F] font-sans">
            <ShieldCheck size={16} className="text-[#C89B3C]" />
            <span>Code protection is active for every sign-in attempt.</span>
          </div>
        </form>

        <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#D4C4B0]/70 pt-6">
          <Link href="/login" className="text-[#6B3E26] font-sans text-xs uppercase tracking-[0.2em] hover:text-[#C89B3C]">
            Return to sign in
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#1E1A17] text-xs uppercase tracking-[0.2em] hover:text-[#C89B3C]"
          >
            Skip verification
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </AuthShell>
  )
}