// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import Image from 'next/image'
// import { useRouter } from 'next/navigation'
// import { motion, useScroll, AnimatePresence } from 'framer-motion'
// import { ShoppingBag, Search, Menu, X, Heart, User } from 'lucide-react'
// import { useAuth } from '@/contexts/auth-context'
// import { AccountDropdown } from './account-dropdown'

// const navLinks = [
//   {
//     label: 'Collections',
//     href: '/collections',
//     sub: ['Terracotta', 'Folk Art', 'Home Decor', 'Jewelry', 'Textiles'],
//   },
//   { label: 'Artisans', href: '/artisans' },
//   { label: 'About', href: '/about' },
//   { label: 'Contact', href: '/contact' },
// ]

// export default function Navbar() {
//   const [scrolled, setScrolled] = useState(false)
//   const [mobileOpen, setMobileOpen] = useState(false)
//   const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
//   const [accountDropdownOpen, setAccountDropdownOpen] = useState(false)
//   const router = useRouter()
//   const { user, isAuthenticated, logout } = useAuth()
//   const handleLogout = () => {
//     logout()
//     router.push('/')
//   }

//   const { scrollY } = useScroll()

//   useEffect(() => {
//     const unsub = scrollY.on('change', (v) => setScrolled(v > 60))
//     return unsub
//   }, [scrollY])

//   return (
//     <>
//       <motion.header
//         initial={{ y: -100, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0, ease: [0.25, 0.46, 0.45, 0.94] }}
//         className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
//           scrolled
//             ? 'bg-[#1E1A17]/95 backdrop-blur-md shadow-lg shadow-black/20 py-3'
//             : 'bg-[#1E1A17]/95 backdrop-blur-md shadow-lg shadow-black/20 py-5'
//         }`}
//       >
//         <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

//           {/* Logo */}
//           <Link href="/" className="flex-shrink-0">
//             <motion.div
//               whileHover={{ scale: 1.02 }}
//               className="text-center"
//             >
//               <span
//                 className="block text-[#F8F4EE] tracking-[0.3em] uppercase text-xl"
//                 style={{ fontFamily: 'var(--font-italiana), serif' }}
//               >
//                 Rupakar
//               </span>
//               <span className="block text-[#C89B3C] tracking-[0.35em] uppercase text-[9px] mt-0.5 font-sans">
//                 Artisan Marketplace
//               </span>
//             </motion.div>
//           </Link>

//           {/* Left Nav */}
//           <nav className="hidden lg:flex items-center gap-8">
//             {navLinks.map((link) => (
//               <div
//                 key={link.label}
//                 className="relative"
//                 onMouseEnter={() => link.sub && setActiveDropdown(link.label)}
//                 onMouseLeave={() => setActiveDropdown(null)}
//               >
//                 <Link
//                   href={link.href}
//                   className="luxury-underline text-[#F8F4EE]/80 hover:text-[#C89B3C] font-sans text-xs tracking-[0.15em] uppercase transition-colors duration-300"
//                 >
//                   {link.label}
//                 </Link>

//                 <AnimatePresence>
//                   {link.sub && activeDropdown === link.label && (
//                     <motion.div
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: 10 }}
//                       transition={{ duration: 0.2 }}
//                       className="absolute top-full left-0 mt-4 w-48 bg-[#1E1A17]/98 backdrop-blur-md border border-[#C89B3C]/20 p-4 space-y-2"
//                     >
//                       {link.sub.map((s) => (
//                         <Link
//                           key={s}
//                           href={`/collections/${s.toLowerCase().replace(' ', '-')}`}
//                           className="block text-[#F8F4EE]/70 hover:text-[#C89B3C] font-sans text-xs tracking-[0.1em] uppercase transition-colors duration-200 py-1"
//                         >
//                           {s}
//                         </Link>
//                       ))}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             ))}
//           </nav>

//           {/* Right Nav - Icons & Auth */}
//           <div className="flex items-center gap-4">
//             {/* Search */}
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => router.push('/search')}
//               className="text-[#F8F4EE]/80 hover:text-[#C89B3C] transition-colors duration-300"
//               aria-label="Search"
//             >
//               <Search size={18} strokeWidth={1.5} />
//             </motion.button>

//             {/* Wishlist */}
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => router.push('/wishlist')}
//               className="text-[#F8F4EE]/80 hover:text-[#C89B3C] transition-colors duration-300 hidden sm:block"
//               aria-label="Wishlist"
//             >
//               <Heart size={18} strokeWidth={1.5} />
//             </motion.button>

