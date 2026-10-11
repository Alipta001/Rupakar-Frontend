'use client'

import { use, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  FileText,
  Calendar,
  IndianRupee,
} from 'lucide-react'
import {
  fetchReturnDetail,
  cancelReturnRequest,
  submitReturnPayoutDetails,
  fetchReturnSupportTickets,
  createReturnSupportTicket,
} from '@/lib/customer-api'
import { getCustomerErrorMessage } from '@/lib/api-errors'
import { toast } from '@/hooks/use-toast'

interface Props {
  params: Promise<{ id: string }>
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string; icon: any; description: string }
> = {
  REQUESTED: {
    label: 'Requested',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: Clock,
    description: 'Your return request has been submitted and is awaiting initial review.',
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: Clock,
    description: 'Our artisan fulfillment team is currently reviewing your request details.',
  },
  APPROVED: {
    label: 'Approved',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: CheckCircle,
    description: 'Your request has been approved. Return processing is in progress.',
  },
  RETURN_RECEIVED: {
    label: 'Return Received',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    icon: Package,
    description: 'Your returned package has been physically received at the facility.',
  },
  INSPECTION_PENDING: {
    label: 'Quality Inspection',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: Clock,
    description: 'Returned items are undergoing physical quality inspection.',
  },
  INSPECTION_PASSED: {
    label: 'Inspection Completed',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: CheckCircle,
    description: 'Quality inspection passed. Final processing is underway.',
  },
  INSPECTION_FAILED: {
    label: 'Inspection Under Review',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: AlertCircle,
    description: 'Inspection notes recorded. Under administrative review.',
  },
  DISPOSITION_PENDING: {
    label: 'Processing Return',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    icon: RefreshCw,
    description: 'Returned items are being processed for final resolution.',
  },
  DISPOSITION_COMPLETED: {
    label: 'Return Processed',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: CheckCircle,
    description: 'Inspection and disposition processing have been completed.',
  },
  APPROVED_FOR_REFUND: {
    label: 'Refund Approved',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: CheckCircle,
    description: 'Your return has been approved for refund.',
  },
  REFUND_PENDING: {
    label: 'Refund Pending',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: Clock,
    description: 'Refund execution has been queued.',
  },
  REFUND_PROCESSING: {
    label: 'Refund Processing',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: RefreshCw,
    description: 'Refund is currently processing with your payment provider.',
  },
  REFUNDED: {
    label: 'Refund Completed',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: CheckCircle,
    description: 'Your refund has been completed successfully.',
  },
  REFUND_FAILED: {
    label: 'Refund Failed',
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: AlertCircle,
    description: 'Refund failed — please contact support.',
  },
  MANUAL_PAYOUT_PENDING: {
    label: 'Refund Payout Pending',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: Clock,
    description: 'Refund approved. Payout is awaiting disbursement details.',
  },
  MANUAL_PAYOUT_PROCESSING: {
    label: 'Refund Payout Processing',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: RefreshCw,
    description: 'Your refund payout is being processed by our finance team.',
  },
  REJECTED: {
    label: 'Rejected',
    color: 'text-stone-700',
    bg: 'bg-stone-100',
    border: 'border-stone-300',
    icon: XCircle,
    description: 'This return request could not be approved.',
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: XCircle,
    description: 'This return request was cancelled.',
  },
  REPLACEMENT_PENDING: {
    label: 'Replacement Approved',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: RefreshCw,
    description: 'Your replacement request is approved and your replacement order is being prepared.',
  },
  REPLACEMENT_SHIPPED: {
    label: 'Replacement Shipped',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    icon: Package,
    description: 'Your replacement item has been dispatched and is on its way.',
  },
  REPLACEMENT_DELIVERED: {
    label: 'Replacement Delivered',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: CheckCircle,
    description: 'Your replacement order has been successfully delivered.',
  },
}

