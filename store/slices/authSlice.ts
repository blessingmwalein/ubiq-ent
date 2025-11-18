import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import apiClient, { authHelpers } from '@/lib/api-client'
import { AxiosError } from 'axios'

// Types
export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  onboarding_completed: boolean
  two_factor_enabled: boolean
  phone_number?: string
  date_of_birth?: string
  country_code?: string
  avatar_url?: string
  uuid?: string
  social_provider?: string | null
  social_provider_id?: string | null
  trial_ends_at?: string | null
  role?: string
  two_factor_confirmed_at?: string | null
  created_at: string
  updated_at: string
}

export interface Account {
  id: number
  uuid: string
  user_id: number
  package_id: number
  account_name: string
  status: string
  expires_at: string | null
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: User | null
  account: Account | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

// Initial state
const initialState: AuthState = {
  user: null,
  account: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

// Async thunks
export const register = createAsyncThunk(
  'auth/register',
  async (
    credentials: {
      name: string
      email: string
      password: string
      password_confirmation: string
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post('/auth/register', credentials)
      return response.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Registration failed' })
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (
    credentials: { email: string; password: string; remember?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post('/auth/login', credentials)
      return response.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Login failed' })
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.post('/logout')
      return null
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Logout failed' })
    }
  }
)

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/auth/me')
      return response.data.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to get user' })
    }
  }
)

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await apiClient.put('/auth/me', data)
      return response.data.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to update user' })
    }
  }
)

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/forgot-password', { email })
      return response.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Request failed' })
    }
  }
)

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (
    data: {
      token: string
      email: string
      password: string
      password_confirmation: string
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post('/reset-password', data)
      return response.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Reset failed' })
    }
  }
)

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string; account?: Account }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.account = action.payload.account || null
      state.isAuthenticated = true
      
      // Save to cookies
      authHelpers.setToken(action.payload.token)
      authHelpers.setUser(action.payload.user)
      if (action.payload.account) {
        authHelpers.setAccount(action.payload.account)
      }
    },
    loadAuthFromCookies: (state) => {
      const token = authHelpers.getToken()
      const user = authHelpers.getUser()
      const account = authHelpers.getAccount()
      
      if (token && user) {
        state.token = token
        state.user = user
        state.account = account
        state.isAuthenticated = true
      }
    },
    clearAuth: (state) => {
      state.user = null
      state.account = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      
      // Clear cookies
      authHelpers.clearAll()
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    updateOnboardingStatus: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.onboarding_completed = action.payload
        authHelpers.setUser(state.user) // Update cookie
      }
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(register.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.data.user
      state.account = action.payload.data.account || null
      state.token = action.payload.data.token
      state.isAuthenticated = true
      
      authHelpers.setToken(action.payload.data.token)
      authHelpers.setUser(action.payload.data.user)
      if (action.payload.data.account) {
        authHelpers.setAccount(action.payload.data.account)
      }
    })
    builder.addCase(register.rejected, (state, action: any) => {
      state.loading = false
      state.error = action.payload?.message || 'Registration failed'
    })
    
    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.data.user
      state.account = action.payload.data.account || null
      state.token = action.payload.data.token
      state.isAuthenticated = true
      
      authHelpers.setToken(action.payload.data.token)
      authHelpers.setUser(action.payload.data.user)
      if (action.payload.data.account) {
        authHelpers.setAccount(action.payload.data.account)
      }
    })
    builder.addCase(login.rejected, (state, action: any) => {
      state.loading = false
      state.error = action.payload?.message || 'Login failed'
    })
    
    // Logout
    builder.addCase(logout.pending, (state) => {
      state.loading = true
    })
    builder.addCase(logout.fulfilled, (state) => {
      state.loading = false
      state.user = null
      state.account = null
      state.token = null
      state.isAuthenticated = false
      
      authHelpers.clearAll()
    })
    builder.addCase(logout.rejected, (state) => {
      state.loading = false
      state.user = null
      state.account = null
      state.token = null
      state.isAuthenticated = false
      
      authHelpers.clearAll()
    })
    
    // Get current user
    builder.addCase(getCurrentUser.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.account = action.payload.account
      state.isAuthenticated = true
      
      authHelpers.setUser(action.payload.user)
      if (action.payload.account) {
        authHelpers.setAccount(action.payload.account)
      }
    })
    builder.addCase(getCurrentUser.rejected, (state) => {
      state.loading = false
    })

    // Update user
    builder.addCase(updateUser.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.account = action.payload.account
      
      authHelpers.setUser(action.payload.user)
      if (action.payload.account) {
        authHelpers.setAccount(action.payload.account)
      }
    })
    builder.addCase(updateUser.rejected, (state, action: any) => {
      state.loading = false
      state.error = action.payload?.message || 'Failed to update user'
    })
  },
})

export const { setCredentials, loadAuthFromCookies, clearAuth, setError, clearError, updateOnboardingStatus } = authSlice.actions
export default authSlice.reducer