//             {/* Cart */}
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => router.push('/cart')}
//               className="text-[#F8F4EE]/80 hover:text-[#C89B3C] transition-colors duration-300 relative"
//               aria-label="Cart"
//             >
//               <ShoppingBag size={18} strokeWidth={1.5} />
//               <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#C89B3C] text-[#1E1A17] text-[9px] font-bold rounded-full flex items-center justify-center">
//                 3
//               </span>
//             </motion.button>

//             {/* Auth Section */}
//             {isAuthenticated && user ? (
//               <>
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => router.push('/account/profile')}
//                   className="hidden md:flex items-center gap-2 px-3 py-2 border border-[#C89B3C]/30 text-[#F8F4EE] hover:bg-[#C89B3C]/10 hover:text-[#C89B3C] rounded-md uppercase tracking-[0.1em] text-[10px] transition-all duration-300"
//                   aria-label="Profile"
//                 >
//                   <User size={14} />
//                   Profile
//                 </motion.button>

//                 {/* Account Dropdown Trigger */}
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
//                   className="relative"
//                   aria-label="Account"
//                 >
//                   <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#C89B3C]/40 hover:border-[#C89B3C]/70 transition-colors">
//                     {user.avatar ? (
//                       <Image
//                         src={user.avatar}
//                         alt={user.name}
//                         fill
//                         className="object-cover"
//                       />
//                     ) : (
//                       <div className="w-full h-full bg-[#C89B3C]/20 flex items-center justify-center">
//                         <User size={14} className="text-[#C89B3C]" strokeWidth={2} />
//                       </div>
//                     )}
//                   </div>
//                 </motion.button>

//                 <AccountDropdown isOpen={accountDropdownOpen} onClose={() => setAccountDropdownOpen(false)} />
//               </>
//             ) : (
//               <>
//                 {/* Login Button */}
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => router.push('/login')}
//                   className="hidden sm:block px-4 py-2 text-[#C89B3C] hover:text-[#F8F4EE] border border-[#C89B3C] hover:bg-[#C89B3C] hover:border-[#C89B3C] rounded-md font-sans text-xs tracking-[0.1em] uppercase transition-all duration-300"
//                 >
//                   Login
//                 </motion.button>

//                 {/* Register Button */}
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => router.push('/register')}
//                   className="hidden sm:block px-4 py-2 bg-[#C89B3C] hover:bg-[#B7792B] text-[#1E1A17] rounded-md font-sans text-xs tracking-[0.1em] uppercase transition-all duration-300 font-medium"
//                 >
//                   Register
//                 </motion.button>
//               </>
//             )}

//             {/* Mobile Menu Toggle */}
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setMobileOpen(!mobileOpen)}
//               className="lg:hidden text-[#F8F4EE]/80 hover:text-[#C89B3C] transition-colors duration-300"
//               aria-label="Menu"
//             >
//               {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
//             </motion.button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         <AnimatePresence>
//           {mobileOpen && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               transition={{ duration: 0.3 }}
//               className="lg:hidden border-t border-[#C89B3C]/20 mt-4 px-6 py-4 space-y-3"
//             >
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.label}
//                   href={link.href}
//                   onClick={() => setMobileOpen(false)}
//                   className="block text-[#F8F4EE]/80 hover:text-[#C89B3C] font-sans text-xs tracking-[0.1em] uppercase transition-colors py-2"
//                 >
//                   {link.label}
//                 </Link>
//               ))}

