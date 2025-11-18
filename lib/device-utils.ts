import { RegisterDevicePayload } from '@/services/accountService'

/**
 * Generate a unique device ID based on browser fingerprint
 */
export const getDeviceId = (): string => {
  // Check if we already have a device ID stored
  const stored = localStorage.getItem('ubiq_device_id')
  if (stored) return stored

  // Generate a new device ID
  const deviceId = `web_${Date.now()}_${Math.random().toString(36).substring(7)}`
  localStorage.setItem('ubiq_device_id', deviceId)
  return deviceId
}

/**
 * Detect device type
 */
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' | 'tv' | 'web' => {
  if (typeof window === 'undefined') return 'web'
  
  const ua = navigator.userAgent
  
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet'
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile'
  }
  if (/TV|SmartTV|GoogleTV|AppleTV|NetCast|NETTV/.test(ua)) {
    return 'tv'
  }
  
  return 'desktop'
}

/**
 * Get OS name and version
 */
export const getOSInfo = (): { name: string; version: string } => {
  if (typeof window === 'undefined') return { name: 'Unknown', version: '0' }
  
  const ua = navigator.userAgent
  let name = 'Unknown'
  let version = '0'

  if (ua.indexOf('Win') !== -1) {
    name = 'Windows'
    if (ua.indexOf('Windows NT 10.0') !== -1) version = '10'
    else if (ua.indexOf('Windows NT 6.3') !== -1) version = '8.1'
    else if (ua.indexOf('Windows NT 6.2') !== -1) version = '8'
    else if (ua.indexOf('Windows NT 6.1') !== -1) version = '7'
  } else if (ua.indexOf('Mac') !== -1) {
    name = 'macOS'
    const match = ua.match(/Mac OS X (\d+)[._](\d+)/)
    if (match) version = `${match[1]}.${match[2]}`
  } else if (ua.indexOf('Linux') !== -1) {
    name = 'Linux'
  } else if (ua.indexOf('Android') !== -1) {
    name = 'Android'
    const match = ua.match(/Android (\d+\.\d+)/)
    if (match) version = match[1]
  } else if (ua.indexOf('iOS') !== -1 || ua.indexOf('iPhone') !== -1 || ua.indexOf('iPad') !== -1) {
    name = 'iOS'
    const match = ua.match(/OS (\d+)_(\d+)/)
    if (match) version = `${match[1]}.${match[2]}`
  }

  return { name, version }
}

/**
 * Get browser name and version
 */
export const getBrowserInfo = (): { name: string; version: string } => {
  if (typeof window === 'undefined') return { name: 'Unknown', version: '0' }
  
  const ua = navigator.userAgent
  let name = 'Unknown'
  let version = '0'

  if (ua.indexOf('Firefox') !== -1) {
    name = 'Firefox'
    const match = ua.match(/Firefox\/(\d+\.\d+)/)
    if (match) version = match[1]
  } else if (ua.indexOf('SamsungBrowser') !== -1) {
    name = 'Samsung Browser'
    const match = ua.match(/SamsungBrowser\/(\d+\.\d+)/)
    if (match) version = match[1]
  } else if (ua.indexOf('Opera') !== -1 || ua.indexOf('OPR') !== -1) {
    name = 'Opera'
    const match = ua.match(/(?:Opera|OPR)\/(\d+\.\d+)/)
    if (match) version = match[1]
  } else if (ua.indexOf('Trident') !== -1) {
    name = 'Internet Explorer'
    const match = ua.match(/rv:(\d+\.\d+)/)
    if (match) version = match[1]
  } else if (ua.indexOf('Edge') !== -1) {
    name = 'Edge'
    const match = ua.match(/Edge\/(\d+\.\d+)/)
    if (match) version = match[1]
  } else if (ua.indexOf('Edg') !== -1) {
    name = 'Edge Chromium'
    const match = ua.match(/Edg\/(\d+\.\d+)/)
    if (match) version = match[1]
  } else if (ua.indexOf('Chrome') !== -1) {
    name = 'Chrome'
    const match = ua.match(/Chrome\/(\d+\.\d+)/)
    if (match) version = match[1]
  } else if (ua.indexOf('Safari') !== -1) {
    name = 'Safari'
    const match = ua.match(/Version\/(\d+\.\d+)/)
    if (match) version = match[1]
  }

  return { name, version }
}

/**
 * Get device name
 */
export const getDeviceName = (): string => {
  const browser = getBrowserInfo()
  const os = getOSInfo()
  const type = getDeviceType()
  
  return `${os.name} ${type.charAt(0).toUpperCase() + type.slice(1)} - ${browser.name}`
}

/**
 * Get IP address (approximation, needs server-side for accuracy)
 */
export const getIPAddress = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    return data.ip
  } catch (error) {
    return 'Unknown'
  }
}

/**
 * Build complete device payload for registration
 */
export const buildDevicePayload = async (): Promise<RegisterDevicePayload> => {
  const os = getOSInfo()
  const browser = getBrowserInfo()
  const deviceType = getDeviceType()
  const deviceId = getDeviceId()
  const deviceName = getDeviceName()
  
  let ipAddress = 'Unknown'
  try {
    ipAddress = await getIPAddress()
  } catch (error) {
    console.warn('Could not fetch IP address')
  }

  return {
    device_id: deviceId,
    device_name: deviceName,
    device_type: deviceType,
    os_name: os.name,
    os_version: os.version,
    app_version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    browser_name: browser.name,
    browser_version: browser.version,
    ip_address: ipAddress,
    location: undefined, // Could be enhanced with geolocation API
  }
}

/**
 * Check if device is already registered
 */
export const isDeviceRegistered = (): boolean => {
  return localStorage.getItem('ubiq_device_registered') === 'true'
}

/**
 * Mark device as registered
 */
export const markDeviceRegistered = (): void => {
  localStorage.setItem('ubiq_device_registered', 'true')
}

/**
 * Clear device registration flag
 */
export const clearDeviceRegistration = (): void => {
  localStorage.removeItem('ubiq_device_registered')
  localStorage.removeItem('ubiq_device_id')
}
