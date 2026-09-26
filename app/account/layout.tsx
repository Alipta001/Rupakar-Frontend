// 'use client'

// import { useEffect, useState } from 'react'
// import Link from 'next/link'
// import { usePathname, useRouter } from 'next/navigation'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Menu, X, User, Package, Heart, MapPin, Settings, LogOut, Home } from 'lucide-react'
// import Navbar from '@/components/navbar'
// import Footer from '@/components/footer'
// import { useSelector, useDispatch } from 'react-redux'
// import { authLogout } from '@/redux/slice/authSlice/authSlice'

// const menuItems = [
//   { icon: Home, label: 'Dashboard', href: '/account' },
//   { icon: User, label: 'My Profile', href: '/account/profile' },
//   { icon: Package, label: 'Orders', href: '/account/orders' },
//   { icon: Heart, label: 'Wishlist', href: '/account/wishlist' },
//   { icon: MapPin, label: 'Addresses', href: '/account/addresses' },
//   { icon: Settings, label: 'Settings', href: '/account/settings' },
// ]

// export default function AccountLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   const pathname = usePathname()
//   const router = useRouter()
//   const dispatch = useDispatch<any>()
//   const { data: user, isAuthenticated } = useSelector((state: any) => state.auth)
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

//   useEffect(() => {
//     if (!isAuthenticated) {
//       router.push('/login')
//     }
//   }, [isAuthenticated, router])

//   if (!isAuthenticated) {
//     return null
//   }

//   const handleLogout = () => {
//     dispatch(authLogout())
//     router.push('/')
//   }

//   return (
//     <main className="min-h-screen bg-[#F8F4EE] text-[#1E1A17]">
//       <Navbar />

//       <div className="pt-24">
//         <div className="max-w-7xl mx-auto px-6 py-12">
//           <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
//             {/* Sidebar */}
//             <aside className="hidden lg:flex flex-col">
//               <motion.div
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="space-y-8"
//               >
//                 {/* User Card */}
//                 <div className="rounded-lg border border-[#C89B3C]/20 bg-white/70 backdrop-blur-sm p-5 shadow-sm">
//                   <div className="flex flex-col items-center text-center space-y-3">
//                     <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C89B3C]/30 to-[#6B3E26]/20 flex items-center justify-center">
//                       <span className="text-2xl font-bold text-[#C89B3C]">
//                         {user?.name?.charAt(0).toUpperCase() || 'U'}
//                       </span>
//                     </div>
//                     <div>
//                       <h3 className="font-sans text-sm font-semibold tracking-[0.05em] uppercase">
//                         {user?.name}
//                       </h3>
//                       <p className="text-xs text-[#5B4B3F] mt-1">{user?.email}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Navigation */}
//                 <nav className="space-y-2">
//                   {menuItems.map((item) => {
//                     const Icon = item.icon
//                     const isActive = pathname === item.href
//                     return (
//                       <motion.div
//                         key={item.href}
//                         whileHover={{ x: 4 }}
//                         transition={{ duration: 0.2 }}
//                       >
//                         <Link
//                           href={item.href}
//                           className={`flex items-center gap-3 px-4 py-3 rounded-md font-sans text-sm tracking-[0.05em] uppercase transition-all duration-200 ${
//                             isActive
//                               ? 'bg-[#C89B3C] text-white shadow-md shadow-[#C89B3C]/20'
//                               : 'text-[#5B4B3F] hover:bg-[#EFE3D3] hover:text-[#C89B3C]'
//                           }`}
//                         >
//                           <Icon size={16} strokeWidth={1.5} />
//                           <span>{item.label}</span>
//                         </Link>
//                       </motion.div>
//                     )
//                   })}

//                   {/* Logout */}
//                   <motion.button
//                     whileHover={{ x: 4 }}
//                     transition={{ duration: 0.2 }}
//                     onClick={handleLogout}
//                     className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-[#7A1F1F] hover:bg-[#7A1F1F]/10 font-sans text-sm tracking-[0.05em] uppercase transition-all duration-200 mt-4 border-t border-[#D4C4B0] pt-4"
//                   >
//                     <LogOut size={16} strokeWidth={1.5} />
//                     <span>Logout</span>
//                   </motion.button>
//                 </nav>
//               </motion.div>
//             </aside>

//             {/* Mobile Menu Button */}
//             <div className="lg:hidden mb-4">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//                 className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#C89B3C] text-white font-sans text-xs tracking-[0.1em] uppercase transition-all"
//               >
//                 {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
//                 Menu
//               </motion.button>
//             </div>

