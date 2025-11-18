import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import apiClient from '@/lib/api-client'
import { contentService } from '@/services/contentService'
import { AxiosError } from 'axios'

// Types
export interface ContentItem {
  id: number
  uuid?: string
  title: string
  description: string
  type: 'movie' | 'show' | 'skit' | 'afrimation' | 'real_estate'
  visibility: 'public' | 'premium' | 'private'
  maturity_rating: string
  release_year: number
  duration_seconds: number
  views_count: number
  poster_url: string
  backdrop_url: string
  thumbnail_url: string
  trailer_url: string | null
  published_at: string
  tags?: string | string[] | null
  metadata?: any
  category: any
  provider: any
  show?: any
  video_assets?: any[]
  is_in_watchlist?: boolean
  is_favorited?: boolean
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export interface Favorite {
  id: number
  profile_id: number
  content_item_id: number
  added_at: string
  content_item: ContentItem
}

export interface ContentState {
  items: ContentItem[]
  currentItem: ContentItem | null
  trending: ContentItem[]
  newReleases: ContentItem[]
  favorites: Favorite[]
  categories: any[]
  movies: ContentItem[]
  shows: ContentItem[]
  skits: ContentItem[]
  afrimations: ContentItem[]
  realEstate: ContentItem[]
  loading: boolean
  error: string | null
  pagination: {
    currentPage: number
    lastPage: number
    total: number
    perPage: number
  }
}

const initialState: ContentState = {
  items: [],
  currentItem: null,
  trending: [],
  newReleases: [],
  favorites: [],
  categories: [],
  movies: [],
  shows: [],
  skits: [],
  afrimations: [],
  realEstate: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 15,
  },
}

// Async thunks
export const fetchContent = createAsyncThunk(
  'content/fetchContent',
  async (
    params: {
      page?: number
      per_page?: number
      type?: string
      category_id?: number
      sort?: string
      order?: string
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get('/content', { params })
      return response.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch content' })
    }
  }
)

export const fetchContentById = createAsyncThunk(
  'content/fetchContentById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/content/${id}`)
      return response.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Content not found' })
    }
  }
)

export const searchContent = createAsyncThunk(
  'content/searchContent',
  async (
    params: {
      query?: string
      page?: number
      per_page?: number
      type?: string
      category_id?: number
      maturity_rating?: string
      genre?: string
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get('/content/search', { params })
      return response.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Search failed' })
    }
  }
)

export const fetchTrending = createAsyncThunk(
  'content/fetchTrending',
  async (params: { limit?: number; days?: number }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/content/trending', { params })
      return response.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch trending' })
    }
  }
)

export const fetchNewReleases = createAsyncThunk(
  'content/fetchNewReleases',
  async (params: { limit?: number; days?: number; type?: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/content/new-releases', { params })
      return response.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch new releases' })
    }
  }
)

export const fetchCategories = createAsyncThunk(
  'content/fetchCategories',
  async (params: { with_content_count?: boolean; parent_only?: boolean }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/categories', { params })
      return response.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch categories' })
    }
  }
)

export const fetchCategoryContent = createAsyncThunk(
  'content/fetchCategoryContent',
  async (
    { categoryId, params }: { categoryId: number; params?: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get(`/categories/${categoryId}/content`, { params })
      return response.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch category content' })
    }
  }
)

export const addToWatchlist = createAsyncThunk(
  'content/addToWatchlist',
  async (contentId: number, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/watchlist/${contentId}`)
      return { contentId, data: response.data }
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to add to watchlist' })
    }
  }
)

export const removeFromWatchlist = createAsyncThunk(
  'content/removeFromWatchlist',
  async (contentId: number, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/watchlist/${contentId}`)
      return contentId
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to remove from watchlist' })
    }
  }
)

// Favorites thunks
export const toggleFavorite = createAsyncThunk(
  'content/toggleFavorite',
  async ({ contentId, profileId }: { contentId: number; profileId: number }, { rejectWithValue }) => {
    try {
      const response = await contentService.toggleFavorite(contentId, profileId)
      return { contentId, data: response.data }
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to toggle favorite' })
    }
  }
)

export const fetchFavorites = createAsyncThunk(
  'content/fetchFavorites',
  async (profileId: number, { rejectWithValue }) => {
    try {
      const response = await contentService.getFavorites(profileId)
      return response.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch favorites' })
    }
  }
)

export const fetchContentByType = createAsyncThunk(
  'content/fetchContentByType',
  async (
    { 
      type, 
      params 
    }: { 
      type: 'movie' | 'show' | 'skit' | 'afrimation' | 'real_estate'; 
      params?: { page?: number; per_page?: number } 
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await contentService.getContentByType(type, params)
      return { type, data: response.data }
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: `Failed to fetch ${type} content` })
    }
  }
)

