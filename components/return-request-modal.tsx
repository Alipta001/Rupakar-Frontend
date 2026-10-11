'use client'

import { useState, useId } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, Package, ArrowRight, ShieldCheck, AlertCircle, RefreshCw, FileText } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createReturnRequest, ReturnItemEligibility } from '@/lib/customer-api'
import { getCustomerErrorMessage } from '@/lib/api-errors'
import { toast } from '@/hooks/use-toast'

interface ReturnRequestModalProps {
  orderId: string
  orderNumber?: string
  item: any
  eligibility: ReturnItemEligibility
  isOpen: boolean
  onClose: () => void
  onSuccess?: (createdReturn: any) => void
}

const RETURN_REASONS = [
  { value: 'DEFECTIVE', label: 'Defective or malfunctioning craft' },
  { value: 'DAMAGED', label: 'Damaged during transit / arrival' },
  { value: 'WRONG_ITEM', label: 'Received wrong item or variant' },
  { value: 'MISSING_PARTS', label: 'Missing parts or accessories' },
  { value: 'NOT_AS_DESCRIBED', label: 'Item does not match website description' },
  { value: 'QUALITY_ISSUE', label: 'Quality or finishing not as expected' },
  { value: 'SIZE_OR_FIT', label: 'Size or dimensions mismatch' },
  { value: 'PACKAGING_DAMAGED', label: 'Outer or inner packaging was broken' },
  { value: 'AUTHENTICITY_CONCERN', label: 'Craft authenticity concern' },
  { value: 'OTHER', label: 'Other reason' },
]

