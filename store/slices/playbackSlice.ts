import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { playbackService } from '@/services/playbackService'
import type {
  PlaybackToken,
  PlaybackStream,
  PlaybackQuality,
  ProgressUpdate,
} from '@/services/playbackService'
import { AxiosError } from 'axios'

export interface PlaybackState {
  token: string | null
  expiresAt: string | null
  streamUrl: string | null
  variants: any[]
  qualities: PlaybackQuality[]
  currentQuality: string | null
  resumePosition: number
  duration: number
  contentId: number | null
  title: string | null
  loading: boolean
  error: string | null
}

const initialState: PlaybackState = {
  token: null,
  expiresAt: null,
  streamUrl: null,
  variants: [],
  qualities: [],
  currentQuality: null,
  resumePosition: 0,
  duration: 0,
  contentId: null,
  title: null,
  loading: false,
  error: null,
}

// Async thunks
export const requestPlaybackToken = createAsyncThunk(
  'playback/requestToken',
  async (
    { profileId, contentItemId }: { profileId: number; contentItemId: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await playbackService.requestToken({ 
        profile_id: profileId, 
        content_item_id: contentItemId 
      })
      return response.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to request playback token' })
    }
  }
)

export const validatePlaybackToken = createAsyncThunk(
  'playback/validateToken',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await playbackService.validateToken(token)
      return response.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Invalid or expired token' })
    }
  }
)

export const fetchHlsManifest = createAsyncThunk(
  'playback/fetchHlsManifest',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await playbackService.getHlsManifest(token)
      return response.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch HLS manifest' })
    }
  }
)

export const fetchQualities = createAsyncThunk(
  'playback/fetchQualities',
  async (contentId: number, { rejectWithValue }) => {
    try {
      const response = await playbackService.getQualities(contentId)
      return response.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch qualities' })
    }
  }
)

export const fetchResumePosition = createAsyncThunk(
  'playback/fetchResumePosition',
  async (
    { contentId, profileId }: { contentId: number; profileId: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await playbackService.getResumePosition(contentId, profileId)
      return response.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch resume position' })
    }
  }
)

export const updatePlaybackProgress = createAsyncThunk(
  'playback/updateProgress',
  async (
    { token, data }: { token: string; data: ProgressUpdate },
    { rejectWithValue }
  ) => {
    try {
      const response = await playbackService.updateProgress(token, data)
      return response.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to update progress' })
    }
  }
)

// Slice
const playbackSlice = createSlice({
  name: 'playback',
  initialState,
  reducers: {
    clearPlayback: (state) => {
      state.token = null
      state.expiresAt = null
      state.streamUrl = null
      state.variants = []
      state.qualities = []
      state.currentQuality = null
      state.resumePosition = 0
      state.duration = 0
      state.contentId = null
      state.title = null
      state.error = null
    },
    setCurrentQuality: (state, action) => {
      state.currentQuality = action.payload
    },
    setResumePosition: (state, action) => {
      state.resumePosition = action.payload
    },
  },
  extraReducers: (builder) => {
    // Request playback token
    builder.addCase(requestPlaybackToken.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(requestPlaybackToken.fulfilled, (state, action) => {
      state.loading = false
      const tokenData = action.payload as PlaybackToken
      state.token = tokenData.token
      state.expiresAt = tokenData.expires_at
    })
    builder.addCase(requestPlaybackToken.rejected, (state, action: any) => {
      state.loading = false
      state.error = action.payload?.message || 'Failed to request playback token'
    })

    // Validate token
    builder.addCase(validatePlaybackToken.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(validatePlaybackToken.fulfilled, (state, action) => {
      state.loading = false
      // Token is valid, update if needed
      if (action.payload.token) {
        state.token = action.payload.token
      }
    })
    builder.addCase(validatePlaybackToken.rejected, (state, action: any) => {
      state.loading = false
      state.error = action.payload?.message || 'Invalid or expired token'
      // Clear token if invalid
      state.token = null
      state.expiresAt = null
      state.streamUrl = null
    })

    // Fetch HLS manifest
    builder.addCase(fetchHlsManifest.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchHlsManifest.fulfilled, (state, action) => {
      state.loading = false
      const streamData = action.payload as PlaybackStream
      state.contentId = streamData.content_id
      state.title = streamData.title
      state.variants = streamData.variants || []
      state.resumePosition = streamData.resume_position
      state.duration = streamData.duration
      state.token = streamData.token
      state.expiresAt = streamData.expires_at
      
      // Use the URL directly from the backend as-is
      if (streamData.variants && streamData.variants.length > 0) {
        state.streamUrl = streamData.variants[0].url
      }
    })
    builder.addCase(fetchHlsManifest.rejected, (state, action: any) => {
      state.loading = false
      state.error = action.payload?.message || 'Failed to fetch HLS manifest'
    })

    // Fetch qualities
    builder.addCase(fetchQualities.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchQualities.fulfilled, (state, action) => {
      state.loading = false
      state.qualities = action.payload
      // Set default quality to the first one
      if (action.payload.length > 0 && !state.currentQuality) {
        state.currentQuality = action.payload[0].quality
      }
    })
    builder.addCase(fetchQualities.rejected, (state, action: any) => {
      state.loading = false
      state.error = action.payload?.message || 'Failed to fetch qualities'
    })

    // Fetch resume position
    builder.addCase(fetchResumePosition.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchResumePosition.fulfilled, (state, action) => {
      state.loading = false
      if (action.payload.position !== undefined) {
        state.resumePosition = action.payload.position
      }
    })
    builder.addCase(fetchResumePosition.rejected, (state, action: any) => {
      state.loading = false
      state.error = action.payload?.message || 'Failed to fetch resume position'
    })

    // Update progress
    builder.addCase(updatePlaybackProgress.pending, (state) => {
      // Don't show loading for progress updates
    })
    builder.addCase(updatePlaybackProgress.fulfilled, (state, action) => {
      // Progress updated successfully
    })
    builder.addCase(updatePlaybackProgress.rejected, (state, action: any) => {
      // Silently fail progress updates
      console.error('Failed to update progress:', action.payload?.message)
    })
  },
})

export const { clearPlayback, setCurrentQuality, setResumePosition } = playbackSlice.actions
export default playbackSlice.reducer