//               {/* Mobile Auth */}
//               {isAuthenticated && user ? (
//                 <div className="space-y-2 pt-2">
//                   <Link
//                     href="/account/profile"
//                     onClick={() => setMobileOpen(false)}
//                     className="block text-[#F8F4EE]/80 hover:text-[#C89B3C] font-sans text-xs tracking-[0.1em] uppercase transition-colors py-2"
//                   >
//                     Profile
//                   </Link>
//                   <button
//                     onClick={() => {
//                       handleLogout()
//                       setMobileOpen(false)
//                     }}
//                     className="w-full text-left text-[#F8F4EE]/80 hover:text-[#C89B3C] font-sans text-xs tracking-[0.1em] uppercase transition-colors py-2"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               ) : (
//                 <div className="flex gap-2 pt-2">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => {
//                       router.push('/login')
//                       setMobileOpen(false)
//                     }}
//                     className="flex-1 px-3 py-2 text-[#C89B3C] border border-[#C89B3C] hover:bg-[#C89B3C] hover:text-[#1E1A17] rounded-md font-sans text-xs tracking-[0.1em] uppercase transition-all duration-300"
//                   >
//                     Login
//                   </motion.button>
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => {
//                       router.push('/register')
//                       setMobileOpen(false)
//                     }}
//                     className="flex-1 px-3 py-2 bg-[#C89B3C] hover:bg-[#B7792B] text-[#1E1A17] rounded-md font-sans text-xs tracking-[0.1em] uppercase transition-all duration-300 font-medium"
//                   >
//                     Register
//                   </motion.button>
//                 </div>
//               )}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.header>
//     </>
//   )
// }


// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import Image from 'next/image'
// import { useRouter } from 'next/navigation'
// import { motion, useScroll, AnimatePresence } from 'framer-motion'
// import { ShoppingBag, Search, Menu, X, Heart, User } from 'lucide-react'
// // Removed useAuth context import
// // Added standard Redux Toolkit hooks and your auth actions
// import { useSelector, useDispatch } from 'react-redux' 
// import { authLogout } from '@/redux/slice/authSlice/authSlice' // Adjust this path to match your Redux file structure
// import { AccountDropdown } from './account-dropdown'

// const navLinks = [
//   {
//     label: 'Collections',
//     href: '/collections',
//     sub: ['Terracotta', 'Folk Art', 'Home Decor', 'Jewelry', 'Textiles'],
//   },
//   { label: 'Artisans', href: '/artisans' },
//   { label: 'About', href: '/about' },
//   { label: 'Contact', href: '/contact' },
// ]

// export default function Navbar() {
//   const [scrolled, setScrolled] = useState(false)
//   const [mobileOpen, setMobileOpen] = useState(false)
//   const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
//   const [accountDropdownOpen, setAccountDropdownOpen] = useState(false)
//   const router = useRouter()
  
//   // Redux Setup
//   const dispatch = useDispatch()
//   // Adjust 'state.auth' depending on what you named your reducer in configureStore
//   const { user, isAuthenticated } = useSelector((state: any) => state.auth)

//   // const handleLogout = () => {
//   //   dispatch(authLogout())
//   //   router.push('/')
//   // }

//   const { scrollY } = useScroll()

//   useEffect(() => {
//     const unsub = scrollY.on('change', (v) => setScrolled(v > 60))
//     return unsub
//   }, [scrollY])

//   return (
//     <>
//       <motion.header
//         initial={{ y: -100, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0, ease: [0.25, 0.46, 0.45, 0.94] }}
//         className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
//           scrolled
//             ? 'bg-[#1E1A17]/95 backdrop-blur-md shadow-lg shadow-black/20 py-3'
//             : 'bg-[#1E1A17]/95 backdrop-blur-md shadow-lg shadow-black/20 py-5'
//         }`}
//       >
//         <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

//           {/* Logo */}
//           <Link href="/" className="flex-shrink-0">
//             <motion.div
//               whileHover={{ scale: 1.02 }}
//               className="text-center"
//             >
//               <span
//                 className="block text-[#F8F4EE] tracking-[0.3em] uppercase text-xl"
//                 style={{ fontFamily: 'var(--font-italiana), serif' }}
//               >
//                 Rupakar
//               </span>
//               <span className="block text-[#C89B3C] tracking-[0.35em] uppercase text-[9px] mt-0.5 font-sans">
//                 Artisan Marketplace
//               </span>
//             </motion.div>
//           </Link>

//           {/* Left Nav */}
//           <nav className="hidden lg:flex items-center gap-8">
//             {navLinks.map((link) => (
//               <div
//                 key={link.label}
//                 className="relative"
//                 onMouseEnter={() => link.sub && setActiveDropdown(link.label)}
//                 onMouseLeave={() => setActiveDropdown(null)}
//               >
//                 <Link
//                   href={link.href}
//                   className="luxury-underline text-[#F8F4EE]/80 hover:text-[#C89B3C] font-sans text-xs tracking-[0.15em] uppercase transition-colors duration-300"
//                 >
//                   {link.label}
//                 </Link>

//                 <AnimatePresence>
//                   {link.sub && activeDropdown === link.label && (
//                     <motion.div
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: 10 }}
//                       transition={{ duration: 0.2 }}
//                       className="absolute top-full left-0 mt-4 w-48 bg-[#1E1A17]/98 backdrop-blur-md border border-[#C89B3C]/20 p-4 space-y-2"
//                     >
//                       {link.sub.map((s) => (
//                         <Link
//                           key={s}
//                           href={`/collections/${s.toLowerCase().replace(' ', '-')}`}
//                           className="block text-[#F8F4EE]/70 hover:text-[#C89B3C] font-sans text-xs tracking-[0.1em] uppercase transition-colors duration-200 py-1"
//                         >
//                           {s}
//                         </Link>
//                       ))}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             ))}
//           </nav>

