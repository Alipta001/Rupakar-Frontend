// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { motion } from 'framer-motion'
// import { User, Mail, Lock, Eye, EyeOff, Check, ArrowRight } from 'lucide-react'
// import { useSelector, useDispatch } from 'react-redux'
// import { AuthShell } from '@/components/auth-shell'
// import { authRegister } from '@/redux/slice/authSlice/authSlice'

// export default function RegisterPage() {
//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [confirmPassword, setConfirmPassword] = useState('')
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [agreeTerms, setAgreeTerms] = useState(false)
//   const router = useRouter()
//   const dispatch = useDispatch<any>()
//   const { loading } = useSelector((state: any) => state.auth)

//   const passwordStrength = {
//     length: password.length >= 8,
//     hasUppercase: /[A-Z]/.test(password),
//     hasNumber: /\d/.test(password),
//   }

//   const isPasswordStrong = Object.values(passwordStrength).every(v => v)
//   const passwordsMatch = password === confirmPassword && password.length > 0

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     if (!isPasswordStrong || !passwordsMatch || !agreeTerms) {
//       return
//     }

//     const [firstName, ...rest] = name.trim().split(' ')
//     const lastName = rest.join(' ')

//     try {
//       await dispatch(authRegister({ firstName, lastName, email, password })).unwrap()
//       router.push('/account')
//     } catch (error) {
//       console.error('Registration failed:', error)
//     }
//   }

//   const canSubmit = name && email && isPasswordStrong && passwordsMatch && agreeTerms

//   return (
//     <AuthShell
//       eyebrow="Join Us"
//       title="Create Your Account"
//       description="Welcome to the Rupakar family. Create an account to explore exclusive handcrafted collections, save your favorites, and enjoy personalized shopping."
//       imageSrc="/images/register.jpeg"
//       imageAlt="Artisan collection showcase"
//     >
//       <form onSubmit={handleSubmit} className="space-y-5">
//         {/* Name Input */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.1 }}
//         >
//           <label className="block font-sans text-xs tracking-[0.1em] uppercase text-[#1E1A17] mb-3">
//             Full Name
//           </label>
//           <div className="relative">
//             <User
//               size={18}
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C89B3C]/50"
//               strokeWidth={1.5}
//             />
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Your name"
//               required
//               className="w-full pl-12 pr-4 py-3 border border-[#D4C4B0] rounded-lg bg-white/50 font-sans text-sm focus:outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all placeholder:text-[#5B4B3F]/40"
//             />
//           </div>
//         </motion.div>

//         {/* Email Input */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.15 }}
//         >
//           <label className="block font-sans text-xs tracking-[0.1em] uppercase text-[#1E1A17] mb-3">
//             Email Address
//           </label>
//           <div className="relative">
//             <Mail
//               size={18}
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C89B3C]/50"
//               strokeWidth={1.5}
//             />
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="you@example.com"
//               required
//               className="w-full pl-12 pr-4 py-3 border border-[#D4C4B0] rounded-lg bg-white/50 font-sans text-sm focus:outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all placeholder:text-[#5B4B3F]/40"
//             />
//           </div>
//         </motion.div>

