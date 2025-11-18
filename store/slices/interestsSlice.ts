import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import interestService, { Interest } from '@/services/interestService'
import { AxiosError } from 'axios'

export interface InterestsState {
  data: Record<string, Interest[]>
  loading: boolean
  error: string | null
}

const initialState: InterestsState = {
  data: {},
  loading: false,
  error: null,
}

// Async thunks
export const fetchInterests = createAsyncThunk(
  'interests/fetchInterests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await interestService.getInterests()
      return response.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch interests' })
    }
  }
)

// Slice
const interestsSlice = createSlice({
  name: 'interests',
  initialState,
  reducers: {
    clearInterests: (state) => {
      state.data = {}
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInterests.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchInterests.fulfilled, (state, action) => {
      state.loading = false
      state.data = action.payload
    })
    builder.addCase(fetchInterests.rejected, (state, action: any) => {
      state.loading = false
      state.error = action.payload?.message || 'Failed to fetch interests'
    })
  },
})

export const { clearInterests } = interestsSlice.actions
export default interestsSlice.reducer