//           {/* Right Nav - Icons & Auth */}
//           <div className="flex items-center gap-4">
//             {/* Search */}
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => router.push('/search')}
//               className="text-[#F8F4EE]/80 hover:text-[#C89B3C] transition-colors duration-300"
//               aria-label="Search"
//             >
//               <Search size={18} strokeWidth={1.5} />
//             </motion.button>

//             {/* Wishlist */}
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => router.push('/wishlist')}
//               className="text-[#F8F4EE]/80 hover:text-[#C89B3C] transition-colors duration-300 hidden sm:block"
//               aria-label="Wishlist"
//             >
//               <Heart size={18} strokeWidth={1.5} />
//             </motion.button>

//             {/* Cart */}
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => router.push('/cart')}
//               className="text-[#F8F4EE]/80 hover:text-[#C89B3C] transition-colors duration-300 relative"
//               aria-label="Cart"
//             >
//               <ShoppingBag size={18} strokeWidth={1.5} />
//               <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#C89B3C] text-[#1E1A17] text-[9px] font-bold rounded-full flex items-center justify-center">
//                 3
//               </span>
//             </motion.button>

//             {/* Auth Section */}
//             {isAuthenticated && user ? (
//               <>
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => router.push('/account/profile')}
//                   className="hidden md:flex items-center gap-2 px-3 py-2 border border-[#C89B3C]/30 text-[#F8F4EE] hover:bg-[#C89B3C]/10 hover:text-[#C89B3C] rounded-md uppercase tracking-[0.1em] text-[10px] transition-all duration-300"
//                   aria-label="Profile"
//                 >
//                   <User size={14} />
//                   Profile
//                 </motion.button>

//                 {/* Account Dropdown Trigger */}
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
//                   className="relative"
//                   aria-label="Account"
//                 >
//                   <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#C89B3C]/40 hover:border-[#C89B3C]/70 transition-colors">
//                     {(user as any).avatar ? (
//                       <Image
//                         src={(user as any).avatar}
//                         alt={user.firstName || 'User avatar'}
//                         fill
//                         className="object-cover"
//                       />
//                     ) : (
//                       <div className="w-full h-full bg-[#C89B3C]/20 flex items-center justify-center">
//                         <User size={14} className="text-[#C89B3C]" strokeWidth={2} />
//                       </div>
//                     )}
//                   </div>
//                 </motion.button>

//                 <AccountDropdown isOpen={accountDropdownOpen} onClose={() => setAccountDropdownOpen(false)} />
//               </>
//             ) : (
//               <>
//                 {/* Login Button */}
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => router.push('/login')}
//                   className="hidden sm:block px-4 py-2 text-[#C89B3C] hover:text-[#F8F4EE] border border-[#C89B3C] hover:bg-[#C89B3C] hover:border-[#C89B3C] rounded-md font-sans text-xs tracking-[0.1em] uppercase transition-all duration-300"
//                 >
//                   Login
//                 </motion.button>

//                 {/* Register Button */}
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => router.push('/register')}
//                   className="hidden sm:block px-4 py-2 bg-[#C89B3C] hover:bg-[#B7792B] text-[#1E1A17] rounded-md font-sans text-xs tracking-[0.1em] uppercase transition-all duration-300 font-medium"
//                 >
//                   Register
//                 </motion.button>
//               </>
//             )}

//             {/* Mobile Menu Toggle */}
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setMobileOpen(!mobileOpen)}
//               className="lg:hidden text-[#F8F4EE]/80 hover:text-[#C89B3C] transition-colors duration-300"
//               aria-label="Menu"
//             >
//               {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
//             </motion.button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         <AnimatePresence>
//           {mobileOpen && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               transition={{ duration: 0.3 }}
//               className="lg:hidden border-t border-[#C89B3C]/20 mt-4 px-6 py-4 space-y-3"
//             >
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.label}
//                   href={link.href}
//                   onClick={() => setMobileOpen(false)}
//                   className="block text-[#F8F4EE]/80 hover:text-[#C89B3C] font-sans text-xs tracking-[0.1em] uppercase transition-colors py-2"
//                 >
//                   {link.label}
//                 </Link>
//               ))}