//         {/* Password Input */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//         >
//           <label className="block font-sans text-xs tracking-[0.1em] uppercase text-[#1E1A17] mb-3">
//             Password
//           </label>
//           <div className="relative mb-3">
//             <Lock
//               size={18}
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C89B3C]/50"
//               strokeWidth={1.5}
//             />
//             <input
//               type={showPassword ? 'text' : 'password'}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Create a strong password"
//               required
//               className="w-full pl-12 pr-12 py-3 border border-[#D4C4B0] rounded-lg bg-white/50 font-sans text-sm focus:outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all placeholder:text-[#5B4B3F]/40"
//             />
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C89B3C]/50 hover:text-[#C89B3C] transition-colors"
//             >
//               {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
//             </motion.button>
//           </div>

//           {/* Password Strength */}
//           {password.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               transition={{ duration: 0.3 }}
//               className="space-y-2 mb-3"
//             >
//               <div className="flex items-center gap-2 text-xs">
//                 <div className={`w-2 h-2 rounded-full ${passwordStrength.length ? 'bg-green-500' : 'bg-[#D4C4B0]'}`} />
//                 <span className={passwordStrength.length ? 'text-green-600' : 'text-[#5B4B3F]'}>
//                   At least 8 characters
//                 </span>
//               </div>
//               <div className="flex items-center gap-2 text-xs">
//                 <div className={`w-2 h-2 rounded-full ${passwordStrength.hasUppercase ? 'bg-green-500' : 'bg-[#D4C4B0]'}`} />
//                 <span className={passwordStrength.hasUppercase ? 'text-green-600' : 'text-[#5B4B3F]'}>
//                   Uppercase letter
//                 </span>
//               </div>
//               <div className="flex items-center gap-2 text-xs">
//                 <div className={`w-2 h-2 rounded-full ${passwordStrength.hasNumber ? 'bg-green-500' : 'bg-[#D4C4B0]'}`} />
//                 <span className={passwordStrength.hasNumber ? 'text-green-600' : 'text-[#5B4B3F]'}>
//                   At least one number
//                 </span>
//               </div>
//             </motion.div>
//           )}
//         </motion.div>

//         {/* Confirm Password */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.25 }}
//         >
//           <label className="block font-sans text-xs tracking-[0.1em] uppercase text-[#1E1A17] mb-3">
//             Confirm Password
//           </label>
//           <div className="relative">
//             <Lock
//               size={18}
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C89B3C]/50"
//               strokeWidth={1.5}
//             />
//             <input
//               type={showConfirmPassword ? 'text' : 'password'}
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               placeholder="Confirm your password"
//               required
//               className="w-full pl-12 pr-12 py-3 border border-[#D4C4B0] rounded-lg bg-white/50 font-sans text-sm focus:outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all placeholder:text-[#5B4B3F]/40"
//             />
//             {confirmPassword && (
//               <div className="absolute right-4 top-1/2 -translate-y-1/2">
//                 {passwordsMatch ? (
//                   <Check size={18} className="text-green-500" strokeWidth={2} />
//                 ) : (
//                   <div className="w-4 h-4 rounded-full bg-red-200" />
//                 )}
//               </div>
//             )}
//           </div>
//         </motion.div>

//         {/* Terms */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5, delay: 0.3 }}
//         >
//           <label className="flex items-start gap-3 cursor-pointer">
//             <input
//               type="checkbox"
//               checked={agreeTerms}
//               onChange={(e) => setAgreeTerms(e.target.checked)}
//               className="w-4 h-4 mt-1 rounded border-[#D4C4B0] text-[#C89B3C] focus:ring-[#C89B3C]/20"
//             />
//             <span className="font-sans text-xs text-[#5B4B3F] leading-relaxed">
//               I agree to the <a href="/terms" className="text-[#C89B3C] hover:text-[#B7792B] transition-colors">Terms of Service</a> and <a href="/privacy" className="text-[#C89B3C] hover:text-[#B7792B] transition-colors">Privacy Policy</a>
//             </span>
//           </label>
//         </motion.div>

//         {/* Submit Button */}
//         <motion.button
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.35 }}
//           whileHover={{ scale: canSubmit ? 1.02 : 1 }}
//           whileTap={{ scale: canSubmit ? 0.98 : 1 }}
//           type="submit"
//           disabled={!canSubmit || loading}
//           className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#C89B3C] to-[#B7792B] hover:from-[#B7792B] hover:to-[#A66B25] text-white rounded-lg font-sans text-sm font-medium tracking-[0.1em] uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#C89B3C]/20"
//         >
//           {loading ? 'Creating Account...' : <>Create Account <ArrowRight size={16} strokeWidth={2} /></>}
//         </motion.button>

