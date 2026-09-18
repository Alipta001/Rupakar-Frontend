'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Lock, Trash2 } from 'lucide-react'

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    orders: true,
    promotions: false,
  })

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl tracking-[-0.02em] mb-2" style={{ fontFamily: 'var(--font-cormorant)' }}>
          Settings
        </h1>
        <p className="text-[#5B4B3F] font-sans text-sm tracking-[0.05em]">
          Manage your account preferences and notifications
        </p>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-lg border border-[#C89B3C]/20 bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[#D4C4B0] flex items-center gap-3">
          <Bell size={20} className="text-[#C89B3C]" strokeWidth={1.5} />
          <h3 className="text-lg tracking-[-0.01em] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Notifications
          </h3>
        </div>

        <div className="px-6 py-6 space-y-4">
          {/* Email Notifications */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex items-center justify-between pb-4 border-b border-[#D4C4B0]"
          >
            <div>
              <h4 className="font-sans font-semibold text-sm tracking-[0.05em] uppercase mb-1">
                Email Notifications
              </h4>
              <p className="text-xs text-[#5B4B3F]">
                Receive updates via email
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => handleNotificationChange('email')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifications.email ? 'bg-[#C89B3C]' : 'bg-[#D4C4B0]'
              }`}
            >
              <motion.div
                animate={{ x: notifications.email ? 24 : 2 }}
                transition={{ duration: 0.3 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full"
              />
            </motion.button>
          </motion.div>

          {/* SMS Notifications */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-between pb-4 border-b border-[#D4C4B0]"
          >
            <div>
              <h4 className="font-sans font-semibold text-sm tracking-[0.05em] uppercase mb-1">
                SMS Notifications
              </h4>
              <p className="text-xs text-[#5B4B3F]">
                Receive updates via SMS
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => handleNotificationChange('sms')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifications.sms ? 'bg-[#C89B3C]' : 'bg-[#D4C4B0]'
              }`}
            >
              <motion.div
                animate={{ x: notifications.sms ? 24 : 2 }}
                transition={{ duration: 0.3 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full"
              />
            </motion.button>
          </motion.div>

          {/* Order Updates */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex items-center justify-between pb-4 border-b border-[#D4C4B0]"
          >
            <div>
              <h4 className="font-sans font-semibold text-sm tracking-[0.05em] uppercase mb-1">
                Order Updates
              </h4>
              <p className="text-xs text-[#5B4B3F]">
                Get notified about order status changes
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => handleNotificationChange('orders')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifications.orders ? 'bg-[#C89B3C]' : 'bg-[#D4C4B0]'
              }`}
            >
              <motion.div
                animate={{ x: notifications.orders ? 24 : 2 }}
                transition={{ duration: 0.3 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full"
              />
            </motion.button>
          </motion.div>

          {/* Promotional Emails */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-between"
          >
            <div>
              <h4 className="font-sans font-semibold text-sm tracking-[0.05em] uppercase mb-1">
                Promotional Emails
              </h4>
              <p className="text-xs text-[#5B4B3F]">
                Receive special offers and new collections
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => handleNotificationChange('promotions')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifications.promotions ? 'bg-[#C89B3C]' : 'bg-[#D4C4B0]'
              }`}
            >
              <motion.div
                animate={{ x: notifications.promotions ? 24 : 2 }}
                transition={{ duration: 0.3 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full"
              />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-lg border border-[#C89B3C]/20 bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[#D4C4B0] flex items-center gap-3">
          <Lock size={20} className="text-[#C89B3C]" strokeWidth={1.5} />
          <h3 className="text-lg tracking-[-0.01em] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Security
          </h3>
        </div>

        <div className="px-6 py-6 space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full text-left px-4 py-3 rounded-md hover:bg-[#F4E8D8] transition-colors"
          >
            <h4 className="font-sans font-semibold text-sm tracking-[0.05em] uppercase mb-1">
              Change Password
            </h4>
            <p className="text-xs text-[#5B4B3F]">
              Update your password regularly for security
            </p>
          </motion.button>

          <div className="border-t border-[#D4C4B0] pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-left px-4 py-3 rounded-md hover:bg-[#F4E8D8] transition-colors"
            >
              <h4 className="font-sans font-semibold text-sm tracking-[0.05em] uppercase mb-1">
                Two-Factor Authentication
              </h4>
              <p className="text-xs text-[#5B4B3F]">
                Add an extra layer of security
              </p>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="rounded-lg border-2 border-[#7A1F1F]/30 bg-[#7A1F1F]/5 shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[#7A1F1F]/20 flex items-center gap-3">
          <Trash2 size={20} className="text-[#7A1F1F]" strokeWidth={1.5} />
          <h3 className="text-lg tracking-[-0.01em] font-semibold text-[#7A1F1F]" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Danger Zone
          </h3>
        </div>

        <div className="px-6 py-6">
          <p className="text-sm text-[#5B4B3F] mb-4">
            Delete your account and all associated data. This action cannot be undone.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 bg-[#7A1F1F] hover:bg-[#6A1818] text-white rounded-md font-sans text-sm tracking-[0.1em] uppercase transition-all font-medium"
          >
            Delete Account
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
