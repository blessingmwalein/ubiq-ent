import apiClient from '@/lib/api-client'

export interface ProfileData {
  name: string
  avatar?: string
  is_kids?: boolean
  is_default?: boolean
  language?: string
  autoplay_next?: boolean
  subtitle_preference?: string
}

export const profileService = {
  // Get all profiles
  getProfiles: async () => {
    const response = await apiClient.get('/profiles')
    return response.data
  },

  // Create new profile
  createProfile: async (data: ProfileData) => {
    const response = await apiClient.post('/profiles', data)
    return response.data
  },

  // Update profile
  updateProfile: async (id: number, data: Partial<ProfileData>) => {
    const response = await apiClient.put(`/profiles/${id}`, data)
    return response.data
  },

  // Delete profile
  deleteProfile: async (id: number) => {
    const response = await apiClient.delete(`/profiles/${id}`)
    return response.data
  },

  // Add to watchlist
  addToWatchlist: async (profileId: number, contentId: number) => {
    const response = await apiClient.post(`/profiles/${profileId}/watchlist`, {
      content_id: contentId,
    })
    return response.data
  },

  // Remove from watchlist
  removeFromWatchlist: async (profileId: number, contentId: number) => {
    const response = await apiClient.delete(`/profiles/${profileId}/watchlist/${contentId}`)
    return response.data
  },

  // Get watchlist
  getWatchlist: async (profileId: number, page = 1, perPage = 20) => {
    const response = await apiClient.get(`/profiles/${profileId}/watchlist`, {
      params: { page, per_page: perPage },
    })
    return response.data
  },

  // Add to favorites
  addToFavorites: async (profileId: number, contentId: number) => {
    const response = await apiClient.post(`/profiles/${profileId}/favorites`, {
      content_id: contentId,
    })
    return response.data
  },

  // Remove from favorites
  removeFromFavorites: async (profileId: number, contentId: number) => {
    const response = await apiClient.delete(`/profiles/${profileId}/favorites/${contentId}`)
    return response.data
  },

  // Get favorites
  getFavorites: async (profileId: number, page = 1, perPage = 20) => {
    const response = await apiClient.get(`/profiles/${profileId}/favorites`, {
      params: { page, per_page: perPage },
    })
    return response.data
  },
}