//             {/* Mobile Menu */}
//             <AnimatePresence>
//               {mobileMenuOpen && (
//                 <motion.div
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: 'auto' }}
//                   exit={{ opacity: 0, height: 0 }}
//                   transition={{ duration: 0.3 }}
//                   className="lg:hidden mb-6 space-y-2 col-span-1"
//                 >
//                   {menuItems.map((item) => {
//                     const Icon = item.icon
//                     const isActive = pathname === item.href
//                     return (
//                       <Link
//                         key={item.href}
//                         href={item.href}
//                         onClick={() => setMobileMenuOpen(false)}
//                         className={`flex items-center gap-3 px-4 py-3 rounded-md font-sans text-sm tracking-[0.05em] uppercase transition-all ${
//                           isActive
//                             ? 'bg-[#C89B3C] text-white shadow-md'
//                             : 'text-[#5B4B3F] bg-white/50 hover:bg-[#EFE3D3]'
//                         }`}
//                       >
//                         <Icon size={16} strokeWidth={1.5} />
//                         <span>{item.label}</span>
//                       </Link>
//                     )
//                   })}
//                   <button
//                     onClick={() => {
//                       handleLogout()
//                       setMobileMenuOpen(false)
//                     }}
//                     className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-[#7A1F1F] bg-white/50 font-sans text-sm tracking-[0.05em] uppercase transition-all"
//                   >
//                     <LogOut size={16} strokeWidth={1.5} />
//                     <span>Logout</span>
//                   </button>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* Content */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="lg:col-span-1"
//             >
//               {children}
//             </motion.div>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </main>
//   )
// }


'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation' 
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, Package, Heart, MapPin, Settings, LogOut, Home } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { useSelector, useDispatch } from 'react-redux'
import { authLogout, fetchCurrentUserThunk } from '@/redux/slice/authSlice/authSlice'
import { loginPathForCurrentLocation } from '@/lib/auth-redirect'

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/account' },
  { icon: User, label: 'My Profile', href: '/account/profile' },
  { icon: Package, label: 'Orders', href: '/account/orders' },
  { icon: Heart, label: 'Wishlist', href: '/account/wishlist' },
  { icon: MapPin, label: 'Addresses', href: '/account/addresses' },
  { icon: Settings, label: 'Settings', href: '/account/settings' },
]

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useDispatch<any>()
  const { data: user, isAuthenticated, hydrated: authHydrated } = useSelector((state: any) => state.auth)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  // Wait until client hydration completes before checking auth or altering DOM layouts.
  useEffect(() => {
    // This is an intentional client-only mount gate and is not a render loop.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || !authHydrated) return undefined
    if (isAuthenticated) {
      return undefined
    }

    let cancelled = false
    dispatch(fetchCurrentUserThunk())
      .unwrap()
      .catch(() => {
        if (!cancelled) router.push(loginPathForCurrentLocation())
      })
      .finally(() => {
        if (!cancelled) setAuthChecked(true)
      })

    return () => {
      cancelled = true
    }
  }, [authHydrated, dispatch, isAuthenticated, isMounted, router])

  const handleLogout = () => {
    dispatch(authLogout())
    router.push('/')
  }

  // Render a clean neutral shell structure during SSR to match the client perfectly
  if (!isMounted || !authHydrated || (!isAuthenticated && !authChecked)) {
    return (
      <main className="min-h-screen bg-[#F8F4EE] text-[#1E1A17]">
        <Navbar />
        <div className="pt-24">
          <div className="max-w-7xl mx-auto px-6 py-12 min-h-[60vh]" />
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F8F4EE] text-[#1E1A17]">
      <Navbar />

      <div className="pt-20 sm:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* User Card */}
                <div className="rounded-lg border border-[#C89B3C]/20 bg-white/70 backdrop-blur-sm p-5 shadow-sm">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C89B3C]/30 to-[#6B3E26]/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-[#C89B3C]">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-sans text-sm font-semibold tracking-[0.05em] uppercase">
                        {user?.name}
                      </h3>
                      <p className="text-xs text-[#5B4B3F] mt-1">{user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <motion.div
                        key={item.href}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 px-4 py-3 rounded-md font-sans text-sm tracking-[0.05em] uppercase transition-all duration-200 ${
                            isActive
                              ? 'bg-[#C89B3C] text-white shadow-md shadow-[#C89B3C]/20'
                              : 'text-[#5B4B3F] hover:bg-[#EFE3D3] hover:text-[#C89B3C]'
                          }`}
                        >
                          <Icon size={16} strokeWidth={1.5} />
                          <span>{item.label}</span>
                        </Link>
                      </motion.div>
                    )
                  })}

                  {/* Logout */}
                  <motion.button
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-[#7A1F1F] hover:bg-[#7A1F1F]/10 font-sans text-sm tracking-[0.05em] uppercase transition-all duration-200 mt-4 border-t border-[#D4C4B0] pt-4"
                  >
                    <LogOut size={16} strokeWidth={1.5} />
                    <span>Logout</span>
                  </motion.button>
                </nav>
              </motion.div>
            </aside>

            {/* Mobile Menu Button */}
            <div className="lg:hidden mb-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#C89B3C] text-white font-sans text-xs tracking-[0.1em] uppercase transition-all"
              >
                {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
                Menu
              </motion.button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="lg:hidden mb-6 space-y-2 col-span-1"
                >
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-md font-sans text-sm tracking-[0.05em] uppercase transition-all ${
                          isActive
                            ? 'bg-[#C89B3C] text-white shadow-md'
                            : 'text-[#5B4B3F] bg-white/50 hover:bg-[#EFE3D3]'
                        }`}
                      >
                        <Icon size={16} strokeWidth={1.5} />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-[#7A1F1F] bg-white/50 font-sans text-sm tracking-[0.05em] uppercase transition-all"
                  >
                    <LogOut size={16} strokeWidth={1.5} />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1"
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}