//         {/* Login Link */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5, delay: 0.4 }}
//           className="text-center"
//         >
//           <p className="font-sans text-sm text-[#5B4B3F]">
//             Already have an account?{' '}
//             <a href="/login" className="text-[#C89B3C] hover:text-[#B7792B] font-medium transition-colors">
//               Sign in here
//             </a>
//           </p>
//         </motion.div>
//       </form>
//     </AuthShell>
//   )
// }


// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { motion } from 'framer-motion'
// import { User, Mail, Lock, Eye, EyeOff, Check, ArrowRight } from 'lucide-react'
// import { useSelector, useDispatch } from 'react-redux'
// import { useForm } from 'react-hook-form'
// import { yupResolver } from '@hookform/resolvers/yup'
// import * as yup from 'yup'
// import { AuthShell } from '@/components/auth-shell'
// import { authRegister } from '@/redux/slice/authSlice/authSlice'

// // Validation Schema using Yup
// const schema = yup.object().shape({
//   firstName: yup
//     .string()
//     .required('First name is required')
//     .trim(),
//   lastName: yup
//     .string()
//     .required('Last name is required')
//     .trim(),
//   email: yup
//     .string()
//     .email('Please enter a valid email address')
//     .required('Email address is required'),
//   password: yup
//     .string()
//     .min(8, 'At least 8 characters')
//     .matches(/[A-Z]/, 'Uppercase letter')
//     .matches(/\d/, 'At least one number')
//     .required('Password is required'),
//   confirmPassword: yup
//     .string()
//     .oneOf([yup.ref('password')], 'Passwords must match')
//     .required('Confirm password is required'),
//   agreeTerms: yup
//     .boolean()
//     .oneOf([true], 'You must accept the terms and conditions')
//     .required(),
// })

// type RegisterFormData = yup.InferType<typeof schema>

// export default function RegisterPage() {
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
//   const router = useRouter()
//   const dispatch = useDispatch<any>()
//   const { loading } = useSelector((state: any) => state.auth)

//   // React Hook Form Configuration
//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors, isValid },
//   } = useForm<RegisterFormData>({
//     resolver: yupResolver(schema),
//     mode: 'onChange',
//     defaultValues: {
//       firstName: '',
//       lastName: '',
//       email: '',
//       password: '',
//       confirmPassword: '',
//       agreeTerms: false,
//     },
//   })

//   // Track values for real-time validation and locking criteria display
//   const watchFirstName = watch('firstName')
//   const watchLastName = watch('lastName')
//   const watchEmail = watch('email')
//   const watchPassword = watch('password') || ''
//   const watchConfirmPassword = watch('confirmPassword') || ''
//   const watchAgreeTerms = watch('agreeTerms')

//   // Password structural criteria flags
//   const passwordStrength = {
//     length: watchPassword.length >= 8,
//     hasUppercase: /[A-Z]/.test(watchPassword),
//     hasNumber: /\d/.test(watchPassword),
//   }

//   const passwordsMatch = watchPassword === watchConfirmPassword && watchConfirmPassword.length > 0

//   const onSubmit = async (data: RegisterFormData) => {
//     console.log("Register payload: ", data.firstName, data.lastName, data.email, data.password)
//     try {
//       await dispatch(authRegister({ 
//         firstName: data.firstName.trim(), 
//         lastName: data.lastName.trim(), 
//         email: data.email, 
//         password: data.password 
//       })).unwrap()
//       router.push('/verifyotp')
//     } catch (error) {
//       console.error('Registration failed:', error)
//     }
//   }

//   // Button submission locking flag
//   const canSubmit = watchFirstName && watchLastName && watchEmail && isValid && watchAgreeTerms

