import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import accountService, { Device, Subscription, Package, RegisterDevicePayload, DeviceStatistics } from '@/services/accountService'
import { AxiosError } from 'axios'

export interface AccountState {
  devices: Device[]
  subscription: Subscription | null
  packages: Package[]
  deviceStatistics: DeviceStatistics | null
  devicesLoading: boolean
  subscriptionLoading: boolean
  packagesLoading: boolean
  registeringDevice: boolean
  error: string | null
}

const initialState: AccountState = {
  devices: [],
  subscription: null,
  packages: [],
  deviceStatistics: null,
  devicesLoading: false,
  subscriptionLoading: false,
  packagesLoading: false,
  registeringDevice: false,
  error: null,
}

// Async thunks - Devices
export const fetchDevices = createAsyncThunk(
  'account/fetchDevices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await accountService.getDevices()
      return response.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch devices' })
    }
  }
)

export const registerDevice = createAsyncThunk(
  'account/registerDevice',
  async (payload: RegisterDevicePayload, { rejectWithValue }) => {
    try {
      const response = await accountService.registerDevice(payload)
      return response.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to register device' })
    }
  }
)

export const removeDevice = createAsyncThunk(
  'account/removeDevice',
  async (uuid: string, { rejectWithValue }) => {
    try {
      await accountService.removeDevice(uuid)
      return uuid
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to remove device' })
    }
  }
)

export const logoutDevice = createAsyncThunk(
  'account/logoutDevice',
  async (deviceId: string, { rejectWithValue }) => {
    try {
      await accountService.logoutDevice(deviceId)
      return deviceId
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to logout device' })
    }
  }
)

export const logoutAllDevices = createAsyncThunk(
  'account/logoutAllDevices',
  async (_, { rejectWithValue }) => {
    try {
      await accountService.logoutAllDevices()
      return true
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to logout all devices' })
    }
  }
)

export const fetchDeviceStatistics = createAsyncThunk(
  'account/fetchDeviceStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await accountService.getDeviceStatistics()
      return response.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch device statistics' })
    }
  }
)

// Async thunks - Subscription
export const fetchSubscription = createAsyncThunk(
  'account/fetchSubscription',
  async (_, { rejectWithValue }) => {
    try {
      const response = await accountService.getSubscription()
      return response.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch subscription' })
    }
  }
)

export const cancelSubscription = createAsyncThunk(
  'account/cancelSubscription',
  async (_, { rejectWithValue }) => {
    try {
      const response = await accountService.cancelSubscription()
      return response.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to cancel subscription' })
    }
  }
)

export const renewSubscription = createAsyncThunk(
  'account/renewSubscription',
  async (_, { rejectWithValue }) => {
    try {
      const response = await accountService.renewSubscription()
      return response.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to renew subscription' })
    }
  }
)

// Async thunks - Packages
export const fetchPackages = createAsyncThunk(
  'account/fetchPackages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await accountService.getPackages()
      return response.data
    } catch (error) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch packages' })
    }
  }
)

// Slice
const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    clearAccountData: (state) => {
      state.devices = []
      state.subscription = null
      state.packages = []
      state.deviceStatistics = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch devices
    builder.addCase(fetchDevices.pending, (state) => {
      state.devicesLoading = true
      state.error = null
    })
    builder.addCase(fetchDevices.fulfilled, (state, action) => {
      state.devicesLoading = false
      state.devices = action.payload
    })
    builder.addCase(fetchDevices.rejected, (state, action: any) => {
      state.devicesLoading = false
      state.error = action.payload?.message || 'Failed to fetch devices'
    })

    // Register device
    builder.addCase(registerDevice.pending, (state) => {
      state.registeringDevice = true
      state.error = null
    })
    builder.addCase(registerDevice.fulfilled, (state, action) => {
      state.registeringDevice = false
      state.devices.push(action.payload)
    })
    builder.addCase(registerDevice.rejected, (state, action: any) => {
      state.registeringDevice = false
      state.error = action.payload?.message || 'Failed to register device'
    })

    // Remove device
    builder.addCase(removeDevice.fulfilled, (state, action) => {
      state.devices = state.devices.filter((d) => d.uuid !== action.payload)
    })

    // Logout all devices
    builder.addCase(logoutAllDevices.fulfilled, (state) => {
      state.devices = []
    })

    // Fetch device statistics
    builder.addCase(fetchDeviceStatistics.fulfilled, (state, action) => {
      state.deviceStatistics = action.payload
    })

    // Fetch subscription
    builder.addCase(fetchSubscription.pending, (state) => {
      state.subscriptionLoading = true
      state.error = null
    })
    builder.addCase(fetchSubscription.fulfilled, (state, action) => {
      state.subscriptionLoading = false
      state.subscription = action.payload
    })
    builder.addCase(fetchSubscription.rejected, (state, action: any) => {
      state.subscriptionLoading = false
      state.error = action.payload?.message || 'Failed to fetch subscription'
    })

    // Cancel subscription
    builder.addCase(cancelSubscription.fulfilled, (state, action) => {
      if (state.subscription) {
        state.subscription = action.payload
      }
    })

    // Renew subscription
    builder.addCase(renewSubscription.fulfilled, (state, action) => {
      state.subscription = action.payload
    })

    // Fetch packages
    builder.addCase(fetchPackages.pending, (state) => {
      state.packagesLoading = true
      state.error = null
    })
    builder.addCase(fetchPackages.fulfilled, (state, action) => {
      state.packagesLoading = false
      state.packages = action.payload
    })
    builder.addCase(fetchPackages.rejected, (state, action: any) => {
      state.packagesLoading = false
      state.error = action.payload?.message || 'Failed to fetch packages'
    })
  },
})

export const { clearAccountData } = accountSlice.actions
export default accountSlice.reducer