// Slice
const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    clearContent: (state) => {
      state.items = []
      state.currentItem = null
      state.error = null
    },
    clearCurrentItem: (state) => {
      state.currentItem = null
    },
    setCurrentItem: (state, action: PayloadAction<ContentItem>) => {
      state.currentItem = action.payload
    },
  },
  extraReducers: (builder) => {
    // Fetch content
    builder.addCase(fetchContent.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchContent.fulfilled, (state, action) => {
      state.loading = false
      state.items = action.payload.data
      if (action.payload.meta) {
        state.pagination = {
          currentPage: action.payload.meta.current_page,
          lastPage: action.payload.meta.last_page,
          total: action.payload.meta.total,
          perPage: action.payload.meta.per_page,
        }
      }
    })
    builder.addCase(fetchContent.rejected, (state, action: any) => {
      state.loading = false
      state.error = action.payload?.message || 'Failed to fetch content'
    })
    
    // Fetch content by ID
    builder.addCase(fetchContentById.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchContentById.fulfilled, (state, action) => {
      state.loading = false
      state.currentItem = action.payload.data
    })
    builder.addCase(fetchContentById.rejected, (state, action: any) => {
      state.loading = false
      state.error = action.payload?.message || 'Content not found'
    })
    
    // Search content
    builder.addCase(searchContent.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(searchContent.fulfilled, (state, action) => {
      state.loading = false
      state.items = action.payload.data
      if (action.payload.meta) {
        state.pagination = {
          currentPage: action.payload.meta.current_page,
          lastPage: action.payload.meta.last_page || 1,
          total: action.payload.meta.total,
          perPage: action.payload.meta.per_page,
        }
      }
    })
    builder.addCase(searchContent.rejected, (state, action: any) => {
      state.loading = false
      state.error = action.payload?.message || 'Search failed'
    })
    
    // Fetch trending
    builder.addCase(fetchTrending.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchTrending.fulfilled, (state, action) => {
      state.loading = false
      state.trending = action.payload.data
    })
    builder.addCase(fetchTrending.rejected, (state, action: any) => {
      state.loading = false
      state.error = action.payload?.message || 'Failed to fetch trending'
    })
    
    // Fetch new releases
    builder.addCase(fetchNewReleases.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchNewReleases.fulfilled, (state, action) => {
      state.loading = false
      state.newReleases = action.payload.data
    })
    builder.addCase(fetchNewReleases.rejected, (state, action: any) => {
      state.loading = false
      state.error = action.payload?.message || 'Failed to fetch new releases'
    })
    
    // Fetch categories
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = action.payload.data
    })
    
    // Toggle favorite
    builder.addCase(toggleFavorite.pending, (state) => {
      state.loading = true
    })
    builder.addCase(toggleFavorite.fulfilled, (state, action) => {
      state.loading = false
      const { contentId, data } = action.payload
      
      // Update current item if it's the one being toggled
      if (state.currentItem?.id === contentId) {
        state.currentItem.is_favorited = data.is_favorited
      }
      
      // Update in items list
      const item = state.items.find(i => i.id === contentId)
      if (item) {
        item.is_favorited = data.is_favorited
      }
      
      // Update in trending
      const trendingItem = state.trending.find(i => i.id === contentId)
      if (trendingItem) {
        trendingItem.is_favorited = data.is_favorited
      }
      
      // Update in new releases
      const newReleaseItem = state.newReleases.find(i => i.id === contentId)
      if (newReleaseItem) {
        newReleaseItem.is_favorited = data.is_favorited
      }
    })
    builder.addCase(toggleFavorite.rejected, (state, action: any) => {
      state.loading = false
      state.error = action.payload?.message || 'Failed to toggle favorite'
    })
    
    // Fetch favorites
    builder.addCase(fetchFavorites.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchFavorites.fulfilled, (state, action) => {
      state.loading = false
      state.favorites = action.payload
    })
    builder.addCase(fetchFavorites.rejected, (state, action: any) => {
      state.loading = false
      state.error = action.payload?.message || 'Failed to fetch favorites'
    })
    
    // Fetch content by type
    builder.addCase(fetchContentByType.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchContentByType.fulfilled, (state, action) => {
      state.loading = false
      const { type, data } = action.payload
      
      switch (type) {
        case 'movie':
          state.movies = data
          break
        case 'show':
          state.shows = data
          break
        case 'skit':
          state.skits = data
          break
        case 'afrimation':
          state.afrimations = data
          break
        case 'real_estate':
          state.realEstate = data
          break
      }
    })
    builder.addCase(fetchContentByType.rejected, (state, action: any) => {
      state.loading = false
      state.error = action.payload?.message || 'Failed to fetch content by type'
    })
  },
})

export const { clearContent, clearCurrentItem, setCurrentItem } = contentSlice.actions
export default contentSlice.reducer
