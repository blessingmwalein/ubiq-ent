import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import Cookies from 'js-cookie'

// Cookie keys
export const AUTH_TOKEN_KEY = 'ubiq_auth_token'
export const USER_KEY = 'ubiq_user'
export const ACCOUNT_KEY = 'ubiq_account'
export const PROFILE_KEY = 'ubiq_selected_profile'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from cookies
    const token = Cookies.get(AUTH_TOKEN_KEY)
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      // Clear auth data
      Cookies.remove(AUTH_TOKEN_KEY)
      Cookies.remove(USER_KEY)
      Cookies.remove(PROFILE_KEY)
      
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    
    // Handle 403 Forbidden (subscription required)
    if (error.response?.status === 403) {
      const errorMessage = (error.response.data as any)?.message || ''
      if (errorMessage.toLowerCase().includes('subscription')) {
        if (typeof window !== 'undefined') {
          window.location.href = '/pricing'
        }
      }
    }
    
    return Promise.reject(error)
  }
)

// Helper functions for auth data management
export const authHelpers = {
  setToken: (token: string) => {
    Cookies.set(AUTH_TOKEN_KEY, token, { 
      expires: 30, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
      path: '/'
    })
  },
  
  getToken: () => {
    return Cookies.get(AUTH_TOKEN_KEY)
  },
  
  removeToken: () => {
    Cookies.remove(AUTH_TOKEN_KEY, { path: '/' })
  },
  
  setUser: (user: any) => {
    Cookies.set(USER_KEY, JSON.stringify(user), { 
      expires: 30, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    })
  },
  
  getUser: () => {
    const user = Cookies.get(USER_KEY)
    return user ? JSON.parse(user) : null
  },
  
  removeUser: () => {
    Cookies.remove(USER_KEY, { path: '/' })
  },
  
  setAccount: (account: any) => {
    Cookies.set(ACCOUNT_KEY, JSON.stringify(account), { 
      expires: 30, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    })
  },
  
  getAccount: () => {
    const account = Cookies.get(ACCOUNT_KEY)
    return account ? JSON.parse(account) : null
  },
  
  removeAccount: () => {
    Cookies.remove(ACCOUNT_KEY, { path: '/' })
  },
  
  setProfile: (profile: any) => {
    Cookies.set(PROFILE_KEY, JSON.stringify(profile), { 
      expires: 30, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    })
  },
  
  getProfile: () => {
    const profile = Cookies.get(PROFILE_KEY)
    return profile ? JSON.parse(profile) : null
  },
  
  removeProfile: () => {
    Cookies.remove(PROFILE_KEY, { path: '/' })
  },
  
  clearAll: () => {
    Cookies.remove(AUTH_TOKEN_KEY, { path: '/' })
    Cookies.remove(USER_KEY, { path: '/' })
    Cookies.remove(ACCOUNT_KEY, { path: '/' })
    Cookies.remove(PROFILE_KEY, { path: '/' })
  },
}

export default apiClient