export default function ReturnDetailPage({ params }: Props) {
  const { id } = use(params)
  const queryClient = useQueryClient()
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState('Customer cancelled request')

  const { data: returnDoc, isLoading, error, refetch } = useQuery({
    queryKey: ['return-detail', id],
    queryFn: () => fetchReturnDetail(id),
    retry: false,
  })

  const cancelMutation = useMutation({
    mutationFn: () => cancelReturnRequest(id, cancelReason),
    onSuccess: () => {
      toast({
        title: 'Return Cancelled',
        description: 'Your return request has been cancelled.',
      })
      setCancelModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['return-detail', id] })
      queryClient.invalidateQueries({ queryKey: ['customer-returns'] })
    },
    onError: (err: any) => {
      const msg = getCustomerErrorMessage(err, 'order')
      toast({
        variant: 'destructive',
        title: 'Cancellation Failed',
        description: msg,
      })
    },
  })

  const [payoutMethod, setPayoutMethod] = useState<'UPI' | 'BANK_ACCOUNT'>('UPI')
  const [upiId, setUpiId] = useState('')
  const [accountHolderName, setAccountHolderName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [ifscCode, setIfscCode] = useState('')
  const [bankName, setBankName] = useState('')
  const [payoutModalOpen, setPayoutModalOpen] = useState(false)

  const payoutMutation = useMutation({
    mutationFn: () =>
      submitReturnPayoutDetails(id, {
        method: payoutMethod,
        upiId: payoutMethod === 'UPI' ? upiId.trim() : undefined,
        accountHolderName: payoutMethod === 'BANK_ACCOUNT' ? accountHolderName.trim() : undefined,
        accountNumber: payoutMethod === 'BANK_ACCOUNT' ? accountNumber.trim() : undefined,
        ifscCode: payoutMethod === 'BANK_ACCOUNT' ? ifscCode.trim().toUpperCase() : undefined,
        bankName: payoutMethod === 'BANK_ACCOUNT' && bankName.trim() ? bankName.trim() : undefined,
      }),
    onSuccess: () => {
      toast({
        title: 'Payout Details Saved',
        description: 'Your payout details have been securely recorded for refund processing.',
      })
      setPayoutModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['return-detail', id] })
    },
    onError: (err: any) => {
      const msg = getCustomerErrorMessage(err, 'order')
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: msg,
      })
    },
  })

  const [supportModalOpen, setSupportModalOpen] = useState(false)
  const [ticketCategory, setTicketCategory] = useState('RETURN')
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketMessage, setTicketMessage] = useState('')

  const { data: supportTicketsData } = useQuery({
    queryKey: ['return-support-tickets', id],
    queryFn: () => fetchReturnSupportTickets(id),
    enabled: Boolean(id),
  })

  const returnTickets = supportTicketsData?.items || (Array.isArray(supportTicketsData) ? supportTicketsData : [])

  const createTicketMutation = useMutation({
    mutationFn: () =>
      createReturnSupportTicket({
        returnId: id,
        category: ticketCategory,
        subject: ticketSubject.trim(),
        message: ticketMessage.trim(),
      }),
    onSuccess: (data: any) => {
      toast({
        title: 'Support Ticket Created',
        description: `Ticket #${data?.ticketNumber || 'created'} has been submitted. Our team will assist you shortly.`,
      })
      setSupportModalOpen(false)
      setTicketSubject('')
      setTicketMessage('')
      queryClient.invalidateQueries({ queryKey: ['return-support-tickets', id] })
    },
    onError: (err: any) => {
      toast({
        variant: 'destructive',
        title: 'Failed to create ticket',
        description: getCustomerErrorMessage(err, 'general') || 'Could not create support ticket',
      })
    },
  })

  if (isLoading) {
    return (
      <div className="py-16 text-center space-y-3">
        <RefreshCw size={24} className="mx-auto animate-spin text-[#C89B3C]" />
        <p className="font-sans text-xs text-[#5B4B3F]">Loading return details…</p>
      </div>
    )
  }

  if (error || !returnDoc) {
    return (
      <div className="py-16 text-center space-y-4">
        <AlertCircle size={36} className="mx-auto text-[#7A1F1F]/60" />
        <p className="font-sans text-sm text-[#1E1A17] font-medium">Return request not found.</p>
        <Link href="/account/orders" className="inline-block text-[#C89B3C] font-sans text-xs underline">
          ← Back to Orders
        </Link>
      </div>
    )
  }

  const rawStatus = String(returnDoc.status || 'REQUESTED').toUpperCase()
  const statusInfo = STATUS_CONFIG[rawStatus] || {
    label: rawStatus.replace('_', ' '),
    color: 'text-stone-700',
    bg: 'bg-stone-50',
    border: 'border-stone-200',
    icon: HelpCircle,
    description: `Current status: ${rawStatus.replace('_', ' ')}`,
  }
  const StatusIcon = statusInfo.icon
  const canCancel = ['REQUESTED', 'UNDER_REVIEW'].includes(rawStatus)
  const items = Array.isArray(returnDoc.items) ? returnDoc.items : []
  const refund = returnDoc.refund || null

  const authoritativeRefundAmount =
    returnDoc.resolution?.calculatedRefundAmount ??
    returnDoc.refundDetails?.amount ??
    refund?.amount ??
    0
  const isCodReturn = returnDoc.order?.paymentMethod === 'cod' || returnDoc.isCod
  const refundInitiatedDate = returnDoc.refundDetails?.createdAt || returnDoc.reviewedAt || returnDoc.createdAt
  const refundCompletedDate = returnDoc.completedAt || returnDoc.refundDetails?.processedAt || returnDoc.manualPayout?.paidAt

  let refundStatusDisplay = 'Refund Pending'
  if (['REFUNDED'].includes(rawStatus)) {
    refundStatusDisplay = 'Refund completed'
  } else if (['REFUND_PROCESSING'].includes(rawStatus)) {
    refundStatusDisplay = 'Refund processing'
  } else if (['REFUND_FAILED'].includes(rawStatus)) {
    refundStatusDisplay = 'Refund failed — please contact support'
  } else if (['APPROVED_FOR_REFUND'].includes(rawStatus)) {
    refundStatusDisplay = isCodReturn ? 'Refund approved · Payout pending' : 'Refund approved'
  } else if (['MANUAL_PAYOUT_PENDING', 'MANUAL_PAYOUT_PROCESSING'].includes(rawStatus)) {
    refundStatusDisplay = 'Refund payout pending'
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-2 mb-4">
          <Link
            href={returnDoc.orderId ? `/account/orders/${returnDoc.orderId}` : '/account/orders'}
            className="inline-flex items-center gap-1.5 text-[#5B4B3F] hover:text-[#C89B3C] font-sans text-xs tracking-[0.1em] uppercase transition-colors"
          >
            <ArrowLeft size={12} />
            {returnDoc.orderId ? 'Back to Order' : 'All Orders'}
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-[#EFE3D3] pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl tracking-[-0.02em] font-semibold text-[#1E1A17]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                Return #{returnDoc.returnNumber || id.slice(-8)}
              </h1>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-sans font-semibold border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
                <StatusIcon size={12} />
                {statusInfo.label}
              </span>
            </div>
            <p className="text-[#5B4B3F] font-sans text-xs mt-1">
              {returnDoc.type === 'REPLACEMENT' ? 'Replacement Request' : 'Return for Refund'} · Order #{returnDoc.orderNumber || returnDoc.orderId?.slice?.(-8) || returnDoc.orderId}
            </p>
            <p className="text-[#5B4B3F] font-sans text-[11px] mt-0.5">
              Submitted on {new Date(returnDoc.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          {canCancel && (
            <button
              type="button"
              onClick={() => setCancelModalOpen(true)}
              className="px-4 py-2 border border-[#7A1F1F] text-[#7A1F1F] text-xs font-sans tracking-[0.05em] uppercase rounded hover:bg-[#7A1F1F] hover:text-white transition-colors"
            >
              Cancel Return
            </button>
          )}
        </div>
      </motion.div>

      {/* Status banner */}
      <div className={`p-4 rounded-lg border ${statusInfo.bg} ${statusInfo.border} flex items-start gap-3`}>
        <StatusIcon size={18} className={`${statusInfo.color} flex-shrink-0 mt-0.5`} />
        <div>
          <p className={`font-sans font-semibold text-xs ${statusInfo.color}`}>
            {statusInfo.label}: {statusInfo.description}
          </p>
          {returnDoc.type === 'REPLACEMENT' && rawStatus === 'APPROVED' && (
            <p className="font-sans text-[11px] text-[#5B4B3F] mt-1">
              Your replacement piece is being inspected and prepared by the artisan workshop.
            </p>
          )}
        </div>
      </div>

      {/* Returned items */}
      <div className="bg-white border border-[#EFE3D3] rounded-lg p-6 space-y-4">
        <h2 className="text-sm font-sans uppercase tracking-[0.1em] text-[#5B4B3F] font-semibold">
          Items in this Request
        </h2>

        <div className="divide-y divide-[#EFE3D3]">
          {items.map((item: any, idx: number) => {
            const snapshot = item?.productSnapshot ?? {}
            const imageUrl = item?.image || snapshot?.image || (Array.isArray(snapshot?.images) ? snapshot.images[0] : null)
            const productName = item?.productName || snapshot?.name || 'Artisan Product'
            const variantText = snapshot?.attributes ? Object.values(snapshot.attributes).filter(Boolean).join(' · ') : null

            return (
              <div key={item._id || idx} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-16 h-16 bg-[#FAF6EF] border border-[#EFE3D3] rounded flex-shrink-0 overflow-hidden">
                    {imageUrl ? (
                      <Image src={imageUrl} alt={productName} width={64} height={64} className="w-full h-full object-cover" unoptimized />
                    ) : (
                      <Package size={22} className="m-5 text-[#A88D70]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-medium text-[#1E1A17]">{productName}</p>
                    {variantText && <p className="font-sans text-[10px] text-[#C89B3C] tracking-[0.06em] uppercase">{variantText}</p>}
                    <p className="font-sans text-xs text-[#5B4B3F] mt-0.5">
                      Quantity: <strong>{item.quantity}</strong> · Unit Price: ₹{Number(item.unitPrice || 0).toLocaleString()}
                    </p>
                    {item.reason && (
                      <p className="font-sans text-xs text-[#5B4B3F] mt-1">
                        Reason: <span className="font-medium text-[#1E1A17]">{item.reason}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-sans text-sm font-semibold text-[#1E1A17]">
                    ₹{Number(item.lineTotal || (item.unitPrice || 0) * (item.quantity || 1)).toLocaleString()}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Return Request Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#EFE3D3] rounded-lg p-6 space-y-3 text-xs font-sans">
          <h2 className="text-sm font-sans uppercase tracking-[0.1em] text-[#5B4B3F] font-semibold mb-3">
            Request Information
          </h2>
          <div className="flex justify-between border-b border-[#FAF6EF] pb-2">
            <span className="text-[#5B4B3F]">Return Number:</span>
            <span className="font-medium text-[#1E1A17] font-mono">{returnDoc.returnNumber}</span>
          </div>
          <div className="flex justify-between border-b border-[#FAF6EF] pb-2">
            <span className="text-[#5B4B3F]">Request Type:</span>
            <span className="font-medium text-[#1E1A17]">{returnDoc.type === 'REPLACEMENT' ? 'Replacement' : 'Return & Refund'}</span>
          </div>
          <div className="flex justify-between border-b border-[#FAF6EF] pb-2">
            <span className="text-[#5B4B3F]">Primary Reason:</span>
            <span className="font-medium text-[#1E1A17]">{returnDoc.reason || 'Customer requested return'}</span>
          </div>
          {returnDoc.description && (
            <div className="pt-2">
              <span className="text-[#5B4B3F] block mb-1">Customer Explanation:</span>
              <p className="p-3 bg-[#FAF6EF] rounded text-[#1E1A17] italic">
                "{returnDoc.description}"
              </p>
            </div>
          )}
        </div>

        {/* Refund Status Snapshot (Phase 5 customer-facing details) */}
        <div className="bg-white border border-[#EFE3D3] rounded-lg p-6 space-y-3 text-xs font-sans">
          <h2 className="text-sm font-sans uppercase tracking-[0.1em] text-[#5B4B3F] font-semibold mb-3">
            Financial & Refund Status
          </h2>
          {authoritativeRefundAmount > 0 || ['APPROVED_FOR_REFUND', 'REFUND_PENDING', 'REFUND_PROCESSING', 'REFUNDED', 'REFUND_FAILED', 'MANUAL_PAYOUT_PENDING', 'MANUAL_PAYOUT_PROCESSING'].includes(rawStatus) ? (
            <div className="space-y-3">
              <div className="flex justify-between border-b border-[#FAF6EF] pb-2">
                <span className="text-[#5B4B3F]">Refund Amount:</span>
                <span className="font-bold text-sm text-[#C89B3C]">
                  ₹{Number(authoritativeRefundAmount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#FAF6EF] pb-2">
                <span className="text-[#5B4B3F]">Payment Method:</span>
                <span className="font-medium text-[#1E1A17]">
                  {isCodReturn ? 'Cash on Delivery' : 'Prepaid (Online)'}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#FAF6EF] pb-2">
                <span className="text-[#5B4B3F]">Refund Status:</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${statusInfo.bg} ${statusInfo.color}`}>
                  {refundStatusDisplay}
                </span>
              </div>
              {refundInitiatedDate && (
                <div className="flex justify-between border-b border-[#FAF6EF] pb-2">
                  <span className="text-[#5B4B3F]">Initiated Date:</span>
                  <span className="text-[#1E1A17]">
                    {new Date(refundInitiatedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              )}
              {refundCompletedDate && (
                <div className="flex justify-between border-b border-[#FAF6EF] pb-2">
                  <span className="text-[#5B4B3F]">Completed Date:</span>
                  <span className="font-medium text-emerald-700">
                    {new Date(refundCompletedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              )}

              {/* COD Payout Destination Section */}
              {isCodReturn && (
                <div className="mt-3 p-3 bg-[#FAF6EF] rounded border border-[#EFE3D3] space-y-2">
                  <span className="font-semibold text-[#1E1A17] block">Payout Disbursement Destination</span>
                  {returnDoc.payoutDetails ? (
                    <div className="text-[11px] text-[#5B4B3F] space-y-1">
                      <p>
                        Method: <strong className="text-[#1E1A17]">{returnDoc.payoutDetails.method}</strong>
                      </p>
                      {returnDoc.payoutDetails.method === 'UPI' ? (
                        <p>
                          UPI ID: <strong className="text-[#1E1A17]">{returnDoc.payoutDetails.upiId}</strong>
                        </p>
                      ) : (
                        <>
                          <p>
                            Holder: <strong className="text-[#1E1A17]">{returnDoc.payoutDetails.accountHolderName}</strong>
                          </p>
                          <p>
                            Account: <strong className="text-[#1E1A17]">{returnDoc.payoutDetails.maskedAccountNumber || '****'}</strong>
                          </p>
                          <p>
                            IFSC: <strong className="text-[#1E1A17]">{returnDoc.payoutDetails.ifscCode}</strong>
                          </p>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-[11px] text-[#8C6114]">
                        Please provide your UPI ID or bank account details to receive your COD refund.
                      </p>
                      {['APPROVED_FOR_REFUND', 'MANUAL_PAYOUT_PENDING'].includes(rawStatus) && (
                        <button
                          type="button"
                          onClick={() => setPayoutModalOpen(true)}
                          className="px-3 py-1.5 bg-[#C89B3C] text-white text-[11px] font-sans font-medium uppercase rounded hover:bg-[#B3872F] transition-colors"
                        >
                          Add Payout Details
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2 py-2">
              <p className="text-[#5B4B3F]">
                {returnDoc.type === 'REPLACEMENT'
                  ? 'A replacement item has been requested. No monetary refund is initiated unless replacement is unavailable.'
                  : 'Refund calculation will appear here once your return request is approved and verified.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Phase 6: Replacement Order Status */}
      {(returnDoc.type === 'REPLACEMENT' ||
        Boolean(returnDoc.replacement) ||
        ['REPLACEMENT_PENDING', 'REPLACEMENT_SHIPPED', 'REPLACEMENT_DELIVERED'].includes(rawStatus)) && (
        <div className="bg-white border border-blue-200 rounded-lg p-6 space-y-3 text-xs font-sans">
          <div className="flex items-center justify-between border-b border-blue-100 pb-3">
            <div className="flex items-center gap-2 text-blue-900 font-semibold text-sm">
              <RefreshCw size={16} className="text-blue-600" />
              <span>Replacement Fulfillment Status</span>
            </div>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {returnDoc.replacement?.status || (rawStatus === 'REPLACEMENT_PENDING' ? 'REPLACEMENT_APPROVED' : 'APPROVED')}
            </span>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex justify-between border-b border-[#FAF6EF] pb-2">
              <span className="text-[#5B4B3F]">Replacement Status:</span>
              <span className="font-semibold text-blue-800">
                {(() => {
                  const voStatus = returnDoc.replacement?.vendorOrderStatus
                  const repStatus = returnDoc.replacement?.status
                  if (voStatus === 'DELIVERED' || repStatus === 'DELIVERED') return 'Replacement Delivered'
                  if (voStatus === 'SHIPPED' || repStatus === 'SHIPPED') return 'Replacement Shipped'
                  if (voStatus === 'READY_TO_SHIP') return 'Ready to Ship'
                  if (voStatus === 'PACKED') return 'Packed'
                  if (voStatus === 'PROCESSING') return 'Preparing Replacement'
                  if (repStatus === 'FULFILLMENT_STARTED') return 'Preparing shipment'
                  if (repStatus === 'ORDER_CREATED' || repStatus === 'PENDING_FULFILLMENT') return 'Replacement Order Created'
                  return repStatus || 'Replacement Approved'
                })()}
              </span>
            </div>

            <div className="flex justify-between border-b border-[#FAF6EF] pb-2">
              <span className="text-[#5B4B3F]">Fulfillment Stage:</span>
              <span className="font-medium text-[#1E1A17]">
                {(() => {
                  const voStatus = returnDoc.replacement?.vendorOrderStatus
                  const repStatus = returnDoc.replacement?.status
                  if (voStatus === 'DELIVERED' || repStatus === 'DELIVERED') return 'Delivered to customer'
                  if (voStatus === 'SHIPPED' || repStatus === 'SHIPPED') return 'Dispatched with carrier'
                  if (voStatus === 'READY_TO_SHIP') return 'Ready to Ship (Carrier pickup scheduled)'
                  if (voStatus === 'PACKED') return 'Packed by seller'
                  if (voStatus === 'PROCESSING') return 'Seller preparing items'
                  return 'Preparing shipment'
                })()}
              </span>
            </div>

            {returnDoc.replacement?.replacementOrderNumber && (
              <div className="flex justify-between border-b border-[#FAF6EF] pb-2">
                <span className="text-[#5B4B3F]">Replacement Order #:</span>
                <span className="font-mono font-bold text-[#1E1A17]">
                  {returnDoc.replacement.replacementOrderNumber}
                </span>
              </div>
            )}

            {returnDoc.replacement?.carrier && (
              <div className="flex justify-between border-b border-[#FAF6EF] pb-2">
                <span className="text-[#5B4B3F]">Courier Partner:</span>
                <span className="font-semibold text-[#1E1A17]">
                  {returnDoc.replacement.carrier}
                </span>
              </div>
            )}

            {returnDoc.replacement?.trackingNumber && (
              <div className="flex justify-between border-b border-[#FAF6EF] pb-2">
                <span className="text-[#5B4B3F]">Tracking / AWB #:</span>
                <div className="text-right">
                  <span className="font-mono font-bold text-blue-700 block">
                    {returnDoc.replacement.trackingNumber}
                  </span>
                  {returnDoc.replacement.trackingUrl && (
                    <a
                      href={returnDoc.replacement.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#8B5E34] hover:underline"
                    >
                      Track Shipment →
                    </a>
                  )}
                </div>
              </div>
            )}

            {returnDoc.replacement?.estimatedDeliveryAt && (
              <div className="flex justify-between border-b border-[#FAF6EF] pb-2">
                <span className="text-[#5B4B3F]">Estimated Delivery:</span>
                <span className="font-medium text-[#1E1A17]">
                  {new Date(returnDoc.replacement.estimatedDeliveryAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}

            <div className="flex justify-between border-b border-[#FAF6EF] pb-2">
              <span className="text-[#5B4B3F]">Replacement Quantity:</span>
              <span className="font-medium text-[#1E1A17]">
                {returnDoc.replacement?.quantity ?? items[0]?.quantity ?? 1} item(s)
              </span>
            </div>

            <div className="flex justify-between border-b border-[#FAF6EF] pb-2">
              <span className="text-[#5B4B3F]">Additional Payment:</span>
              <span className="font-semibold text-emerald-700">
                ₹0 (Free Replacement)
              </span>
            </div>

            {returnDoc.replacement?.createdAt && (
              <div className="flex justify-between pt-1">
                <span className="text-[#5B4B3F]">Order Generated:</span>
                <span className="text-[#1E1A17]">
                  {new Date(returnDoc.replacement.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Phase 11: Return Customer Support & Communication */}
      <div className="bg-white border border-[#EAE2D5] rounded-lg p-6 space-y-4 text-xs font-sans">
        <div className="flex items-center justify-between border-b border-[#FAF6EF] pb-3">
          <div className="flex items-center gap-2 text-[#1E1A17] font-semibold text-sm">
            <HelpCircle size={16} className="text-[#C89B3C]" />
            <span>Need Help with this Return?</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setTicketSubject(`Help with Return ${returnDoc.returnNumber}`)
              setSupportModalOpen(true)
            }}
            className="px-3 py-1.5 bg-[#6B3E26] text-white text-[11px] font-semibold uppercase tracking-wider rounded hover:bg-[#522F1C] transition-colors"
          >
            Contact Support
          </button>
        </div>

        {returnTickets.length > 0 ? (
          <div className="space-y-3 pt-1">
            <p className="text-[#5B4B3F] font-medium text-[11px] uppercase tracking-wider">Support Ticket History</p>
            <div className="divide-y divide-[#FAF6EF] border border-[#FAF6EF] rounded">
              {returnTickets.map((t: any) => (
                <div key={t._id} className="p-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#1E1A17] text-[11px]">{t.ticketNumber}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#F8F4EE] text-[#7A6B5D]">
                        {t.category}
                      </span>
                    </div>
                    <p className="text-[#5B4B3F] text-xs font-medium mt-0.5">{t.subject}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      t.status === 'RESOLVED' || t.status === 'CLOSED'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {t.status}
                    </span>
                    <p className="text-[10px] text-[#9C8E82] mt-0.5">
                      {new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-[#7A6B5D] text-xs">
            Have questions regarding pickup, inspection, or refunds? Contact our dedicated customer care team for prompt assistance.
          </p>
        )}
      </div>

      {/* Support Ticket Modal */}
      {supportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FFFDF9] border border-[#C89B3C]/30 rounded-lg max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#EAE2D5] pb-2">
              <h3 className="text-base font-semibold text-[#1E1A17]">Contact Customer Support</h3>
              <button
                type="button"
                onClick={() => setSupportModalOpen(false)}
                className="text-[#9C8E82] hover:text-[#1E1A17] text-sm"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                createTicketMutation.mutate()
              }}
              className="space-y-3 text-xs font-sans"
            >
              <div>
                <label className="block text-[#5B4B3F] mb-1 font-medium">Issue Category</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full border border-[#D4C4B0] rounded p-2 text-xs text-[#1E1A17] bg-[#FAF8F5]"
                >
                  <option value="RETURN">Return Status / Pickup</option>
                  <option value="REFUND">Refund Issue</option>
                  <option value="REPLACEMENT">Replacement Issue</option>
                  <option value="DAMAGED_ITEM">Damaged Item</option>
                  <option value="WRONG_ITEM">Wrong Item Received</option>
                  <option value="DELIVERY">Delivery Partner Issue</option>
                  <option value="OTHER">Other Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-[#5B4B3F] mb-1 font-medium">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Summary of issue"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full border border-[#D4C4B0] rounded p-2 text-xs text-[#1E1A17] bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-[#5B4B3F] mb-1 font-medium">Message Details</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your inquiry or concern..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  className="w-full border border-[#D4C4B0] rounded p-2 text-xs text-[#1E1A17] bg-[#FAF8F5]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSupportModalOpen(false)}
                  className="px-4 py-2 border border-[#D4C4B0] text-[#5B4B3F] text-xs uppercase rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createTicketMutation.isPending || !ticketSubject.trim() || !ticketMessage.trim()}
                  className="px-4 py-2 bg-[#6B3E26] text-white text-xs uppercase rounded hover:bg-[#522F1C] disabled:opacity-60"
                >
                  {createTicketMutation.isPending ? 'Submitting…' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FFFDF9] border border-[#C89B3C]/30 rounded-lg max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-semibold text-[#1E1A17]">Cancel Return Request?</h3>
            <p className="text-xs text-[#5B4B3F] font-sans">
              Are you sure you want to cancel this return request? Once cancelled, you may only re-request if within the active return window.
            </p>
            <div className="space-y-1">
              <label htmlFor="cancel-reason" className="text-xs font-sans text-[#5B4B3F]">
                Reason for cancellation
              </label>
              <input
                id="cancel-reason"
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full border border-[#D4C4B0] rounded p-2 text-sm text-[#1E1A17] bg-[#FAF8F5]"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 border border-[#D4C4B0] text-[#5B4B3F] text-xs uppercase rounded"
              >
                Back
              </button>
              <button
                type="button"
                disabled={cancelMutation.isPending}
                onClick={() => cancelMutation.mutate()}
                className="px-4 py-2 bg-[#7A1F1F] text-white text-xs uppercase rounded hover:bg-[#5E1717] disabled:opacity-60"
              >
                {cancelMutation.isPending ? 'Cancelling…' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COD Payout Details Modal */}
      {payoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FFFDF9] border border-[#C89B3C]/30 rounded-lg max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-semibold text-[#1E1A17]">Provide Refund Payout Details</h3>
            <p className="text-xs text-[#5B4B3F] font-sans">
              Choose how you would like to receive your ₹{Number(authoritativeRefundAmount).toLocaleString()} refund.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                payoutMutation.mutate()
              }}
              className="space-y-3 font-sans text-xs"
            >
              <div className="flex gap-4 border-b border-[#EFE3D3] pb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payoutMethod"
                    value="UPI"
                    checked={payoutMethod === 'UPI'}
                    onChange={() => setPayoutMethod('UPI')}
                  />
                  <span className="font-medium text-[#1E1A17]">UPI ID</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payoutMethod"
                    value="BANK_ACCOUNT"
                    checked={payoutMethod === 'BANK_ACCOUNT'}
                    onChange={() => setPayoutMethod('BANK_ACCOUNT')}
                  />
                  <span className="font-medium text-[#1E1A17]">Bank Account (NEFT)</span>
                </label>
              </div>

              {payoutMethod === 'UPI' ? (
                <div>
                  <label className="block text-[#5B4B3F] mb-1">UPI ID (VPA) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. yourname@okhdfcbank"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full border border-[#D4C4B0] rounded p-2 text-xs text-[#1E1A17] bg-[#FAF8F5]"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div>
                    <label className="block text-[#5B4B3F] mb-1">Account Holder Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Name as on bank passbook"
                      value={accountHolderName}
                      onChange={(e) => setAccountHolderName(e.target.value)}
                      className="w-full border border-[#D4C4B0] rounded p-2 text-xs text-[#1E1A17] bg-[#FAF8F5]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5B4B3F] mb-1">Bank Account Number *</label>
                    <input
                      type="password"
                      required
                      placeholder="Account number"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full border border-[#D4C4B0] rounded p-2 text-xs text-[#1E1A17] bg-[#FAF8F5]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5B4B3F] mb-1">IFSC Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SBIN0001234"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                      className="w-full border border-[#D4C4B0] rounded p-2 text-xs text-[#1E1A17] bg-[#FAF8F5] uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5B4B3F] mb-1">Bank Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. State Bank of India"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full border border-[#D4C4B0] rounded p-2 text-xs text-[#1E1A17] bg-[#FAF8F5]"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setPayoutModalOpen(false)}
                  className="px-4 py-2 border border-[#D4C4B0] text-[#5B4B3F] text-xs uppercase rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={payoutMutation.isPending}
                  className="px-4 py-2 bg-[#C89B3C] text-white text-xs uppercase rounded hover:bg-[#B3872F] disabled:opacity-60"
                >
                  {payoutMutation.isPending ? 'Saving…' : 'Save Payout Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
