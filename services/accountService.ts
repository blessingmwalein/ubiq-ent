import apiClient from '@/lib/api-client'

export interface Device {
  id: number
  uuid: string
  user_id: number
  device_id: string
  device_name: string
  device_type: string
  os_name: string
  os_version: string
  app_version: string | null
  browser_name: string | null
  browser_version: string | null
  ip_address: string
  location: string | null
  is_active: boolean
  last_used_at: string
  registered_at: string
  created_at: string
  updated_at: string
  is_current?: boolean
}

export interface Package {
  id: number
  uuid: string
  key: string
  title: string
  description: string
  max_profiles: number
  price_monthly: string
  price_yearly: string
  features: string[]
  is_active: boolean
  trial_days: number
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: number
  uuid: string
  account_id: number
  package_id: number
  provider: string
  provider_subscription_id: string | null
  status: string
  billing_cycle: 'monthly' | 'yearly'
  is_trial: boolean
  started_at: string
  current_period_start: string
  current_period_end: string
  expires_at: string | null
  cancelled_at: string | null
  created_at: string
  updated_at: string
  package: Package
  package_title?: string
  package_key?: string
  price_monthly?: number
  price_yearly?: number
  next_billing_date?: string
  trial_ends_at?: string | null
}

export interface RegisterDevicePayload {
  device_id: string
  device_name: string
  device_type: 'mobile' | 'tablet' | 'desktop' | 'tv' | 'web'
  os_name: string
  os_version: string
  app_version?: string
  browser_name?: string
  browser_version?: string
  ip_address?: string
  location?: string
}

export interface DeviceStatistics {
  total_devices: number
  active_devices: number
  device_types: Record<string, number>
  most_recent: Device
}

class AccountService {
  // Devices
  async getDevices() {
    const response = await apiClient.get('/devices')
    return response.data
  }

  async registerDevice(payload: RegisterDevicePayload) {
    const response = await apiClient.post('/devices/register', payload)
    return response.data
  }

  async verifyDevice(deviceId: string) {
    const response = await apiClient.post('/devices/verify', { device_id: deviceId })
    return response.data
  }

  async removeDevice(uuid: string) {
    const response = await apiClient.delete(`/devices/${uuid}`)
    return response.data
  }

  async logoutDevice(deviceId: string) {
    const response = await apiClient.post('/devices/logout', { device_id: deviceId })
    return response.data
  }

  async logoutAllDevices() {
    const response = await apiClient.post('/devices/logout-all')
    return response.data
  }

  async getDeviceStatistics() {
    const response = await apiClient.get('/devices/statistics')
    return response.data
  }

  // Subscription
  async getSubscription() {
    const response = await apiClient.get('/subscriptions')
    return response.data
  }

  async cancelSubscription() {
    const response = await apiClient.post('/subscriptions/cancel')
    return response.data
  }

  async renewSubscription() {
    const response = await apiClient.post('/subscriptions/renew')
    return response.data
  }

  // Packages
  async getPackages() {
    const response = await apiClient.get('/packages')
    return response.data
  }
}

export default new AccountService()