//   return (
//     <AuthShell
//       eyebrow="Join Us"
//       title="Create Your Account"
//       description="Welcome to the family. Create an account to explore exclusive handcrafted collections, save your favorites, and enjoy personalized shopping."
//       imageSrc="/images/register.jpeg"
//       imageAlt="Artisan collection showcase"
//     >
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
//         {/* Name Inputs (Split Row) */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {/* First Name */}
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.1 }}
//           >
//             <label className="block font-sans text-xs tracking-[0.1em] uppercase text-[#1E1A17] mb-3">
//               First Name
//             </label>
//             <div className="relative">
//               <User
//                 size={18}
//                 className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C89B3C]/50"
//                 strokeWidth={1.5}
//               />
//               <input
//                 type="text"
//                 {...register('firstName')}
//                 placeholder="First name"
//                 className="w-full pl-12 pr-4 py-3 border border-[#D4C4B0] rounded-lg bg-white/50 font-sans text-sm focus:outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all placeholder:text-[#5B4B3F]/40"
//               />
//             </div>
//             {errors.firstName && (
//               <p className="text-xs text-red-500 mt-1 font-sans">{errors.firstName.message}</p>
//             )}
//           </motion.div>

//           {/* Last Name */}
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.12 }}
//           >
//             <label className="block font-sans text-xs tracking-[0.1em] uppercase text-[#1E1A17] mb-3">
//               Last Name
//             </label>
//             <div className="relative">
//               <User
//                 size={18}
//                 className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C89B3C]/50"
//                 strokeWidth={1.5}
//               />
//               <input
//                 type="text"
//                 {...register('lastName')}
//                 placeholder="Last name"
//                 className="w-full pl-12 pr-4 py-3 border border-[#D4C4B0] rounded-lg bg-white/50 font-sans text-sm focus:outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all placeholder:text-[#5B4B3F]/40"
//               />
//             </div>
//             {errors.lastName && (
//               <p className="text-xs text-red-500 mt-1 font-sans">{errors.lastName.message}</p>
//             )}
//           </motion.div>
//         </div>

//         {/* Email Input */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.15 }}
//         >
//           <label className="block font-sans text-xs tracking-[0.1em] uppercase text-[#1E1A17] mb-3">
//             Email Address
//           </label>
//           <div className="relative">
//             <Mail
//               size={18}
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C89B3C]/50"
//               strokeWidth={1.5}
//             />
//             <input
//               type="email"
//               {...register('email')}
//               placeholder="you@example.com"
//               className="w-full pl-12 pr-4 py-3 border border-[#D4C4B0] rounded-lg bg-white/50 font-sans text-sm focus:outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all placeholder:text-[#5B4B3F]/40"
//             />
//           </div>
//           {errors.email && (
//             <p className="text-xs text-red-500 mt-1 font-sans">{errors.email.message}</p>
//           )}
//         </motion.div>

