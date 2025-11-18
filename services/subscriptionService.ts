import apiClient from '@/lib/api-client'

export const subscriptionService = {
  // Get all subscription plans (packages)
  getPlans: async (active = true, interval?: 'monthly' | 'yearly' | 'lifetime') => {
    const response = await apiClient.get('/packages', {
      params: { active, interval },
    })
    return response.data
  },

  // Get current subscription
  getCurrentSubscription: async () => {
    const response = await apiClient.get('/subscription')
    return response.data
  },

  // Subscribe to a plan
  subscribe: async (planId: number, paymentMethodId: string, useTrial = true) => {
    const response = await apiClient.post('/subscriptions', {
      plan_id: planId,
      payment_method_id: paymentMethodId,
      use_trial: useTrial,
    })
    return response.data
  },

  // Update subscription (upgrade/downgrade)
  updateSubscription: async (subscriptionId: number, planId: number, prorate = true) => {
    const response = await apiClient.put(`/subscriptions/${subscriptionId}`, {
      plan_id: planId,
      prorate,
    })
    return response.data
  },

  // Cancel subscription
  cancelSubscription: async (subscriptionId: number, immediate = false) => {
    const response = await apiClient.delete(`/subscriptions/${subscriptionId}`, {
      params: { immediate },
    })
    return response.data
  },

  // Resume subscription
  resumeSubscription: async (subscriptionId: number) => {
    const response = await apiClient.post(`/subscriptions/${subscriptionId}/resume`)
    return response.data
  },

  // Get payment methods
  getPaymentMethods: async () => {
    const response = await apiClient.get('/payment-methods')
    return response.data
  },

  // Update default payment method
  updateDefaultPaymentMethod: async (paymentMethodId: string) => {
    const response = await apiClient.put('/payment-methods/default', {
      payment_method_id: paymentMethodId,
    })
    return response.data
  },

  // Get billing history
  getBillingHistory: async (page = 1, perPage = 15) => {
    const response = await apiClient.get('/billing/history', {
      params: { page, per_page: perPage },
    })
    return response.data
  },

  // Get invoice
  getInvoice: async (invoiceId: string, format: 'json' | 'pdf' = 'json') => {
    const response = await apiClient.get(`/billing/invoices/${invoiceId}`, {
      params: { format },
      ...(format === 'pdf' && { responseType: 'blob' }),
    })
    return response.data
  },

  // Download invoice
  downloadInvoice: async (invoiceId: string) => {
    const response = await apiClient.get(`/billing/invoices/${invoiceId}`, {
      params: { format: 'pdf' },
      responseType: 'blob',
    })
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `invoice-${invoiceId}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    
    return response.data
  },
}
