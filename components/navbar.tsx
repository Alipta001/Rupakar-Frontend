'use client'

import { useState, useEffect, useSyncExternalStore } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, useScroll, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Search, Menu, X, Heart, User, ChevronDown } from 'lucide-react'
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

const emptySubscribe = () => () => {}

export default function Navbar() {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false)
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
    enabled: Boolean(isAuthenticated),
  })
  const { data: wishlistData } = useQuery({
    queryKey: ['wishlist'],
    queryFn: fetchWishlist,
    staleTime: 60 * 1000,
    enabled: Boolean(isAuthenticated),
  })
  const cartCount = cartData?.itemCount ?? (Array.isArray(cartData?.items) ? cartData.items.reduce((s: number, i: any) => s + Number(i.quantity ?? 1), 0) : 0)
  const wishlistCount = Array.isArray(wishlistData?.items) ? wishlistData.items.length : 0

  // Active Logout Handler for Redux State Clearance
  const handleLogout = () => {
    dispatch(authLogout())
    setAccountDropdownOpen(false)
    setMobileOpen(false)
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
            : 'bg-[#1E1A17]/95 backdrop-blur-md shadow-lg shadow-black/20 py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 text-left sm:text-center"
            >
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[#C89B3C]/30 bg-white/5 shadow-sm">
                <Image src="/Rupakar-logo.jpeg" alt="Rupakar logo" fill className="object-cover" priority />
              </div>
              <div>
                <span
                  className="block text-[#F8F4EE] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-lg sm:text-xl font-normal"
                  style={{ fontFamily: 'var(--font-italiana), serif' }}
                >
                  Rupakar
                </span>
                <span className="block text-[#C89B3C] tracking-[0.25em] sm:tracking-[0.35em] uppercase text-[8px] sm:text-[9px] mt-0.5 font-sans">
                  Artisan Marketplace
                </span>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Left Nav */}
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

          {/* Right Nav - Icons & Auth & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search */}
            {isAuthenticated && <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/search')}
              className="p-2 text-[#F8F4EE]/80 hover:text-[#C89B3C] transition-colors duration-300 min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Search"
            >
              <Search size={18} strokeWidth={1.5} />
            </motion.button>}

            {/* Wishlist */}
            {isAuthenticated && <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/wishlist')}
              className="p-2 text-[#F8F4EE]/80 hover:text-[#C89B3C] transition-colors duration-300 relative min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Wishlist"
            >
              <Heart size={18} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#7A1F1F] text-[#F8F4EE] text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </motion.button>}

            {/* Cart */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/cart')}
              className="p-2 text-[#F8F4EE]/80 hover:text-[#C89B3C] transition-colors duration-300 relative min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Cart"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#C89B3C] text-[#1E1A17] text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </motion.button>

            {/* Auth Section - Desktop */}
            {mounted && (
              <>
                {isAuthenticated && user ? (
                  <div className="relative hidden sm:block">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                      className="flex items-center gap-2 px-3 py-2 border border-[#C89B3C]/30 text-[#F8F4EE] hover:bg-[#C89B3C]/10 hover:text-[#C89B3C] rounded-md uppercase tracking-[0.1em] text-[10px] transition-all duration-300 min-h-[38px]"
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
                    <AccountDropdown isOpen={accountDropdownOpen} onClose={() => setAccountDropdownOpen(false)} />
                  </div>
                ) : (
                  <div className="hidden sm:flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push('/login')}
                      className="px-4 py-2 text-[#C89B3C] hover:text-[#F8F4EE] border border-[#C89B3C] hover:bg-[#C89B3C] hover:border-[#C89B3C] rounded-md font-sans text-xs tracking-[0.1em] uppercase transition-all duration-300 min-h-[38px]"
                    >
                      Login
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push('/register')}
                      className="px-4 py-2 bg-[#C89B3C] hover:bg-[#B7792B] text-[#1E1A17] rounded-md font-sans text-xs tracking-[0.1em] uppercase transition-all duration-300 font-medium min-h-[38px]"
                    >
                      Register
                    </motion.button>
                  </div>
                )}
              </>
            )}

            {/* Mobile Hamburger Menu Toggle Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-[#F8F4EE]/90 hover:text-[#C89B3C] focus:outline-none min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-[#C89B3C]/20 bg-[#1E1A17]/98 backdrop-blur-xl mt-3 px-6 py-5 space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto"
            >
              {/* Collections with Sub-categories */}
              <div>
                <button
                  onClick={() => setMobileCollectionsOpen(!mobileCollectionsOpen)}
                  className="w-full flex items-center justify-between text-[#F8F4EE]/90 hover:text-[#C89B3C] font-sans text-xs tracking-[0.15em] uppercase py-2.5 transition-colors"
                >
                  <span>Collections</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 text-[#C89B3C] ${mobileCollectionsOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {mobileCollectionsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-4 py-2 space-y-2 border-l border-[#C89B3C]/20 ml-2"
                    >
                      <Link
                        href="/collections"
                        onClick={() => setMobileOpen(false)}
                        className="block text-[#C89B3C] font-sans text-xs tracking-[0.1em] uppercase py-1.5"
                      >
                        All Collections →
                      </Link>
                      {['Terracotta', 'Folk Art', 'Home Decor', 'Jewelry', 'Textiles'].map((item) => (
                        <Link
                          key={item}
                          href={`/collections/${item.toLowerCase().replace(' ', '-')}`}
                          onClick={() => setMobileOpen(false)}
                          className="block text-[#F8F4EE]/70 hover:text-[#C89B3C] font-sans text-xs tracking-[0.1em] uppercase py-1.5"
                        >
                          {item}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Other Navigation Links */}
              <Link
                href="/artisans"
                onClick={() => setMobileOpen(false)}
                className="block text-[#F8F4EE]/90 hover:text-[#C89B3C] font-sans text-xs tracking-[0.15em] uppercase py-2.5 transition-colors border-t border-[#C89B3C]/10"
              >
                Artisans
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className="block text-[#F8F4EE]/90 hover:text-[#C89B3C] font-sans text-xs tracking-[0.15em] uppercase py-2.5 transition-colors border-t border-[#C89B3C]/10"
              >
                About
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="block text-[#F8F4EE]/90 hover:text-[#C89B3C] font-sans text-xs tracking-[0.15em] uppercase py-2.5 transition-colors border-t border-[#C89B3C]/10"
              >
                Contact
              </Link>

              {/* Quick Links: Wishlist & Cart in Mobile Menu */}
              {isAuthenticated && <div className="pt-2 border-t border-[#C89B3C]/20 space-y-2">
                <Link
                  href="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between text-[#F8F4EE]/90 hover:text-[#C89B3C] font-sans text-xs tracking-[0.15em] uppercase py-2.5"
                >
                  <span className="flex items-center gap-2">
                    <Heart size={14} className="text-[#C89B3C]" />
                    Saved Pieces (Wishlist)
                  </span>
                  {wishlistCount > 0 && (
                    <span className="px-2 py-0.5 bg-[#7A1F1F] text-white text-[10px] font-bold rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between text-[#F8F4EE]/90 hover:text-[#C89B3C] font-sans text-xs tracking-[0.15em] uppercase py-2.5"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag size={14} className="text-[#C89B3C]" />
                    Shopping Bag
                  </span>
                  {cartCount > 0 && (
                    <span className="px-2 py-0.5 bg-[#C89B3C] text-[#1E1A17] text-[10px] font-bold rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>}

              {/* Mobile Auth Layout */}
              {mounted && (
                <div className="pt-3 border-t border-[#C89B3C]/20">
                  {isAuthenticated && user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-[#C89B3C]/20">
                        <div className="w-8 h-8 rounded-full bg-[#C89B3C]/20 flex items-center justify-center text-[#C89B3C] font-bold text-xs">
                          {user.firstName?.charAt(0) || user.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-sans text-xs font-semibold text-[#F8F4EE] uppercase tracking-wider">{user.name || 'Collector'}</p>
                          <p className="text-[10px] text-[#5B4B3F] text-white/60">{user.email}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href="/account/orders"
                          onClick={() => setMobileOpen(false)}
                          className="px-3 py-2.5 text-center bg-white/5 hover:bg-white/10 text-[#F8F4EE] border border-[#C89B3C]/20 rounded-md font-sans text-xs tracking-[0.1em] uppercase transition-colors"
                        >
                          My Orders
                        </Link>
                        <Link
                          href="/account/profile"
                          onClick={() => setMobileOpen(false)}
                          className="px-3 py-2.5 text-center bg-white/5 hover:bg-white/10 text-[#F8F4EE] border border-[#C89B3C]/20 rounded-md font-sans text-xs tracking-[0.1em] uppercase transition-colors"
                        >
                          Profile
                        </Link>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="w-full text-center py-2.5 text-[#E57373] hover:text-[#EF5350] font-sans text-xs tracking-[0.1em] uppercase transition-colors border border-[#7A1F1F]/30 rounded-md bg-[#7A1F1F]/10"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          router.push('/login')
                          setMobileOpen(false)
                        }}
                        className="flex-1 py-3 text-center text-[#C89B3C] border border-[#C89B3C] hover:bg-[#C89B3C] hover:text-[#1E1A17] rounded-md font-sans text-xs tracking-[0.1em] uppercase transition-all font-semibold"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => {
                          router.push('/register')
                          setMobileOpen(false)
                        }}
                        className="flex-1 py-3 text-center bg-[#C89B3C] hover:bg-[#B7792B] text-[#1E1A17] rounded-md font-sans text-xs tracking-[0.1em] uppercase transition-all font-semibold"
                      >
                        Register
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  )
}