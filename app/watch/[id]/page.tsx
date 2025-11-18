'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchContentById } from '@/store/slices/contentSlice'
import {
  requestPlaybackToken,
  fetchHlsManifest,
  fetchResumePosition,
  updatePlaybackProgress,
  fetchQualities,
  clearPlayback,
  setCurrentQuality,
} from '@/store/slices/playbackSlice'
import { ArrowLeft, Settings, Loader2 } from 'lucide-react'
import VideoPlayer from '@/components/video/VideoPlayer'
import LoadingSpinner from '@/components/ui/loading'
import { toast } from 'sonner'
import { useResponsive } from '@/lib/hooks'

export default function WatchPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { currentItem, loading: contentLoading } = useAppSelector((state) => state.content)
  const { selectedProfile } = useAppSelector((state) => state.profiles)
  const {
    token,
    streamUrl,
    variants,
    qualities,
    currentQuality,
    resumePosition,
    loading: playbackLoading,
    error: playbackError,
  } = useAppSelector((state) => state.playback)

  const { isMobile } = useResponsive()
  const contentId = parseInt(params.id as string)
  const [showQualityMenu, setShowQualityMenu] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const progressUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const currentTimeRef = useRef(0)

  //use effect fetch 

  useEffect(() => {
    if (contentId) {
      dispatch(fetchContentById(contentId))
    }
  }, [contentId, dispatch])

  // Initialize playback when content and profile are loaded
  useEffect(() => {
    const initializePlayback = async () => {
      if (!currentItem || !selectedProfile || isInitialized) return

      console.log('🎬 Starting playback initialization...', {
        contentId: currentItem.id,
        profileId: selectedProfile.id,
        title: currentItem.title
      })

      try {
        // Step 1: Request playback token
        console.log('📡 Step 1: Requesting playback token...')
        const tokenResult = await dispatch(
          requestPlaybackToken({
            profileId: selectedProfile.id,
            contentItemId: currentItem.id,
          })
        ).unwrap()
        console.log('✅ Token received:', tokenResult)

        // Step 2: Fetch HLS manifest with the token
        if (tokenResult.token) {
          console.log('📡 Step 2: Fetching HLS manifest...')
          const manifestResult = await dispatch(fetchHlsManifest(tokenResult.token)).unwrap()
          console.log('✅ Manifest received:', manifestResult)
        }

        // Step 3: Fetch resume position (optional - don't fail if this errors)
        console.log('📡 Step 3: Fetching resume position...')
        try {
          await dispatch(
            fetchResumePosition({
              contentId: currentItem.id,
              profileId: selectedProfile.id,
            })
          ).unwrap()
          console.log('✅ Resume position fetched')
        } catch (resumeError) {
          console.warn('⚠️ Resume position fetch failed (non-critical):', resumeError)
        }

        // Step 4: Fetch available qualities (optional - don't fail if this errors)
        console.log('📡 Step 4: Fetching qualities...')
        try {
          await dispatch(fetchQualities(currentItem.id)).unwrap()
          console.log('✅ Qualities fetched')
        } catch (qualityError) {
          console.warn('⚠️ Quality fetch failed (non-critical):', qualityError)
        }

        console.log('✅ Playback initialization complete!')
        setIsInitialized(true)
      } catch (error: any) {
        console.error('❌ Playback initialization error:', error)
        toast.error(error.message || 'Failed to initialize playback')
        // Redirect back if initialization fails
        setTimeout(() => {
          router.push(`/content/${contentId}`)
        }, 2000)
      }
    }

    initializePlayback()
  }, [currentItem, selectedProfile, contentId, dispatch, router, isInitialized])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressUpdateIntervalRef.current) {
        clearInterval(progressUpdateIntervalRef.current)
      }
      dispatch(clearPlayback())
    }
  }, [dispatch])

  // Save progress periodically to backend
  const handleTimeUpdate = (currentTime: number) => {
    currentTimeRef.current = currentTime

    // Update progress every 10 seconds
    if (!progressUpdateIntervalRef.current && token && currentItem) {
      progressUpdateIntervalRef.current = setInterval(() => {
        if (token && currentTimeRef.current > 0) {
          dispatch(
            updatePlaybackProgress({
              token,
              data: {
                position: currentTimeRef.current,
                duration: currentItem.duration_seconds,
                quality: currentQuality || undefined,
              },
            })
          ).catch((error) => {
            console.error('Failed to update progress:', error)
          })
        }
      }, 10000) // Update every 10 seconds
    }
  }

  const handleVideoEnded = async () => {
    if (currentItem && token) {
      try {
        // Send final progress update (100% completion)
        await dispatch(
          updatePlaybackProgress({
            token,
            data: {
              position: currentItem.duration_seconds,
              duration: currentItem.duration_seconds,
              quality: currentQuality || undefined,
            },
          })
        ).unwrap()

        toast.success('Video completed!')

        // Clear interval
        if (progressUpdateIntervalRef.current) {
          clearInterval(progressUpdateIntervalRef.current)
          progressUpdateIntervalRef.current = null
        }

        // Redirect back to content page
        setTimeout(() => {
          router.push(`/content/${currentItem.id}`)
        }, 2000)
      } catch (error) {
        console.error('Failed to mark video as completed:', error)
        router.push(`/content/${currentItem.id}`)
      }
    }
  }

  const handleBack = () => {
    // Clear progress interval before leaving
    if (progressUpdateIntervalRef.current) {
      clearInterval(progressUpdateIntervalRef.current)
      progressUpdateIntervalRef.current = null
    }

    if (currentItem) {
      router.push(`/content/${currentItem.id}`)
    } else {
      router.push('/browse')
    }
  }

  const handleQualityChange = (quality: string) => {
    dispatch(setCurrentQuality(quality))
    setShowQualityMenu(false)
    toast.success(`Quality changed to ${quality}`)
  }

  // Show loading state
  if (contentLoading || !currentItem) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4 px-4">
          <LoadingSpinner size={isMobile ? 'md' : 'lg'} />
          <p className="text-sm md:text-base text-gray-400">Loading content...</p>
        </div>
      </div>
    )
  }

  // Show loading state while initializing playback
  if (!isInitialized || playbackLoading || !streamUrl) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4 px-4">
          <Loader2 className={`${isMobile ? 'w-8 h-8' : 'w-12 h-12'} text-blue-500 animate-spin mx-auto`} />
          <p className="text-sm md:text-base text-gray-400">Initializing playback...</p>
          <p className="text-xs md:text-sm text-gray-500">Requesting secure stream</p>
        </div>
      </div>
    )
  }

  // Show error if playback failed
  if (playbackError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} rounded-full bg-red-500/20 flex items-center justify-center mx-auto`}>
            <span className={`${isMobile ? 'text-2xl' : 'text-3xl'}`}>⚠️</span>
          </div>
          <h2 className="text-lg md:text-xl font-semibold text-white">Playback Error</h2>
          <p className="text-sm md:text-base text-gray-400">{playbackError}</p>
          <button
            onClick={handleBack}
            className="px-4 md:px-6 py-2 md:py-3 text-sm md:text-base bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Check if profile is selected
  if (!selectedProfile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto`}>
            <span className={`${isMobile ? 'text-2xl' : 'text-3xl'}`}>👤</span>
          </div>
          <h2 className="text-lg md:text-xl font-semibold text-white">Profile Required</h2>
          <p className="text-sm md:text-base text-gray-400">Please select a profile to watch content</p>
          <button
            onClick={() => router.push('/profiles')}
            className="px-4 md:px-6 py-2 md:py-3 text-sm md:text-base bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Select Profile
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Back Button Overlay - Mobile Responsive */}
      <div className={`absolute top-0 left-0 right-0 z-50 ${isMobile ? 'p-2' : 'p-4'} bg-gradient-to-b from-black/80 to-transparent`}>
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className={`flex items-center ${isMobile ? 'gap-1 px-2 py-1.5 text-sm' : 'gap-2 px-4 py-2'} bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-lg text-white transition-colors`}
          >
            <ArrowLeft size={isMobile ? 16 : 20} />
            <span>Back</span>
          </button>

          {/* Quality Selector - Mobile Responsive */}
          {qualities.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowQualityMenu(!showQualityMenu)}
                className={`flex items-center ${isMobile ? 'gap-1 px-2 py-1.5' : 'gap-2 px-4 py-2'} bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-lg text-white transition-colors`}
              >
                <Settings size={isMobile ? 16 : 20} />
                {!isMobile && <span>{currentQuality || 'Auto'}</span>}
              </button>

              {/* Quality Menu Dropdown - Mobile Responsive */}
              {showQualityMenu && (
                <div className={`absolute right-0 mt-2 ${isMobile ? 'w-40' : 'w-48'} bg-black/95 backdrop-blur-xl border border-gray-700 rounded-lg shadow-2xl overflow-hidden`}>
                  <div className="py-2">
                    <div className={`px-3 md:px-4 py-2 ${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-400 font-semibold uppercase`}>
                      Video Quality
                    </div>
                    {qualities.map((q) => (
                      <button
                        key={q.quality}
                        onClick={() => handleQualityChange(q.quality)}
                        className={`w-full px-3 md:px-4 py-2 text-left hover:bg-white/10 transition-colors ${
                          currentQuality === q.quality
                            ? 'bg-blue-600/20 text-blue-400'
                            : 'text-white'
                        }`}
                      >
                        <div className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>{q.quality}</div>
                        <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-400`}>
                          {q.resolution} • {q.file_size}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Video Player */}
      <div className="w-full min-h-screen flex items-center justify-center bg-black">
        <div className="w-full max-w-[1920px]">
          <VideoPlayer
            src={streamUrl}
            poster={currentItem.thumbnail_url || currentItem.poster_url}
            autoplay={true}
            startTime={resumePosition}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
          />
        </div>
      </div>

      {/* Info Overlay - Mobile Responsive */}
      <div className={`absolute bottom-0 left-0 right-0 ${isMobile ? 'p-3' : 'p-8'} bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none`}>
        <div className="max-w-4xl space-y-1 md:space-y-2">
          <h1 className={`${isMobile ? 'text-lg' : 'text-2xl md:text-4xl'} font-bold text-white mb-1 md:mb-2 line-clamp-2`}>
            {currentItem.title}
          </h1>
          <div className={`flex items-center ${isMobile ? 'gap-2 text-xs' : 'gap-4 text-sm'} text-gray-300 flex-wrap`}>
            <span>{currentItem.release_year}</span>
            <span className={`${isMobile ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'} bg-gray-700 rounded uppercase`}>
              {currentItem.maturity_rating || 'PG-13'}
            </span>
            <span className="capitalize">{currentItem.type}</span>
            {currentItem.provider && !isMobile && (
              <span className="text-gray-400">• {currentItem.provider.display_name}</span>
            )}
          </div>
          {token && (
            <div className={`flex items-center gap-2 ${isMobile ? 'text-[10px]' : 'text-xs'} text-green-400`}>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>{isMobile ? 'Secure' : 'Secure streaming active'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Variants Info - Hide on Mobile */}
      {variants.length > 0 && !isMobile && (
        <div className="fixed top-20 right-4 z-40 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-300 max-w-xs">
          <div className="font-semibold text-white mb-2">Stream Info</div>
          <div className="space-y-1">
            <div>Variants: {variants.length}</div>
            {variants.slice(0, 3).map((v, i) => (
              <div key={i} className="text-[10px] text-gray-400">
                {v.quality} • {v.resolution}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Help - Hide on Mobile */}
      {!isMobile && (
        <div className="fixed bottom-4 right-4 z-40 pointer-events-none">
          <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 text-xs text-gray-300 space-y-1 max-w-xs">
            <div className="font-semibold text-white mb-2">Keyboard Shortcuts</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <span>Space / K</span>
              <span>Play/Pause</span>
              <span>← / →</span>
              <span>Skip ±10s</span>
              <span>↑ / ↓</span>
              <span>Volume</span>
              <span>F</span>
              <span>Fullscreen</span>
              <span>M</span>
              <span>Mute</span>
              <span>0-9</span>
              <span>Jump %</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