//               {/* Mobile Auth */}
//               {isAuthenticated && user ? (
//                 <div className="space-y-2 pt-2">
//                   <Link
//                     href="/account/profile"
//                     onClick={() => setMobileOpen(false)}
//                     className="block text-[#F8F4EE]/80 hover:text-[#C89B3C] font-sans text-xs tracking-[0.1em] uppercase transition-colors py-2"
//                   >
//                     Profile
//                   </Link>
//                   <button
//                     onClick={() => {
//                       handleLogout()
//                       setMobileOpen(false)
//                     }}
//                     className="w-full text-left text-[#F8F4EE]/80 hover:text-[#C89B3C] font-sans text-xs tracking-[0.1em] uppercase transition-colors py-2"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               ) : (
//                 <div className="flex gap-2 pt-2">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => {
//                       router.push('/login')
//                       setMobileOpen(false)
//                     }}
//                     className="flex-1 px-3 py-2 text-[#C89B3C] border border-[#C89B3C] hover:bg-[#C89B3C] hover:text-[#1E1A17] rounded-md font-sans text-xs tracking-[0.1em] uppercase transition-all duration-300"
//                   >
//                     Login
//                   </motion.button>
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => {
//                       router.push('/register')
//                       setMobileOpen(false)
//                     }}
//                     className="flex-1 px-3 py-2 bg-[#C89B3C] hover:bg-[#B7792B] text-[#1E1A17] rounded-md font-sans text-xs tracking-[0.1em] uppercase transition-all duration-300 font-medium"
//                   >
//                     Register
//                   </motion.button>
//                 </div>
//               )}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.header>
//     </>
//   )
// }




// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import Image from 'next/image'
// import { useRouter } from 'next/navigation'
// import { motion, useScroll, AnimatePresence } from 'framer-motion'
// import { ShoppingBag, Search, Menu, X, Heart, User } from 'lucide-react'
// import { useSelector, useDispatch } from 'react-redux' 
// import { authLogout } from '@/redux/slice/authSlice/authSlice' 
// import { AccountDropdown } from './account-dropdown'

// const navLinks = [
//   {
//     label: 'Collections',
//     href: '/collections',
//     sub: ['Terracotta', 'Folk Art', 'Home Decor', 'Jewelry', 'Textiles'],
//   },
//   { label: 'Artisans', href: '/artisans' },
//   { label: 'About', href: '/about' },
//   { label: 'Contact', href: '/contact' },
// ]

// export default function Navbar() {
//   const [scrolled, setScrolled] = useState(false)
//   const [mobileOpen, setMobileOpen] = useState(false)
//   const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
//   const [accountDropdownOpen, setAccountDropdownOpen] = useState(false)
//   const router = useRouter()
  
//   // Redux Setup
//   const dispatch = useDispatch<any>()
//   const { user, isAuthenticated } = useSelector((state: any) => state.auth)

//   // Active Logout Handler for Redux State Clearance
//   const handleLogout = () => {
//     dispatch(authLogout())
//     setAccountDropdownOpen(false)
//     router.push('/')
//   }

//   const { scrollY } = useScroll()

//   useEffect(() => {
//     const unsub = scrollY.on('change', (v) => setScrolled(v > 60))
//     return unsub
//   }, [scrollY])

//   return (
//     <>
//       <motion.header
//         initial={{ y: -100, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0, ease: [0.25, 0.46, 0.45, 0.94] }}
//         className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
//           scrolled
//             ? 'bg-[#1E1A17]/95 backdrop-blur-md shadow-lg shadow-black/20 py-3'
//             : 'bg-[#1E1A17]/95 backdrop-blur-md shadow-lg shadow-black/20 py-5'
//         }`}
//       >
//         <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

//           {/* Logo */}
//           <Link href="/" className="flex-shrink-0">
//             <motion.div
//               whileHover={{ scale: 1.02 }}
//               className="text-center"
//             >
//               <span
//                 className="block text-[#F8F4EE] tracking-[0.3em] uppercase text-xl"
//                 style={{ fontFamily: 'var(--font-italiana), serif' }}
//               >
//                 Rupakar
//               </span>
//               <span className="block text-[#C89B3C] tracking-[0.35em] uppercase text-[9px] mt-0.5 font-sans">
//                 Artisan Marketplace
//               </span>
//             </motion.div>
//           </Link>

//           {/* Left Nav */}
//           <nav className="hidden lg:flex items-center gap-8">
//             {navLinks.map((link) => (
//               <div
//                 key={link.label}
//                 className="relative"
//                 onMouseEnter={() => link.sub && setActiveDropdown(link.label)}
//                 onMouseLeave={() => setActiveDropdown(null)}
//               >
//                 <Link
//                   href={link.href}
//                   className="luxury-underline text-[#F8F4EE]/80 hover:text-[#C89B3C] font-sans text-xs tracking-[0.15em] uppercase transition-colors duration-300"
//                 >
//                   {link.label}
//                 </Link>

//                 <AnimatePresence>
//                   {link.sub && activeDropdown === link.label && (
//                     <motion.div
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: 10 }}
//                       transition={{ duration: 0.2 }}
//                       className="absolute top-full left-0 mt-4 w-48 bg-[#1E1A17]/98 backdrop-blur-md border border-[#C89B3C]/20 p-4 space-y-2"
//                     >
//                       {link.sub.map((s) => (
//                         <Link
//                           key={s}
//                           href={`/collections/${s.toLowerCase().replace(' ', '-')}`}
//                           className="block text-[#F8F4EE]/70 hover:text-[#C89B3C] font-sans text-xs tracking-[0.1em] uppercase transition-colors duration-200 py-1"
//                         >
//                           {s}
//                         </Link>
//                       ))}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             ))}
//           </nav>

