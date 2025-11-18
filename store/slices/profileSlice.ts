import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import apiClient, { authHelpers } from '@/lib/api-client'
import { AxiosError } from 'axios'

// Types
export interface Profile {
  id: number
  uuid: string
  name: string
  avatar: string
  is_kids: boolean
  is_default: boolean
  language: string
  autoplay_next: boolean
  subtitle_preference: string | null
  created_at: string
  updated_at: string
}

export interface ProfileState {
  profiles: Profile[]
  selectedProfile: Profile | null
  loading: boolean
  error: string | null
}

// Load selected profile from cookie on initialization
const loadInitialProfile = (): Profile | null => {
  try {
    return authHelpers.getProfile()
  } catch (error) {
    console.warn('Failed to load profile from cookie:', error)
    return null
  }
}

const initialState: ProfileState = {
  profiles: [],
  selectedProfile: loadInitialProfile(), // Load from cookie immediately
  loading: false,
  error: null,
}

// Async thunks
export const fetchProfiles = createAsyncThunk(
  'profiles/fetchProfiles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/profiles')
      return response.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch profiles' })
    }
  }
)

export const createProfile = createAsyncThunk(
  'profiles/createProfile',
  async (
    data: {
      name: string
      avatar?: string
      is_kids?: boolean
      language?: string
      autoplay_next?: boolean
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post('/profiles', data)
      return response.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to create profile' })
    }
  }
)

export const updateProfile = createAsyncThunk(
  'profiles/updateProfile',
  async (
    { uuid, data }: { uuid: string; data: Partial<Profile> },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.put(`/profiles/${uuid}`, data)
      return response.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to update profile' })
    }
  }
)

export const deleteProfile = createAsyncThunk(
  'profiles/deleteProfile',
  async (uuid: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/profiles/${uuid}`)
      return uuid
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to delete profile' })
    }
  }
)

// Slice
const profileSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {
    selectProfile: (state, action: PayloadAction<Profile>) => {
      state.selectedProfile = action.payload
      authHelpers.setProfile(action.payload)
    },
    clearSelectedProfile: (state) => {
      state.selectedProfile = null
      authHelpers.removeProfile()
    },
    loadSelectedProfile: (state) => {
      const saved = authHelpers.getProfile()
      if (saved) {
        state.selectedProfile = saved
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch profiles
    builder.addCase(fetchProfiles.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchProfiles.fulfilled, (state, action) => {
      state.loading = false
      state.profiles = action.payload.data
      
      // If profile already loaded from cookie, verify it still exists
      if (state.selectedProfile) {
        const profileExists = action.payload.data.find((p: Profile) => p.id === state.selectedProfile?.id)
        if (!profileExists) {
          // Profile was deleted, select default or first available
          const defaultProfile = action.payload.data.find((p: Profile) => p.is_default) || action.payload.data[0]
          if (defaultProfile) {
            state.selectedProfile = defaultProfile
            authHelpers.setProfile(defaultProfile)
          } else {
            state.selectedProfile = null
            authHelpers.removeProfile()
          }
        }
      } else if (action.payload.data.length > 0) {
        // No profile selected, auto-select default profile
        const defaultProfile = action.payload.data.find((p: Profile) => p.is_default) || action.payload.data[0]
        state.selectedProfile = defaultProfile
        authHelpers.setProfile(defaultProfile)
      }
    })
    builder.addCase(fetchProfiles.rejected, (state, action: any) => {
      state.loading = false
      state.error = action.payload?.message || 'Failed to fetch profiles'
    })
    
    // Create profile
    builder.addCase(createProfile.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(createProfile.fulfilled, (state, action) => {
      state.loading = false
      state.profiles.push(action.payload.data)
    })
    builder.addCase(createProfile.rejected, (state, action: any) => {
      state.loading = false
      state.error = action.payload?.message || 'Failed to create profile'
    })
    
    // Update profile
    builder.addCase(updateProfile.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.loading = false
      const index = state.profiles.findIndex((p) => p.id === action.payload.data.id)
      if (index !== -1) {
        state.profiles[index] = action.payload.data
      }
      if (state.selectedProfile?.id === action.payload.data.id) {
        state.selectedProfile = action.payload.data
        authHelpers.setProfile(action.payload.data)
      }
    })
    builder.addCase(updateProfile.rejected, (state, action: any) => {
      state.loading = false
      state.error = action.payload?.message || 'Failed to update profile'
    })
    
    // Delete profile
    builder.addCase(deleteProfile.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(deleteProfile.fulfilled, (state, action) => {
      state.loading = false
      state.profiles = state.profiles.filter((p) => p.uuid !== action.payload)
      if (state.selectedProfile?.uuid === action.payload) {
        state.selectedProfile = state.profiles[0] || null
        if (state.selectedProfile) {
          authHelpers.setProfile(state.selectedProfile)
        } else {
          authHelpers.removeProfile()
        }
      }
    })
    builder.addCase(deleteProfile.rejected, (state, action: any) => {
      state.loading = false
      state.error = action.payload?.message || 'Failed to delete profile'
    })
  },
})

export const { selectProfile, clearSelectedProfile, loadSelectedProfile } = profileSlice.actions

// Helper function to get selected profile from cookie
export const getSelectedProfileFromCookie = (): Profile | null => {
  return authHelpers.getProfile()
}

export default profileSlice.reducer
