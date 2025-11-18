'use client'

import { useState } from 'react'

const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || ''

interface ContentImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string | null | undefined // Relative path from API (e.g., "/storage/images/...")
  alt: string
  fallback?: React.ReactNode
  fallbackText?: string
  // Ignore Next.js Image props that don't apply to native img
  fill?: boolean
  priority?: boolean
  sizes?: string
  quality?: number
}

/**
 * Custom Image component that automatically prepends the base URL from env
 * and handles errors with a fallback. Uses native HTML img tag for better compatibility.
 */
export default function ContentImage({
  src,
  alt,
  fallback,
  fallbackText,
  className,
  // Extract and ignore Next.js Image props
  fill,
  priority,
  sizes,
  quality,
  ...props
}: ContentImageProps) {
  const [imageError, setImageError] = useState(false)

  // Handle null/undefined src
  if (!src) {
    return (
      <>
        {fallback || (
          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 ${className}`}>
            <span className="text-4xl font-bold text-gray-600">
              {fallbackText || alt.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </>
    )
  }

  console.log(src)

  // Build full image URL - ensure no double slashes
  const fullImageUrl = `${imageBaseUrl}${src}`

  console.log('ContentImage Debug:', {
    src,
    imageBaseUrl,
    fullImageUrl,
    imageError
  })

  if (imageError) {
    return (
      <>
        {fallback || (
          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 ${className}`}>
            <span className="text-4xl font-bold text-gray-600">
              {fallbackText || alt.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
      {...props}
    />
  )
}
