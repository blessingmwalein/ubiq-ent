import apiClient from '@/lib/api-client'

export interface PlaybackTokenRequest {
  profile_id: number
  content_item_id: number
}

export interface PlaybackToken {
  token: string
  expires_at: string
}

export interface PlaybackVariant {
  quality: string
  bandwidth: number
  resolution: string
  url: string
}

export interface PlaybackStream {
  content_id: number
  title: string
  variants: PlaybackVariant[]
  resume_position: number
  duration: number
  token: string
  expires_at: string
}

export interface PlaybackQuality {
  quality: string
  bandwidth: number
  resolution: string
  file_size: string
}

export interface ProgressUpdate {
  position: number
  duration?: number
  quality?: string
}

export const playbackService = {
  // Request playback token
  requestToken: async (data: PlaybackTokenRequest) => {
    const response = await apiClient.post('/playback/token', data)
    return response.data
  },

  // Get streaming URL
  getStreamUrl: async (token: string) => {
    const response = await apiClient.get(`/playback/stream/${token}`)
    return response.data
  },

  // Validate playback token
  validateToken: async (token: string) => {
    const response = await apiClient.get(`/playback/validate/${token}`)
    return response.data
  },

  // Get HLS manifest
  getHlsManifest: async (token: string) => {
    const response = await apiClient.get(`/playback/hls/${token}`)
    return response.data
  },

  // Get quality options
  getQualities: async (contentId: number) => {
    const response = await apiClient.get(`/playback/qualities/${contentId}`)
    return response.data
  },

  // Get resume position
  getResumePosition: async (contentId: number, profileId: number) => {
    const response = await apiClient.get(`/playback/resume/${contentId}/${profileId}`)
    return response.data
  },

  // Update watch progress
  updateProgress: async (token: string, data: ProgressUpdate) => {
    const response = await apiClient.post(`/playback/progress/${token}`, data)
    return response.data
  },
}
