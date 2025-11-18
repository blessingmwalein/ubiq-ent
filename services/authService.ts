import apiClient from '@/lib/api-client'

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface LoginData {
  email: string
  password: string
  remember?: boolean
}

export interface ResetPasswordData {
  token: string
  email: string
  password: string
  password_confirmation: string
}

export const authService = {
  register: async (data: RegisterData) => {
    const response = await apiClient.post('/register', data)
    return response.data
  },

  login: async (data: LoginData) => {
    const response = await apiClient.post('/login', data)
    return response.data
  },

  logout: async () => {
    const response = await apiClient.post('/logout')
    return response.data
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/user')
    return response.data
  },

  forgotPassword: async (email: string) => {
    const response = await apiClient.post('/forgot-password', { email })
    return response.data
  },

  resetPassword: async (data: ResetPasswordData) => {
    const response = await apiClient.post('/reset-password', data)
    return response.data
  },

  verifyEmail: async (id: number, hash: string, expires: string, signature: string) => {
    const response = await apiClient.get(`/email/verify/${id}/${hash}`, {
      params: { expires, signature },
    })
    return response.data
  },

  resendVerification: async () => {
    const response = await apiClient.post('/email/verification-notification')
    return response.data
  },

  enable2FA: async () => {
    const response = await apiClient.post('/user/two-factor-authentication')
    return response.data
  },

  disable2FA: async () => {
    const response = await apiClient.delete('/user/two-factor-authentication')
    return response.data
  },

  confirm2FA: async (code: string) => {
    const response = await apiClient.post('/user/confirmed-two-factor-authentication', { code })
    return response.data
  },
}