//         {/* Password Input */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//         >
//           <label className="block font-sans text-xs tracking-[0.1em] uppercase text-[#1E1A17] mb-3">
//             Password
//           </label>
//           <div className="relative mb-3">
//             <Lock
//               size={18}
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C89B3C]/50"
//               strokeWidth={1.5}
//             />
//             <input
//               type={showPassword ? 'text' : 'password'}
//               {...register('password')}
//               placeholder="Create a strong password"
//               className="w-full pl-12 pr-12 py-3 border border-[#D4C4B0] rounded-lg bg-white/50 font-sans text-sm focus:outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all placeholder:text-[#5B4B3F]/40"
//             />
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C89B3C]/50 hover:text-[#C89B3C] transition-colors"
//             >
//               {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
//             </motion.button>
//           </div>

//           {/* Password Strength Checklist */}
//           {watchPassword.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               transition={{ duration: 0.3 }}
//               className="space-y-2 mb-3"
//             >
//               <div className="flex items-center gap-2 text-xs">
//                 <div className={`w-2 h-2 rounded-full ${passwordStrength.length ? 'bg-green-500' : 'bg-[#D4C4B0]'}`} />
//                 <span className={passwordStrength.length ? 'text-green-600' : 'text-[#5B4B3F]'}>
//                   At least 8 characters
//                 </span>
//               </div>
//               <div className="flex items-center gap-2 text-xs">
//                 <div className={`w-2 h-2 rounded-full ${passwordStrength.hasUppercase ? 'bg-green-500' : 'bg-[#D4C4B0]'}`} />
//                 <span className={passwordStrength.hasUppercase ? 'text-green-600' : 'text-[#5B4B3F]'}>
//                   Uppercase letter
//                 </span>
//               </div>
//               <div className="flex items-center gap-2 text-xs">
//                 <div className={`w-2 h-2 rounded-full ${passwordStrength.hasNumber ? 'bg-green-500' : 'bg-[#D4C4B0]'}`} />
//                 <span className={passwordStrength.hasNumber ? 'text-green-600' : 'text-[#5B4B3F]'}>
//                   At least one number
//                 </span>
//               </div>
//             </motion.div>
//           )}
//         </motion.div>

//         {/* Confirm Password */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.25 }}
//         >
//           <label className="block font-sans text-xs tracking-[0.1em] uppercase text-[#1E1A17] mb-3">
//             Confirm Password
//           </label>
//           <div className="relative">
//             <Lock
//               size={18}
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C89B3C]/50"
//               strokeWidth={1.5}
//             />
//             <input
//               type={showConfirmPassword ? 'text' : 'password'}
//               {...register('confirmPassword')}
//               placeholder="Confirm your password"
//               className="w-full pl-12 pr-12 py-3 border border-[#D4C4B0] rounded-lg bg-white/50 font-sans text-sm focus:outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all placeholder:text-[#5B4B3F]/40"
//             />
//             {watchConfirmPassword && (
//               <div className="absolute right-4 top-1/2 -translate-y-1/2">
//                 {passwordsMatch ? (
//                   <Check size={18} className="text-green-500" strokeWidth={2} />
//                 ) : (
//                   <div className="w-4 h-4 rounded-full bg-red-200" />
//                 )}
//               </div>
//             )}
//           </div>
//           {errors.confirmPassword && (
//             <p className="text-xs text-red-500 mt-1 font-sans">{errors.confirmPassword.message}</p>
//           )}
//         </motion.div>

//         {/* Terms */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5, delay: 0.3 }}
//         >
//           <label className="flex items-start gap-3 cursor-pointer">
//             <input
//               type="checkbox"
//               {...register('agreeTerms')}
//               className="w-4 h-4 mt-1 rounded border-[#D4C4B0] text-[#C89B3C] focus:ring-[#C89B3C]/20"
//             />
//             <span className="font-sans text-xs text-[#5B4B3F] leading-relaxed">
//               I agree to the <a href="/terms" className="text-[#C89B3C] hover:text-[#B7792B] transition-colors">Terms of Service</a> and <a href="/privacy" className="text-[#C89B3C] hover:text-[#B7792B] transition-colors">Privacy Policy</a>
//             </span>
//           </label>
//           {errors.agreeTerms && (
//             <p className="text-xs text-red-500 mt-1 font-sans">{errors.agreeTerms.message}</p>
//           )}
//         </motion.div>

//         {/* Submit Button */}
//         <motion.button
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.35 }}
//           whileHover={{ scale: canSubmit ? 1.02 : 1 }}
//           whileTap={{ scale: canSubmit ? 0.98 : 1 }}
//           type="submit"
//           disabled={!canSubmit || loading}
//           className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#C89B3C] to-[#B7792B] hover:from-[#B7792B] hover:to-[#A66B25] text-white rounded-lg font-sans text-sm font-medium tracking-[0.1em] uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#C89B3C]/20"
//         >
//           {loading ? 'Creating Account...' : <>Create Account <ArrowRight size={16} strokeWidth={2} /></>}
//         </motion.button>

//         {/* Login Link */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5, delay: 0.4 }}
//           className="text-center"
//         >
//           <p className="font-sans text-sm text-[#5B4B3F]">
//             Already have an account?{' '}
//             <a href="/login" className="text-[#C89B3C] hover:text-[#B7792B] font-medium transition-colors">
//               Sign in here
//             </a>
//           </p>
//         </motion.div>
//       </form>
//     </AuthShell>
//   )
// }


