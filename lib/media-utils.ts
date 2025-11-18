/**
 * Utility functions for handling media URLs from the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1/api'
const BACKEND_URL = API_BASE_URL.replace('/api', '')

/**
 * Convert storage path to full backend URL
 * Handles both /storage/... and storage/... paths
 */
export function getMediaUrl(path: string | null | undefined): string {
  if (!path) return ''
  
  // If it's already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.substring(1) : path
  
  // Return full backend URL
  return `${BACKEND_URL}/${cleanPath}`
}

/**
 * Get proxied image URL (for images that need authentication)
 * This would use a backend endpoint that serves images with proper auth/CORS
 */
export function getProxiedImageUrl(path: string | null | undefined): string {
  if (!path) return ''
  
  // For now, use the direct URL
  // TODO: Implement /api/media/image/{path} endpoint in backend for protected images
  return getMediaUrl(path)
}

/**
 * Get streaming URL with token
 * This should always go through the backend API
 */
export function getStreamingUrl(token: string): string {
  return `${API_BASE_URL}/playback/stream/${token}`
}

/**
 * Check if URL needs proxying (is a storage path)
 */
export function isStoragePath(url: string | null | undefined): boolean {
  if (!url) return false
  return url.includes('/storage/') || url.startsWith('storage/')
}

/**
 * Get HLS manifest URL with token
 */
export function getHlsManifestUrl(token: string): string {
  return `${API_BASE_URL}/playback/hls/${token}/master.m3u8`
}
