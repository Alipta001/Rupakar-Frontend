export type CheckoutQueryClient = {
  invalidateQueries: (options: { queryKey: string[]; refetchType?: 'active' | 'all' | 'none' }) => Promise<unknown> | unknown
  removeQueries: (options: { queryKey: string[] }) => void
}

export async function refreshCheckoutAfterPaymentCancellation(queryClient: CheckoutQueryClient) {
  await queryClient.invalidateQueries({ queryKey: ['cart'], refetchType: 'active' })
  queryClient.removeQueries({ queryKey: ['checkout-preview'] })
}