//           {/* Right Nav - Icons & Auth */}
//           <div className="flex items-center gap-4">
//             {/* Search */}
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => router.push('/search')}
//               className="text-[#F8F4EE]/80 hover:text-[#C89B3C] transition-colors duration-300"
//               aria-label="Search"
//             >
//               <Search size={18} strokeWidth={1.5} />
//             </motion.button>

//             {/* Wishlist */}
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => router.push('/wishlist')}
//               className="text-[#F8F4EE]/80 hover:text-[#C89B3C] transition-colors duration-300 hidden sm:block"
//               aria-label="Wishlist"
//             >
//               <Heart size={18} strokeWidth={1.5} />
//             </motion.button>

//             {/* Cart */}
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => router.push('/cart')}
//               className="text-[#F8F4EE]/80 hover:text-[#C89B3C] transition-colors duration-300 relative"
//               aria-label="Cart"
//             >
//               <ShoppingBag size={18} strokeWidth={1.5} />
//               <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#C89B3C] text-[#1E1A17] text-[9px] font-bold rounded-full flex items-center justify-center">
//                 3
//               </span>
//             </motion.button>

//             {/* Auth Section */}
//             {isAuthenticated && user ? (
//               <div className="relative">
//                 {/* Account Dropdown Trigger Button */}
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
//                   className="flex items-center gap-2 px-3 py-2 border border-[#C89B3C]/30 text-[#F8F4EE] hover:bg-[#C89B3C]/10 hover:text-[#C89B3C] rounded-md uppercase tracking-[0.1em] text-[10px] transition-all duration-300"
//                   aria-label="Account Menu"
//                 >
//                   <div className="relative w-4 h-4 rounded-full overflow-hidden border border-[#C89B3C]/40">
//                     {(user as any).avatar ? (
//                       <Image
//                         src={(user as any).avatar}
//                         alt={user.firstName || 'User avatar'}
//                         fill
//                         className="object-cover"
//                       />
//                     ) : (
//                       <div className="w-full h-full bg-[#C89B3C]/20 flex items-center justify-center">
//                         <User size={10} className="text-[#C89B3C]" strokeWidth={2} />
//                       </div>
//                     )}
//                   </div>
//                   <span>Profile</span>
//                 </motion.button>

//                 {/* Dropdown Container Element */}
//                 <AccountDropdown isOpen={accountDropdownOpen} onClose={() => setAccountDropdownOpen(false)} />
//               </div>
//             ) : (
//               <>
//                 {/* Login Button */}
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => router.push('/login')}
//                   className="hidden sm:block px-4 py-2 text-[#C89B3C] hover:text-[#F8F4EE] border border-[#C89B3C] hover:bg-[#C89B3C] hover:border-[#C89B3C] rounded-md font-sans text-xs tracking-[0.1em] uppercase transition-all duration-300"
//                 >
//                   Login
//                 </motion.button>

//                 {/* Register Button */}
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => router.push('/register')}
//                   className="hidden sm:block px-4 py-2 bg-[#C89B3C] hover:bg-[#B7792B] text-[#1E1A17] rounded-md font-sans text-xs tracking-[0.1em] uppercase transition-all duration-300 font-medium"
//                 >
//                   Register
//                 </motion.button>
//               </>
//             )}

//             {/* Mobile Menu Toggle */}
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setMobileOpen(!mobileOpen)}
//               className="lg:hidden text-[#F8F4EE]/80 hover:text-[#C89B3C] transition-colors duration-300"
//               aria-label="Menu"
//             >
//               {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
//             </motion.button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         <AnimatePresence>
//           {mobileOpen && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               transition={{ duration: 0.3 }}
//               className="lg:hidden border-t border-[#C89B3C]/20 mt-4 px-6 py-4 space-y-3"
//             >
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.label}
//                   href={link.href}
//                   onClick={() => setMobileOpen(false)}
//                   className="block text-[#F8F4EE]/80 hover:text-[#C89B3C] font-sans text-xs tracking-[0.1em] uppercase transition-colors py-2"
//                 >
//                   {link.label}
//                 </Link>
//               ))}

