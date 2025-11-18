import apiClient from '@/lib/api-client'

export interface ContentFilters {
  page?: number
  per_page?: number
  type?: 'movie' | 'show' | 'skit' | 'afrimation' | 'real_estate'
  category_id?: number
  visibility?: 'public' | 'premium' | 'private'
  sort?: 'created_at' | 'release_year' | 'title' | 'views_count'
  order?: 'asc' | 'desc'
}

export interface SearchParams {
  query?: string
  page?: number
  per_page?: number
  type?: string
  category_id?: number
  maturity_rating?: string
  genre?: string
}

export const contentService = {
  // Get all content
  getContent: async (filters?: ContentFilters) => {
    const response = await apiClient.get('/content', { params: filters })
    return response.data
  },

  // Get content by ID
  getContentById: async (id: number) => {
    const response = await apiClient.get(`/content/${id}`)
    return response.data
  },

  // Search content
  searchContent: async (params: SearchParams) => {
    const response = await apiClient.get('/content/search', { params })
    return response.data
  },

  // Get trending content
  getTrending: async (limit = 20, days = 7) => {
    const response = await apiClient.get('/content/trending', {
      params: { limit, days },
    })
    return response.data
  },

  // Get new releases
  getNewReleases: async (limit = 20, days = 30, type?: string) => {
    const response = await apiClient.get('/content/new-releases', {
      params: { limit, days, type },
    })
    return response.data
  },

  // Get all categories
  getCategories: async (withContentCount = false, parentOnly = false) => {
    const response = await apiClient.get('/categories', {
      params: { with_content_count: withContentCount, parent_only: parentOnly },
    })
    return response.data
  },

  // Get content by category
  getCategoryContent: async (categoryId: number, params?: any) => {
    const response = await apiClient.get(`/categories/${categoryId}/content`, { params })
    return response.data
  },

  // Get all shows
  getShows: async (params?: { page?: number; per_page?: number; status?: string }) => {
    const response = await apiClient.get('/shows', { params })
    return response.data
  },

  // Get show details with seasons and episodes
  getShowById: async (id: number) => {
    const response = await apiClient.get(`/shows/${id}`)
    return response.data
  },

  // Get episodes for a season
  getSeasonEpisodes: async (showId: number, seasonId: number) => {
    const response = await apiClient.get(`/shows/${showId}/seasons/${seasonId}/episodes`)
    return response.data
  },

  // Get quality options for content
  getQualityOptions: async (contentId: number) => {
    const response = await apiClient.get(`/content/${contentId}/quality-options`)
    return response.data
  },

  // Favorites/Watchlist APIs
  toggleFavorite: async (contentId: number, profileId: number) => {
    const response = await apiClient.post(`/favorites/${contentId}/toggle`, { profile_id: profileId })
    return response.data
  },

  getFavorites: async (profileId: number) => {
    const response = await apiClient.get('/favorites', { params: { profile_id: profileId } })
    return response.data
  },

  // Get content by type (movie, show, skit, afrimation, real_estate)
  getContentByType: async (type: 'movie' | 'show' | 'skit' | 'afrimation' | 'real_estate', params?: { page?: number; per_page?: number }) => {
    const response = await apiClient.get(`/content/type/${type}`, { params })
    return response.data
  },
}
