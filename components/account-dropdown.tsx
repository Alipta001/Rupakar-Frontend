'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, User, Package, Heart, MapPin, Settings } from 'lucide-react'
import { authLogout } from '@/redux/slice/authSlice/authSlice'
import { useRouter } from 'next/navigation'

interface AccountDropdownProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { icon: User, label: 'My Profile', href: '/account/profile' },
  { icon: Package, label: 'Orders', href: '/account/orders' },
  { icon: Heart, label: 'Wishlist', href: '/account/wishlist' },
  { icon: MapPin, label: 'Addresses', href: '/account/addresses' },
  { icon: Settings, label: 'Settings', href: '/account/settings' },
]

export function AccountDropdown({ isOpen, onClose }: AccountDropdownProps) {
  const dispatch = useDispatch<any>()
  const { data: user } = useSelector((state: any) => state.auth)
  const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  const handleLogout = () => {
    dispatch(authLogout())
    router.push('/login')
    onClose()
  }

  return (
    <div ref={dropdownRef} className="relative">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30"
              onClick={onClose}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute right-0 top-full mt-3 w-64 z-40"
            >
              {/* Premium glassmorphic card */}
              <div className="relative rounded-lg overflow-hidden shadow-2xl shadow-black/30">
                {/* Background with blur */}
                <div className="absolute inset-0 bg-[#1E1A17]/95 backdrop-blur-md border border-[#C89B3C]/20" />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#C89B3C]/5 via-transparent to-transparent" />

                {/* Content */}
                <div className="relative p-4 space-y-3">
                  {/* User header */}
                  <div className="pb-3 mb-3 border-b border-[#C89B3C]/15 flex items-center gap-3">
                    {user?.avatar && (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[#F8F4EE] font-sans text-xs tracking-[0.1em] uppercase truncate">
                        {user?.name}
                      </p>
                      <p className="text-[#C89B3C]/80 font-sans text-[10px] truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Menu items */}
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[#F8F4EE]/80 hover:text-[#C89B3C] hover:bg-[#C89B3C]/10 transition-all duration-200 group"
                      >
                        <Icon size={16} strokeWidth={1.5} className="text-[#C89B3C]/70 group-hover:text-[#C89B3C] transition-colors" />
                        <span className="font-sans text-xs tracking-[0.1em] uppercase flex-1">
                          {item.label}
                        </span>
                      </Link>
                    )
                  })}

                  {/* Logout button */}
                  <div className="pt-2 mt-3 border-t border-[#C89B3C]/15">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[#F8F4EE]/80 hover:text-[#7A1F1F] hover:bg-[#7A1F1F]/10 transition-all duration-200 group"
                    >
                      <LogOut size={16} strokeWidth={1.5} className="text-[#C89B3C]/70 group-hover:text-[#7A1F1F] transition-colors" />
                      <span className="font-sans text-xs tracking-[0.1em] uppercase flex-1">
                        Logout
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