'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, Check, ArrowRight } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { AuthShell } from '@/components/auth-shell'
import { authRegister } from '@/redux/slice/authSlice/authSlice'
import { getSafeReturnTo } from '@/lib/auth-redirect'

// Validation Schema using Yup
const schema = yup.object().shape({
  firstName: yup
    .string()
    .required('First name is required')
    .trim(),
  lastName: yup
    .string()
    .required('Last name is required')
    .trim(),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
  password: yup
    .string()
    .min(8, 'At least 8 characters')
    .matches(/[A-Z]/, 'Uppercase letter')
    .matches(/\d/, 'At least one number')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  agreeTerms: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required(),
})

type RegisterFormData = yup.InferType<typeof schema>

const STORAGE_KEY = 'temp_verification_email'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const router = useRouter()
  const dispatch = useDispatch<any>()
  const { loading } = useSelector((state: any) => state.auth)

  // React Hook Form Configuration
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
  })

  // Track values for real-time validation and locking criteria display.
  const watchFirstName = watch('firstName')
  const watchLastName = watch('lastName')
  const watchEmail = watch('email')
  const watchPassword = watch('password') || ''
  const watchConfirmPassword = watch('confirmPassword') || ''
  const watchAgreeTerms = watch('agreeTerms')

  // Password structural criteria flags
  const passwordStrength = {
    length: watchPassword.length >= 8,
    hasUppercase: /[A-Z]/.test(watchPassword),
    hasNumber: /\d/.test(watchPassword),
  }

  const passwordsMatch = watchPassword === watchConfirmPassword && watchConfirmPassword.length > 0

  const onSubmit = async (data: RegisterFormData) => {
    console.log("Register payload: ", data.firstName, data.lastName, data.email, data.password)
    try {
      const cleanEmail = data.email.trim()
      
      await dispatch(authRegister({
        name: `${data.firstName.trim()} ${data.lastName.trim()}`.trim(),
        email: cleanEmail,
        password: data.password,
      })).unwrap()
      
      // Save the email temporarily for background OTP state usage
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, cleanEmail)
      }

      const returnTo = typeof window !== 'undefined' ? getSafeReturnTo(new URLSearchParams(window.location.search).get('returnTo')) : '/account'
      router.push(`/verify-otp?returnTo=${encodeURIComponent(returnTo)}`)
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  // Button submission locking flag
  const canSubmit = watchFirstName && watchLastName && watchEmail && isValid && watchAgreeTerms

  return (
    <AuthShell
      eyebrow="Join Us"
      title="Create Your Account"
      description="Welcome to the family. Create an account to explore exclusive handcrafted collections, save your favorites, and enjoy personalized shopping."
      imageSrc="/images/register.jpeg"
      imageAlt="Artisan collection showcase"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {/* Name Inputs (Split Row) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Name */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <label className="block font-sans text-xs tracking-[0.1em] uppercase text-[#1E1A17] mb-3">
              First Name
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C89B3C]/50"
                strokeWidth={1.5}
              />
              <input
                type="text"
                {...register('firstName')}
                placeholder="First name"
                className="w-full pl-12 pr-4 py-3 border border-[#D4C4B0] rounded-lg bg-white/50 font-sans text-sm focus:outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all placeholder:text-[#5B4B3F]/40"
              />
            </div>
            {errors.firstName && (
              <p className="text-xs text-red-500 mt-1 font-sans">{errors.firstName.message}</p>
            )}
          </motion.div>

          {/* Last Name */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
          >
            <label className="block font-sans text-xs tracking-[0.1em] uppercase text-[#1E1A17] mb-3">
              Last Name
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C89B3C]/50"
                strokeWidth={1.5}
              />
              <input
                type="text"
                {...register('lastName')}
                placeholder="Last name"
                className="w-full pl-12 pr-4 py-3 border border-[#D4C4B0] rounded-lg bg-white/50 font-sans text-sm focus:outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all placeholder:text-[#5B4B3F]/40"
              />
            </div>
            {errors.lastName && (
              <p className="text-xs text-red-500 mt-1 font-sans">{errors.lastName.message}</p>
            )}
          </motion.div>
        </div>

        {/* Email Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
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
              {...register('email')}
              placeholder="you@example.com"
              className="w-full pl-12 pr-4 py-3 border border-[#D4C4B0] rounded-lg bg-white/50 font-sans text-sm focus:outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all placeholder:text-[#5B4B3F]/40"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1 font-sans">{errors.email.message}</p>
          )}
        </motion.div>

        {/* Password Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <label className="block font-sans text-xs tracking-[0.1em] uppercase text-[#1E1A17] mb-3">
            Password
          </label>
          <div className="relative mb-3">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C89B3C]/50"
              strokeWidth={1.5}
            />
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder="Create a strong password"
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

          {/* Password Strength Checklist */}
          {watchPassword.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="space-y-2 mb-3"
            >
              <div className="flex items-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${passwordStrength.length ? 'bg-green-500' : 'bg-[#D4C4B0]'}`} />
                <span className={passwordStrength.length ? 'text-green-600' : 'text-[#5B4B3F]'}>
                  At least 8 characters
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${passwordStrength.hasUppercase ? 'bg-green-500' : 'bg-[#D4C4B0]'}`} />
                <span className={passwordStrength.hasUppercase ? 'text-green-600' : 'text-[#5B4B3F]'}>
                  Uppercase letter
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${passwordStrength.hasNumber ? 'bg-green-500' : 'bg-[#D4C4B0]'}`} />
                <span className={passwordStrength.hasNumber ? 'text-green-600' : 'text-[#5B4B3F]'}>
                  At least one number
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Confirm Password */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <label className="block font-sans text-xs tracking-[0.1em] uppercase text-[#1E1A17] mb-3">
            Confirm Password
          </label>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C89B3C]/50"
              strokeWidth={1.5}
            />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              placeholder="Confirm your password"
              className="w-full pl-12 pr-12 py-3 border border-[#D4C4B0] rounded-lg bg-white/50 font-sans text-sm focus:outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all placeholder:text-[#5B4B3F]/40"
            />
            {watchConfirmPassword && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {passwordsMatch ? (
                  <Check size={18} className="text-green-500" strokeWidth={2} />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-red-200" />
                )}
              </div>
            )}
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1 font-sans">{errors.confirmPassword.message}</p>
          )}
        </motion.div>

        {/* Terms */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register('agreeTerms')}
              className="w-4 h-4 mt-1 rounded border-[#D4C4B0] text-[#C89B3C] focus:ring-[#C89B3C]/20"
            />
            <span className="font-sans text-xs text-[#5B4B3F] leading-relaxed">
              I agree to the <a href="/terms" className="text-[#C89B3C] hover:text-[#B7792B] transition-colors">Terms of Service</a> and <a href="/privacy" className="text-[#C89B3C] hover:text-[#B7792B] transition-colors">Privacy Policy</a>
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="text-xs text-red-500 mt-1 font-sans">{errors.agreeTerms.message}</p>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          whileHover={{ scale: canSubmit ? 1.02 : 1 }}
          whileTap={{ scale: canSubmit ? 0.98 : 1 }}
          type="submit"
          disabled={!canSubmit || loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#C89B3C] to-[#B7792B] hover:from-[#B7792B] hover:to-[#A66B25] text-white rounded-lg font-sans text-sm font-medium tracking-[0.1em] uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#C89B3C]/20"
        >
          {loading ? 'Creating Account...' : <>Create Account <ArrowRight size={16} strokeWidth={2} /></>}
        </motion.button>

        {/* Login Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <p className="font-sans text-sm text-[#5B4B3F]">
            Already have an account?{' '}
            <a href="/login" className="text-[#C89B3C] hover:text-[#B7792B] font-medium transition-colors">
              Sign in here
            </a>
          </p>
        </motion.div>
      </form>
    </AuthShell>
  )
}