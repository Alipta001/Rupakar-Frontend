'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Edit2, Trash2, Plus } from 'lucide-react'
import { createAddress, deleteAddress, fetchAddresses, updateAddress } from '@/lib/customer-api'

interface AddressFormState {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2: string
  city: string
  district: string
  state: string
  postalCode: string
  country: string
  addressType: 'HOME' | 'WORK' | 'OTHER'
}

const emptyForm: AddressFormState = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  district: '',
  state: '',
  postalCode: '',
  country: 'India',
  addressType: 'HOME',
}

export default function AddressesPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<AddressFormState>(emptyForm)

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: fetchAddresses,
    retry: false,
  })

  const [formError, setFormError] = useState('')

  const createMutation = useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      setForm(emptyForm)
      setShowForm(false)
      setFormError('')
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.error?.message || err?.response?.data?.message || err?.message || 'Failed to save address'
      setFormError(msg)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
  })

  const typeConfig = {
    HOME: { icon: '🏠', label: 'Home' },
    WORK: { icon: '💼', label: 'Work' },
    OTHER: { icon: '📍', label: 'Other' },
  } as const

  const handleSubmit = async () => {
    setFormError('')
    if (!form.fullName.trim() || !form.addressLine1.trim() || !form.city.trim() || !form.state.trim() || !form.postalCode.trim()) {
      setFormError('Please fill in all required fields (Full Name, Address, City, State, Postal Code)')
      return
    }
    try {
      await createMutation.mutateAsync(form)
    } catch {
      // Error handled in onError
    }
  }

  const handleDelete = async (addressId: string) => {
    try {
      await deleteMutation.mutateAsync(addressId)
    } catch (err) {
      console.error('Failed to delete address', err)
    }
  }

  const handleChange = (field: keyof AddressFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl tracking-[-0.02em] mb-2" style={{ fontFamily: 'var(--font-cormorant)' }}>Saved Addresses</h1>
          <p className="text-[#5B4B3F] font-sans text-sm tracking-[0.05em]">Manage your delivery addresses</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-[#C89B3C] hover:bg-[#B7792B] text-white rounded-md font-sans text-xs tracking-[0.1em] uppercase transition-all font-medium">
          <Plus size={16} />
          Add Address
        </motion.button>
      </motion.div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="rounded-lg border border-[#C89B3C]/20 bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#D4C4B0]">
            <h3 className="text-lg tracking-[-0.01em] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>Add New Address</h3>
          </div>
          <div className="px-6 py-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-sans text-xs tracking-[0.1em] uppercase text-[#5B4B3F] mb-2">Full Name</label>
                <input value={form.fullName} onChange={(e) => handleChange('fullName', e.target.value)} type="text" placeholder="John Doe" className="w-full px-4 py-3 border border-[#D4C4B0] rounded-md font-sans text-sm focus:outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all" />
              </div>
              <div>
                <label className="block font-sans text-xs tracking-[0.1em] uppercase text-[#5B4B3F] mb-2">Phone Number</label>
                <input value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} type="tel" placeholder="+91 98765 43210" className="w-full px-4 py-3 border border-[#D4C4B0] rounded-md font-sans text-sm focus:outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all" />
              </div>
            </div>
            <div>
              <label className="block font-sans text-xs tracking-[0.1em] uppercase text-[#5B4B3F] mb-2">Address Line 1</label>
              <input value={form.addressLine1} onChange={(e) => handleChange('addressLine1', e.target.value)} type="text" placeholder="123 Artisan Street" className="w-full px-4 py-3 border border-[#D4C4B0] rounded-md font-sans text-sm focus:outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all" />
            </div>
            <div>
              <label className="block font-sans text-xs tracking-[0.1em] uppercase text-[#5B4B3F] mb-2">Address Line 2</label>
              <input value={form.addressLine2} onChange={(e) => handleChange('addressLine2', e.target.value)} type="text" placeholder="Apartment / Landmark" className="w-full px-4 py-3 border border-[#D4C4B0] rounded-md font-sans text-sm focus:outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-sans text-xs tracking-[0.1em] uppercase text-[#5B4B3F] mb-2">City</label>
                <input value={form.city} onChange={(e) => handleChange('city', e.target.value)} type="text" placeholder="Bangalore" className="w-full px-4 py-3 border border-[#D4C4B0] rounded-md font-sans text-sm focus:outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all" />
              </div>
              <div>
                <label className="block font-sans text-xs tracking-[0.1em] uppercase text-[#5B4B3F] mb-2">District</label>
                <input value={form.district} onChange={(e) => handleChange('district', e.target.value)} type="text" placeholder="Bengaluru Urban" className="w-full px-4 py-3 border border-[#D4C4B0] rounded-md font-sans text-sm focus:outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all" />
              </div>
              <div>
                <label className="block font-sans text-xs tracking-[0.1em] uppercase text-[#5B4B3F] mb-2">State</label>
                <input value={form.state} onChange={(e) => handleChange('state', e.target.value)} type="text" placeholder="Karnataka" className="w-full px-4 py-3 border border-[#D4C4B0] rounded-md font-sans text-sm focus:outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-sans text-xs tracking-[0.1em] uppercase text-[#5B4B3F] mb-2">Postal Code</label>
                <input value={form.postalCode} onChange={(e) => handleChange('postalCode', e.target.value)} type="text" placeholder="560001" className="w-full px-4 py-3 border border-[#D4C4B0] rounded-md font-sans text-sm focus:outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all" />
              </div>
              <div>
                <label className="block font-sans text-xs tracking-[0.1em] uppercase text-[#5B4B3F] mb-2">Address Type</label>
                <select value={form.addressType} onChange={(e) => handleChange('addressType', e.target.value as AddressFormState['addressType'])} className="w-full px-4 py-3 border border-[#D4C4B0] rounded-md font-sans text-sm focus:outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all">
                  <option value="HOME">Home</option>
                  <option value="WORK">Work</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-sans rounded-md">
                {formError}
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSubmit} disabled={createMutation.isPending} className="px-6 py-2.5 bg-[#C89B3C] hover:bg-[#B7792B] text-white rounded-md font-sans text-sm tracking-[0.1em] uppercase transition-all font-medium disabled:opacity-60">
                {createMutation.isPending ? 'Saving…' : 'Save Address'}
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowForm(false)} className="px-6 py-2.5 border border-[#D4C4B0] hover:bg-[#F4E8D8] text-[#1E1A17] rounded-md font-sans text-sm tracking-[0.1em] uppercase transition-all">Cancel</motion.button>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="space-y-4">
        {isLoading ? (
          <div className="text-sm text-[#5B4B3F]">Loading addresses…</div>
        ) : addresses.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#D4C4B0] bg-white/30 p-6 text-center text-[#5B4B3F]">No addresses saved yet.</div>
        ) : (
          addresses.map((address, index) => {
            const addressType = (address.addressType ?? 'HOME') as keyof typeof typeConfig
            const type = typeConfig[addressType] ?? typeConfig.HOME
            const isDefault = Boolean(address.isDefaultShipping || address.isDefaultBilling)
            return (
              <motion.div key={address._id ?? address.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }} className={`rounded-lg border-2 p-6 shadow-sm hover:shadow-md transition-all ${isDefault ? 'border-[#C89B3C] bg-gradient-to-br from-white/80 to-[#F4E8D8]/30' : 'border-[#D4C4B0] bg-white/70 backdrop-blur-sm'}`}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{type.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold tracking-[-0.01em]" style={{ fontFamily: 'var(--font-cormorant)' }}>{address.fullName}</h3>
                      {isDefault && <span className="inline-block px-2 py-1 mt-1 text-[10px] font-sans tracking-[0.05em] uppercase bg-[#C89B3C]/15 text-[#C89B3C] rounded-md">Default Address</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="p-2 rounded-md hover:bg-[#EFE3D3] transition-colors">
                      <Edit2 size={16} className="text-[#C89B3C]" strokeWidth={1.5} />
                    </motion.button>
                    <motion.button onClick={() => handleDelete(address._id ?? address.id)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="p-2 rounded-md hover:bg-[#EFE3D3] transition-colors">
                      <Trash2 size={16} className="text-[#7A1F1F]" strokeWidth={1.5} />
                    </motion.button>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-[#5B4B3F]">
                  <p className="font-sans">{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}</p>
                  <p className="font-sans">{address.city}, {address.state} {address.postalCode}</p>
                  <p className="font-sans">{address.phone}</p>
                </div>
              </motion.div>
            )
          })
        )}
      </motion.div>
    </div>
  )
}
