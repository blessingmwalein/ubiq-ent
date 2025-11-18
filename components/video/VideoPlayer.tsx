'use client'

import { useEffect, useRef, useState } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import Player from 'video.js/dist/types/player'
import { getMediaUrl } from '@/lib/media-utils'
import { useResponsive } from '@/lib/hooks'

interface VideoPlayerProps {
    src: string
    poster?: string
    autoplay?: boolean
    onTimeUpdate?: (currentTime: number) => void
    onEnded?: () => void
    startTime?: number
}

export default function VideoPlayer({
    src,
    poster,
    autoplay = false,
    onTimeUpdate,
    onEnded,
    startTime = 0,
}: VideoPlayerProps) {
    const videoRef = useRef<HTMLDivElement>(null)
    const playerRef = useRef<Player | null>(null)
    const [isReady, setIsReady] = useState(false)
    const { isMobile } = useResponsive()

    useEffect(() => {
        // Make sure Video.js player is only initialized once
        if (!playerRef.current && videoRef.current) {
            const videoElement = document.createElement('video-js')
            videoElement.classList.add('vjs-big-play-centered')
            videoRef.current.appendChild(videoElement)

            const player = (playerRef.current = videojs(videoElement, {
                autoplay,
                controls: true,
                responsive: true,
                fluid: true,
                playbackRates: isMobile ? [0.75, 1, 1.25, 1.5] : [0.5, 0.75, 1, 1.25, 1.5, 2],
                controlBar: {
                    pictureInPictureToggle: !isMobile,
                    volumePanel: {
                        inline: false,
                    },
                },
                html5: {
                    vhs: {
                        overrideNative: true,
                    },
                    nativeVideoTracks: false,
                    nativeAudioTracks: false,
                    nativeTextTracks: false,
                },
                // Mobile-specific options
                ...(isMobile && {
                    userActions: {
                        doubleClick: false,
                        hotkeys: false,
                    },
                }),
            }))

            // Set source
            player.src({
                src,
                type: 'video/mp4'
                // type: 'application/x-mpegURL', // HLS
            })

            if (poster) {
                // Convert poster URL to backend URL if it's a storage path
                const posterUrl = poster.startsWith('/storage/')
                    ? getMediaUrl(poster)
                    : poster
                player.poster(posterUrl)
            }

            // Event listeners
            player.ready(() => {
                setIsReady(true)
                if (startTime > 0) {
                    player.currentTime(startTime)
                }
            })

            if (onTimeUpdate) {
                player.on('timeupdate', () => {
                    onTimeUpdate(player.currentTime() || 0)
                })
            }

            if (onEnded) {
                player.on('ended', onEnded)
            }

            // Keyboard shortcuts
            player.on('keydown', (e: KeyboardEvent) => {
                const event = e as KeyboardEvent
                switch (event.key) {
                    case ' ':
                    case 'k':
                        event.preventDefault()
                        if (player.paused()) {
                            player.play()
                        } else {
                            player.pause()
                        }
                        break
                    case 'ArrowLeft':
                        event.preventDefault()
                        player.currentTime((player.currentTime() || 0) - 10)
                        break
                    case 'ArrowRight':
                        event.preventDefault()
                        player.currentTime((player.currentTime() || 0) + 10)
                        break
                    case 'j':
                        event.preventDefault()
                        player.currentTime((player.currentTime() || 0) - 10)
                        break
                    case 'l':
                        event.preventDefault()
                        player.currentTime((player.currentTime() || 0) + 10)
                        break
                    case 'ArrowUp':
                        event.preventDefault()
                        player.volume(Math.min(1, (player.volume() || 0) + 0.1))
                        break
                    case 'ArrowDown':
                        event.preventDefault()
                        player.volume(Math.max(0, (player.volume() || 0) - 0.1))
                        break
                    case 'm':
                        event.preventDefault()
                        player.muted(!player.muted())
                        break
                    case 'f':
                        event.preventDefault()
                        if (player.isFullscreen()) {
                            player.exitFullscreen()
                        } else {
                            player.requestFullscreen()
                        }
                        break
                    case '0':
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9':
                        event.preventDefault()
                        const percent = parseInt(event.key) / 10
                        player.currentTime((player.duration() || 0) * percent)
                        break
                }
            })

            // Quality selector (if multiple sources available)
            // This would need to be implemented based on your video source structure
        }

        // Dispose the Video.js player when the component unmounts
        return () => {
            const player = playerRef.current
            if (player && !player.isDisposed()) {
                player.dispose()
                playerRef.current = null
            }
        }
    }, []) // Empty dependency array - only run once

    // Update source when it changes
    useEffect(() => {
        const player = playerRef.current
        if (player && isReady) {
            player.src({
                src,
                type: 'video/mp4',
            })
        }
    }, [src, isReady])

    return (
        <div className="w-full">
            
            <div ref={videoRef} className="video-js-container" />
            <style jsx global>{`
        .video-js {
          width: 100%;
          height: 100%;
        }

        .video-js .vjs-big-play-button {
          border: none;
          background-color: rgba(0, 0, 0, 0.7);
          border-radius: 50%;
          width: 80px;
          height: 80px;
          font-size: 48px;
          line-height: 80px;
          margin-top: -40px;
          margin-left: -40px;
        }

        .video-js .vjs-big-play-button:hover {
          background-color: rgba(37, 99, 235, 0.9);
        }

        .video-js .vjs-control-bar {
          background-color: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
        }

        .video-js .vjs-slider {
          background-color: rgba(255, 255, 255, 0.3);
        }

        .video-js .vjs-load-progress {
          background-color: rgba(255, 255, 255, 0.5);
        }

        .video-js .vjs-play-progress {
          background-color: rgb(37, 99, 235);
        }

        .video-js .vjs-volume-level {
          background-color: rgb(37, 99, 235);
        }

        .video-js:hover .vjs-control-bar {
          display: flex;
          visibility: visible;
          opacity: 1;
        }
      `}</style>
        </div>
    )
}
