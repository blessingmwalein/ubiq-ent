import apiClient from '@/lib/api-client'

export interface UserSettings {
  email_notifications?: boolean
  push_notifications?: boolean
  autoplay_previews?: boolean
  data_saver_mode?: boolean
  language?: string
  subtitle_size?: 'small' | 'medium' | 'large'
  playback_quality?: 'auto' | '360p' | '480p' | '720p' | '1080p'
}

export interface UpdatePasswordData {
  current_password: string
  password: string
  password_confirmation: string
}

export interface UpdateProfileData {
  name?: string
  email?: string
}

export const userService = {
  // Get user account info
  getAccountInfo: async () => {
    const response = await apiClient.get('/user/account')
    return response.data
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileData) => {
    const response = await apiClient.put('/user/profile', data)
    return response.data
  },

  // Update password
  updatePassword: async (data: UpdatePasswordData) => {
    const response = await apiClient.put('/user/password', data)
    return response.data
  },

  // Update settings
  updateSettings: async (settings: UserSettings) => {
    const response = await apiClient.put('/user/settings', settings)
    return response.data
  },

  // Get settings
  getSettings: async () => {
    const response = await apiClient.get('/user/settings')
    return response.data
  },

  // Delete account
  deleteAccount: async (password: string) => {
    const response = await apiClient.delete('/user/account', {
      data: { password },
    })
    return response.data
  },
}
