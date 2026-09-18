'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Camera, Save, CheckCircle2, AlertCircle, Lock } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { updateProfileThunk } from '@/redux/slice/authSlice/authSlice'
import { fetchCurrentUser, changePassword } from '@/lib/customer-api'

export default function ProfilePage() {
  const dispatch = useDispatch<any>()
  const queryClient = useQueryClient()
  const { data: reduxUser } = useSelector((state: any) => state.auth)

  const { data: apiUser, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchCurrentUser,
    staleTime: 30 * 1000,
  })

  const user = apiUser || reduxUser

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({
    type: '',
    text: '',
  })

  const profileDefaults = {
    name: user?.name || user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || user?.phoneNumber || '',
  }
  const [formDataOverride, setFormDataOverride] = useState<typeof profileDefaults | null>(null)
  const formData = formDataOverride ?? profileDefaults

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error' | ''; text: string }>({
    type: '',
    text: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormDataOverride((prev) => ({ ...(prev ?? profileDefaults), [name]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setStatusMessage({ type: '', text: '' })

    try {
      await dispatch(
        updateProfileThunk({
          name: formData.name,
          phone: formData.phone,
        }),
      ).unwrap()

      queryClient.invalidateQueries({ queryKey: ['profile'] })
      setStatusMessage({ type: 'success', text: 'Profile details updated successfully!' })
      setIsEditing(false)
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || err || 'Failed to update profile details',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordStatus({ type: '', text: '' })

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordStatus({ type: 'error', text: 'Please fill in all password fields' })
      return
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordStatus({ type: 'error', text: 'New password must be at least 8 characters' })
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ type: 'error', text: 'New passwords do not match' })
      return
    }

    setIsChangingPassword(true)
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      setPasswordStatus({ type: 'success', text: 'Password updated successfully!' })
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message || err?.response?.data?.message || 'Failed to update password'
      setPasswordStatus({ type: 'error', text: msg })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const userInitial = (user?.name || user?.firstName || 'U').charAt(0).toUpperCase()

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl md:text-4xl tracking-[-0.02em] mb-2" style={{ fontFamily: 'var(--font-cormorant)' }}>
          My Profile
        </h1>
        <p className="text-[#5B4B3F] font-sans text-sm tracking-[0.05em]">
          Manage your personal information, contact details, and account security
        </p>
      </motion.div>

      {/* Status notification */}
      {statusMessage.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-md flex items-center gap-3 text-sm font-sans ${
            statusMessage.type === 'success'
              ? 'bg-[#EFE7D8] border border-[#C89B3C]/40 text-[#6B3E26]'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 size={18} className="text-[#C89B3C]" />
          ) : (
            <AlertCircle size={18} className="text-red-500" />
          )}
          <span>{statusMessage.text}</span>
        </motion.div>
      )}

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-lg border border-[#C89B3C]/20 bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden"
      >
        {/* Avatar Section */}
        <div className="px-6 py-8 border-b border-[#D4C4B0]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#C89B3C]/30 to-[#6B3E26]/20 flex items-center justify-center border-4 border-[#C89B3C]/20">
                {user?.avatar ? (
                  <Image
                    src={user.avatar || user.profileImage}
                    alt={user.name || 'User'}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-4xl font-bold text-[#C89B3C]">{userInitial}</span>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute bottom-0 right-0 bg-[#C89B3C] text-white p-2 rounded-full shadow-lg"
              >
                <Camera size={16} />
              </motion.button>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                {user?.name || user?.fullName || 'Valued Patron'}
              </h2>
              <p className="text-[#5B4B3F] font-sans text-sm mt-1">{user?.email}</p>
              {user?.phone && <p className="text-[#5B4B3F] font-sans text-xs mt-1">Phone: {user.phone}</p>}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsEditing(!isEditing)
                setStatusMessage({ type: '', text: '' })
              }}
              className="px-4 py-2 bg-[#C89B3C] hover:bg-[#B7792B] text-white rounded-md font-sans text-xs tracking-[0.1em] uppercase transition-all font-medium whitespace-nowrap"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </motion.button>
          </div>
        </div>

        {/* Information Form */}
        <div className="px-6 py-8 space-y-6">
          {/* Full Name */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.15 }}>
            <label className="block font-sans text-xs tracking-[0.1em] uppercase text-[#5B4B3F] mb-2">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-[#D4C4B0] rounded-md font-sans text-sm focus:outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all bg-white"
              />
            ) : (
              <p className="text-base text-[#1E1A17] font-sans">{formData.name || '—'}</p>
            )}
          </motion.div>

          {/* Email Address (read-only) */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <label className="block font-sans text-xs tracking-[0.1em] uppercase text-[#5B4B3F] mb-2">
              Email Address
            </label>
            <p className="text-base text-[#1E1A17] font-sans">{formData.email || '—'}</p>
            <p className="text-xs text-[#5B4B3F]/70 font-sans mt-1">Email is verified with your account.</p>
          </motion.div>

          {/* Phone Number */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.25 }}>
            <label className="block font-sans text-xs tracking-[0.1em] uppercase text-[#5B4B3F] mb-2">
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-4 py-3 border border-[#D4C4B0] rounded-md font-sans text-sm focus:outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all bg-white"
              />
            ) : (
              <p className="text-base text-[#1E1A17] font-sans">{formData.phone || 'No phone number added'}</p>
            )}
          </motion.div>

          {/* Save Button */}
          {isEditing && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              disabled={isSaving}
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-[#C89B3C] hover:bg-[#B7792B] text-white rounded-md font-sans text-sm tracking-[0.1em] uppercase transition-all font-medium disabled:opacity-60"
            >
              <Save size={16} />
              {isSaving ? 'Saving Changes…' : 'Save Changes'}
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Password Change Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="rounded-lg border border-[#C89B3C]/20 bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[#D4C4B0] flex items-center gap-3">
          <Lock size={18} className="text-[#C89B3C]" />
          <h3 className="text-lg tracking-[-0.01em] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Security & Password
          </h3>
        </div>

        <form onSubmit={handlePasswordChange} className="px-6 py-6 space-y-4">
          {passwordStatus.text && (
            <div
              className={`p-3 rounded-md text-xs font-sans flex items-center gap-2 ${
                passwordStatus.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {passwordStatus.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              <span>{passwordStatus.text}</span>
            </div>
          )}

          <div>
            <label className="block font-sans text-xs tracking-[0.1em] uppercase text-[#5B4B3F] mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
              placeholder="Enter current password"
              className="w-full px-4 py-3 border border-[#D4C4B0] rounded-md font-sans text-sm focus:outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all bg-white"
            />
          </div>

          <div>
            <label className="block font-sans text-xs tracking-[0.1em] uppercase text-[#5B4B3F] mb-2">
              New Password
            </label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
              placeholder="Min. 8 characters"
              className="w-full px-4 py-3 border border-[#D4C4B0] rounded-md font-sans text-sm focus:outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all bg-white"
            />
          </div>

          <div>
            <label className="block font-sans text-xs tracking-[0.1em] uppercase text-[#5B4B3F] mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
              placeholder="Re-enter new password"
              className="w-full px-4 py-3 border border-[#D4C4B0] rounded-md font-sans text-sm focus:outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all bg-white"
            />
          </div>

          <motion.button
            type="submit"
            disabled={isChangingPassword}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-3 bg-[#C89B3C] hover:bg-[#B7792B] text-white rounded-md font-sans text-xs tracking-[0.1em] uppercase transition-all font-medium disabled:opacity-60"
          >
            {isChangingPassword ? 'Updating Password…' : 'Update Password'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}