//               {/* Mobile Auth Layout View */}
//               {isAuthenticated && user ? (
//                 <div className="space-y-2 pt-2 border-t border-[#C89B3C]/10">
//                   <Link
//                     href="/account/profile"
//                     onClick={() => setMobileOpen(false)}
//                     className="block text-[#F8F4EE]/80 hover:text-[#C89B3C] font-sans text-xs tracking-[0.1em] uppercase transition-colors py-2"
//                   >
//                     My Account
//                   </Link>
//                   <button
//                     onClick={() => {
//                       handleLogout()
//                       setMobileOpen(false)
//                     }}
//                     className="w-full text-left text-[#F8F4EE]/80 hover:text-[#C89B3C] font-sans text-xs tracking-[0.1em] uppercase transition-colors py-2"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               ) : (
//                 <div className="flex gap-2 pt-2 border-t border-[#C89B3C]/10">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => {
//                       router.push('/login')
//                       setMobileOpen(false)
//                     }}
//                     className="flex-1 px-3 py-2 text-[#C89B3C] border border-[#C89B3C] hover:bg-[#C89B3C] hover:text-[#1E1A17] rounded-md font-sans text-xs tracking-[0.1em] uppercase transition-all duration-300"
//                   >
//                     Login
//                   </motion.button>
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => {
//                       router.push('/register')
//                       setMobileOpen(false)
//                     }}
//                     className="flex-1 px-3 py-2 bg-[#C89B3C] hover:bg-[#B7792B] text-[#1E1A17] rounded-md font-sans text-xs tracking-[0.1em] uppercase transition-all duration-300 font-medium"
//                   >
//                     Register
//                   </motion.button>
//                 </div>
//               )}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.header>
//     </>
//   )
// }



'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, useScroll, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Search, Menu, X, Heart, User } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux' 
import { useQuery } from '@tanstack/react-query'
import { authLogout } from '@/redux/slice/authSlice/authSlice' 
import { AccountDropdown } from './account-dropdown'
import { fetchCart, fetchWishlist } from '@/lib/customer-api'

const navLinks = [
  {
    label: 'Collections',
    href: '/collections',
    sub: ['Terracotta', 'Folk Art', 'Home Decor', 'Jewelry', 'Textiles'],
  },
  { label: 'Artisans', href: '/artisans' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false)
  const router = useRouter()
  
  // Redux Setup
  const dispatch = useDispatch<any>()
  const { user, isAuthenticated } = useSelector((state: any) => state.auth)

  // Live cart and wishlist counts
  const { data: cartData } = useQuery({
    queryKey: ['cart'],
    queryFn: fetchCart,
    staleTime: 30 * 1000,
    retry: false,
  })
  const { data: wishlistData } = useQuery({
    queryKey: ['wishlist'],
    queryFn: fetchWishlist,
    staleTime: 60 * 1000,
    retry: false,
  })
  const cartCount = cartData?.itemCount ?? (Array.isArray(cartData?.items) ? cartData.items.reduce((s: number, i: any) => s + Number(i.quantity ?? 1), 0) : 0)
  const wishlistCount = Array.isArray(wishlistData?.items) ? wishlistData.items.length : 0

  // Wait until client hydration is finished to prevent Next.js layout state flashes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  // Active Logout Handler for Redux State Clearance
  const handleLogout = () => {
    dispatch(authLogout())
    setAccountDropdownOpen(false)
    router.push('/')
  }

  const { scrollY } = useScroll()

  useEffect(() => {
    const unsub = scrollY.on('change', (v) => setScrolled(v > 60))
    return unsub
  }, [scrollY])

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#1E1A17]/95 backdrop-blur-md shadow-lg shadow-black/20 py-3'
            : 'bg-[#1E1A17]/95 backdrop-blur-md shadow-lg shadow-black/20 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="text-center"
            >
              <span
                className="block text-[#F8F4EE] tracking-[0.3em] uppercase text-xl"
                style={{ fontFamily: 'var(--font-italiana), serif' }}
              >
                Rupakar
              </span>
              <span className="block text-[#C89B3C] tracking-[0.35em] uppercase text-[9px] mt-0.5 font-sans">
                Artisan Marketplace
              </span>
            </motion.div>
          </Link>

          {/* Left Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.sub && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className="luxury-underline text-[#F8F4EE]/80 hover:text-[#C89B3C] font-sans text-xs tracking-[0.15em] uppercase transition-colors duration-300"
                >
                  {link.label}
                </Link>

                <AnimatePresence>
                  {link.sub && activeDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-4 w-48 bg-[#1E1A17]/98 backdrop-blur-md border border-[#C89B3C]/20 p-4 space-y-2"
                    >
                      {link.sub.map((s) => (
                        <Link
                          key={s}
                          href={`/collections/${s.toLowerCase().replace(' ', '-')}`}
                          className="block text-[#F8F4EE]/70 hover:text-[#C89B3C] font-sans text-xs tracking-[0.1em] uppercase transition-colors duration-200 py-1"
                        >
                          {s}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right Nav - Icons & Auth */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/search')}
              className="text-[#F8F4EE]/80 hover:text-[#C89B3C] transition-colors duration-300"
              aria-label="Search"
            >
              <Search size={18} strokeWidth={1.5} />
            </motion.button>

            {/* Wishlist */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/wishlist')}
              className="text-[#F8F4EE]/80 hover:text-[#C89B3C] transition-colors duration-300 hidden sm:block relative"
              aria-label="Wishlist"
            >
              <Heart size={18} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#7A1F1F] text-[#F8F4EE] text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </motion.button>

            {/* Cart */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/cart')}
              className="text-[#F8F4EE]/80 hover:text-[#C89B3C] transition-colors duration-300 relative"
              aria-label="Cart"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#C89B3C] text-[#1E1A17] text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </motion.button>

            {/* Auth Section - Wrapped conditionally to prevent initial client state flicker */}
            {mounted && (
              <>
                {isAuthenticated && user ? (
                  <div className="relative">
                    {/* Account Dropdown Trigger Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                      className="flex items-center gap-2 px-3 py-2 border border-[#C89B3C]/30 text-[#F8F4EE] hover:bg-[#C89B3C]/10 hover:text-[#C89B3C] rounded-md uppercase tracking-[0.1em] text-[10px] transition-all duration-300"
                      aria-label="Account Menu"
                    >
                      <div className="relative w-4 h-4 rounded-full overflow-hidden border border-[#C89B3C]/40">
                        {(user as any).avatar ? (
                          <Image
                            src={(user as any).avatar}
                            alt={user.firstName || 'User avatar'}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#C89B3C]/20 flex items-center justify-center">
                            <User size={10} className="text-[#C89B3C]" strokeWidth={2} />
                          </div>
                        )}
                      </div>
                      <span>Profile</span>
                    </motion.button>

                    {/* Dropdown Container Element */}
                    <AccountDropdown isOpen={accountDropdownOpen} onClose={() => setAccountDropdownOpen(false)} />
                  </div>
                ) : (
                  <>
                    {/* Login Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push('/login')}
                      className="hidden sm:block px-4 py-2 text-[#C89B3C] hover:text-[#F8F4EE] border border-[#C89B3C] hover:bg-[#C89B3C] hover:border-[#C89B3C] rounded-md font-sans text-xs tracking-[0.1em] uppercase transition-all duration-300"
                    >
                      Login
                    </motion.button>

                    {/* Register Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push('/register')}
                      className="hidden sm:block px-4 py-2 bg-[#C89B3C] hover:bg-[#B7792B] text-[#1E1A17] rounded-md font-sans text-xs tracking-[0.1em] uppercase transition-all duration-300 font-medium"
                    >
                      Register
                    </motion.button>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-[#C89B3C]/20 mt-4 px-6 py-4 space-y-3"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-[#F8F4EE]/80 hover:text-[#C89B3C] font-sans text-xs tracking-[0.1em] uppercase transition-colors py-2"
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Auth Layout View */}
              {mounted && (
                <>
                  {isAuthenticated && user ? (
                    <div className="space-y-2 pt-2 border-t border-[#C89B3C]/10">
                      <Link
                        href="/account/profile"
                        onClick={() => setMobileOpen(false)}
                        className="block text-[#F8F4EE]/80 hover:text-[#C89B3C] font-sans text-xs tracking-[0.1em] uppercase transition-colors py-2"
                      >
                        My Account
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout()
                          setMobileOpen(false)
                        }}
                        className="w-full text-left text-[#F8F4EE]/80 hover:text-[#C89B3C] font-sans text-xs tracking-[0.1em] uppercase transition-colors py-2"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 pt-2 border-t border-[#C89B3C]/10">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          router.push('/login')
                          setMobileOpen(false)
                    }}
                        className="flex-1 px-3 py-2 text-[#C89B3C] border border-[#C89B3C] hover:bg-[#C89B3C] hover:text-[#1E1A17] rounded-md font-sans text-xs tracking-[0.1em] uppercase transition-all duration-300"
                      >
                        Login
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          router.push('/register')
                          setMobileOpen(false)
                        }}
                        className="flex-1 px-3 py-2 bg-[#C89B3C] hover:bg-[#B7792B] text-[#1E1A17] rounded-md font-sans text-xs tracking-[0.1em] uppercase transition-all duration-300 font-medium"
                      >
                        Register
                      </motion.button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  )
}