export default function ReturnRequestModal({
  orderId,
  orderNumber,
  item,
  eligibility,
  isOpen,
  onClose,
  onSuccess,
}: ReturnRequestModalProps) {
  const queryClient = useQueryClient()
  const baseId = useId()

  const maxReturnableQty = Math.max(1, eligibility?.remainingQuantity ?? 1)
  const [quantity, setQuantity] = useState<number>(1)
  const [reason, setReason] = useState<string>(RETURN_REASONS[0].value)
  const [type, setType] = useState<'RETURN' | 'REPLACEMENT'>('RETURN')
  const [description, setDescription] = useState<string>('')
  const [formError, setFormError] = useState<string>('')
  const [submittedReturn, setSubmittedReturn] = useState<any | null>(null)
  const [idempotencyKey] = useState<string>(
    () => `RUP-RET-${orderId}-${eligibility.variantId}-${Date.now()}`
  )

  const mutation = useMutation({
    mutationFn: async () => {
      setFormError('')
      if (quantity < 1 || quantity > maxReturnableQty) {
        throw new Error(`Quantity must be between 1 and ${maxReturnableQty}.`)
      }
      if (!reason || !reason.trim()) {
        throw new Error('Please select a valid return reason.')
      }

      return createReturnRequest(orderId, {
        items: [
          {
            variantId: eligibility.variantId,
            quantity,
            reason,
            notes: description.trim() || undefined,
          },
        ],
        type,
        vendorOrderId: eligibility.vendorOrderId || undefined,
        reason,
        description: description.trim() || undefined,
        idempotencyKey,
      })
    },
    onSuccess: (data) => {
      toast({
        title: type === 'REPLACEMENT' ? 'Replacement Requested' : 'Return Requested',
        description: 'Your request has been submitted for review.',
      })
      setSubmittedReturn(data)
      queryClient.invalidateQueries({ queryKey: ['order', orderId] })
      queryClient.invalidateQueries({ queryKey: ['order-return-eligibility', orderId] })
      queryClient.invalidateQueries({ queryKey: ['order-returns', orderId] })
      queryClient.invalidateQueries({ queryKey: ['customer-returns'] })
      if (onSuccess) onSuccess(data)
    },
    onError: (err: any) => {
      const msg = getCustomerErrorMessage(err, 'order')
      setFormError(msg)
    },
  })

  if (!isOpen) return null

  const unitPrice = eligibility.unitPrice || Number(item?.unitPrice ?? item?.price ?? 0)
  const estimatedRefund = unitPrice * quantity
  const imageUrl = item?.image || item?.productSnapshot?.image || (Array.isArray(item?.images) ? item.images[0] : null)

  const handleClose = () => {
    if (mutation.isPending) return
    setSubmittedReturn(null)
    setFormError('')
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.2 }}
          className="bg-[#FFFDF9] border border-[#C89B3C]/30 rounded-lg max-w-lg w-full p-6 shadow-2xl space-y-5 my-8 text-[#1E1A17]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#EFE3D3] pb-3">
            <div>
              <h2 className="text-xl tracking-[-0.01em] font-semibold text-[#1E1A17]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                {submittedReturn ? 'Request Submitted' : 'Request Return or Replacement'}
              </h2>
              <p className="text-[11px] font-sans text-[#5B4B3F]">
                Order #{orderNumber || orderId.slice(-8)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              disabled={mutation.isPending}
              className="text-[#5B4B3F] hover:text-[#1E1A17] p-1 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {submittedReturn ? (
            /* Success confirmation screen */
            <div className="space-y-5 py-2">
              <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded p-4 text-emerald-800">
                <CheckCircle size={22} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-sans font-semibold text-sm">
                    {submittedReturn.type === 'REPLACEMENT' ? 'Replacement Request Received' : 'Return Request Received'}
                  </p>
                  <p className="font-sans text-xs text-emerald-700">
                    Your request has been safely recorded under reference:
                  </p>
                  <p className="font-mono font-bold text-sm tracking-wider text-emerald-900 mt-1">
                    {submittedReturn.returnNumber || 'RUP-RET-REQUESTED'}
                  </p>
                </div>
              </div>

              <div className="bg-[#FAF6EF] border border-[#EFE3D3] rounded p-4 space-y-2 text-xs font-sans text-[#5B4B3F]">
                <div className="flex justify-between">
                  <span>Product:</span>
                  <span className="font-medium text-[#1E1A17] text-right">{eligibility.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span className="font-medium text-[#1E1A17]">{quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Resolution Type:</span>
                  <span className="font-medium text-[#1E1A17]">{submittedReturn.type || type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                    {String(submittedReturn.status || 'UNDER_REVIEW').replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Date Submitted:</span>
                  <span className="font-medium text-[#1E1A17]">
                    {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className="space-y-2 border-t border-[#EFE3D3] pt-4">
                <h4 className="text-xs font-semibold uppercase tracking-[0.05em] text-[#1E1A17]">What happens next?</h4>
                <ul className="text-xs text-[#5B4B3F] space-y-1.5 list-disc pl-4 font-sans">
                  <li>Our team and the verified artisan will review your reason and product details.</li>
                  <li>Once approved, you will be notified of return pickup instructions.</li>
                  <li>You can track the ongoing status of this request at any time under your Order Details.</li>
                </ul>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 bg-[#C89B3C] text-white font-sans text-xs tracking-[0.08em] uppercase rounded hover:bg-[#B7792B] transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Return request form */
            <div className="space-y-4">
              {/* Product preview */}
              <div className="flex items-center gap-3 bg-[#FAF6EF] border border-[#EFE3D3] rounded p-3">
                <div className="w-14 h-14 bg-[#EFE3D3] flex-shrink-0 overflow-hidden rounded">
                  {imageUrl ? (
                    <Image src={imageUrl} alt={eligibility.productName} width={56} height={56} className="w-full h-full object-cover" unoptimized />
                  ) : (
                    <Package size={20} className="m-4 text-[#A88D70]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-xs font-semibold text-[#1E1A17] truncate">{eligibility.productName}</p>
                  <p className="font-sans text-[11px] text-[#5B4B3F] mt-0.5">
                    Purchased: {eligibility.purchasedQuantity} · Returnable: <strong className="text-[#1E1A17]">{eligibility.remainingQuantity}</strong>
                  </p>
                  <p className="font-sans text-[11px] text-[#C89B3C] font-medium">₹{unitPrice.toLocaleString()} each</p>
                </div>
              </div>

              {/* Step 1: Select Quantity */}
              <div className="space-y-1">
                <label htmlFor={`${baseId}-qty`} className="text-xs font-sans uppercase tracking-[0.05em] text-[#5B4B3F]">
                  Return Quantity
                </label>
                <div className="flex items-center gap-3">
                  <select
                    id={`${baseId}-qty`}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-28 border border-[#D4C4B0] rounded p-2 text-sm text-[#1E1A17] bg-[#FAF8F5] focus:outline-none focus:border-[#C89B3C]"
                  >
                    {Array.from({ length: maxReturnableQty }, (_, idx) => idx + 1).map((val) => (
                      <option key={val} value={val}>
                        {val} {val === 1 ? 'item' : 'items'}
                      </option>
                    ))}
                  </select>
                  <span className="text-xs text-[#5B4B3F] font-sans">
                    Max eligible: {maxReturnableQty}
                  </span>
                </div>
              </div>

              {/* Step 2: Resolution Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-sans uppercase tracking-[0.05em] text-[#5B4B3F]">
                  Desired Resolution
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-start gap-2.5 p-3 rounded border cursor-pointer text-xs transition-colors ${
                      type === 'RETURN'
                        ? 'border-[#C89B3C] bg-[#FFF8EB] text-[#1E1A17]'
                        : 'border-[#D4C4B0] bg-[#FAF8F5] text-[#5B4B3F] hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="resolutionType"
                      value="RETURN"
                      checked={type === 'RETURN'}
                      onChange={() => setType('RETURN')}
                      className="mt-0.5 text-[#C89B3C] focus:ring-[#C89B3C]"
                    />
                    <div>
                      <p className="font-semibold text-xs">Return & Refund</p>
                      <p className="text-[11px] text-[#5B4B3F] mt-0.5">
                        Refund estimated: ₹{estimatedRefund.toLocaleString()}
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2.5 p-3 rounded border cursor-pointer text-xs transition-colors ${
                      type === 'REPLACEMENT'
                        ? 'border-[#C89B3C] bg-[#FFF8EB] text-[#1E1A17]'
                        : 'border-[#D4C4B0] bg-[#FAF8F5] text-[#5B4B3F] hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="resolutionType"
                      value="REPLACEMENT"
                      checked={type === 'REPLACEMENT'}
                      onChange={() => setType('REPLACEMENT')}
                      className="mt-0.5 text-[#C89B3C] focus:ring-[#C89B3C]"
                    />
                    <div>
                      <p className="font-semibold text-xs">Replacement</p>
                      <p className="text-[11px] text-[#5B4B3F] mt-0.5">
                        Subject to artisan stock review
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Step 3: Return Reason */}
              <div className="space-y-1">
                <label htmlFor={`${baseId}-reason`} className="text-xs font-sans uppercase tracking-[0.05em] text-[#5B4B3F]">
                  Reason for Return / Replace
                </label>
                <select
                  id={`${baseId}-reason`}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border border-[#D4C4B0] rounded p-2 text-sm text-[#1E1A17] bg-[#FAF8F5] focus:outline-none focus:border-[#C89B3C]"
                >
                  {RETURN_REASONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 4: Description */}
              <div className="space-y-1">
                <label htmlFor={`${baseId}-desc`} className="text-xs font-sans uppercase tracking-[0.05em] text-[#5B4B3F]">
                  Additional Details (Optional)
                </label>
                <textarea
                  id={`${baseId}-desc`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="Explain the defect, mismatch, or damage to assist with quick review..."
                  className="w-full border border-[#D4C4B0] rounded p-2 text-sm text-[#1E1A17] bg-[#FAF8F5] focus:outline-none focus:border-[#C89B3C]"
                />
                <p className="text-[10px] text-right text-[#5B4B3F]">{description.length}/500</p>
              </div>

              {/* Step 5: Evidence Note */}
              <div className="bg-[#F8F4EE] border border-[#EFE3D3] rounded p-2.5 text-[11px] text-[#5B4B3F] flex items-start gap-2">
                <ShieldCheck size={14} className="text-[#C89B3C] flex-shrink-0 mt-0.5" />
                <span>
                  Photo evidence upload is disabled for this phase. Please clearly describe any visible defect in the notes above.
                </span>
              </div>

              {formError && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2.5 rounded border border-red-200">
                  <AlertCircle size={14} className="flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EFE3D3]">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={mutation.isPending}
                  className="px-4 py-2 border border-[#D4C4B0] text-[#5B4B3F] text-xs font-sans uppercase rounded hover:bg-[#FAF8F5] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={mutation.isPending}
                  onClick={() => mutation.mutate()}
                  className="px-5 py-2 bg-[#C89B3C] text-white text-xs font-sans uppercase font-medium rounded hover:bg-[#B7792B] transition-colors disabled:opacity-60 flex items-center gap-2"
                >
                  {mutation.isPending ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      Submit {type === 'REPLACEMENT' ? 'Replacement' : 'Return'}
                      <ArrowRight size={13} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
