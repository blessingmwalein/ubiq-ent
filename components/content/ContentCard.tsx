'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Play, Plus, Info, Check } from 'lucide-react'
import ContentImage from '@/components/ui/ContentImage'
import { useResponsive, useTouchDevice } from '@/lib/hooks'

export interface ContentItem {
    id: number
    title: string
    thumbnail: string
    type: 'movie' | 'series' | 'episode'
    duration?: number
    rating?: string
    year?: number
    progress?: number
    is_in_watchlist?: boolean
    description?: string
    seasonCount?: number
}

interface ContentCardProps {
    content: ContentItem
    onAddToWatchlist?: (id: number) => void
    onRemoveFromWatchlist?: (id: number) => void
    priority?: boolean
}

export default function ContentCard({
    content,
    onAddToWatchlist,
    onRemoveFromWatchlist,
    priority = false
}: ContentCardProps) {
    const router = useRouter()
    const [isHovered, setIsHovered] = useState(false)
    const { isMobile } = useResponsive()
    const isTouch = useTouchDevice()

    const handlePlay = (e: React.MouseEvent) => {
        e.stopPropagation()
        router.push(`/watch/${content.id}`)
    }

    const handleInfo = (e: React.MouseEvent) => {
        e.stopPropagation()
        router.push(`/content/${content.id}`)
    }

    const handleWatchlistToggle = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (content.is_in_watchlist) {
            onRemoveFromWatchlist?.(content.id)
        } else {
            onAddToWatchlist?.(content.id)
        }
    }

    const formatDuration = (minutes?: number) => {
        if (!minutes) return null
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
    }

    return (
        <div
            className={`group relative w-full aspect-video rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ease-in-out ${
                !isMobile && 'hover:scale-110 hover:z-30 hover:shadow-2xl'
            }`}
            onMouseEnter={() => !isTouch && setIsHovered(true)}
            onMouseLeave={() => !isTouch && setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onClick={() => router.push(`/content/${content.id}`)}
        >
            {/* Thumbnail */}
            <div className="relative w-full h-full bg-gray-800">
                <ContentImage
                    src={content.thumbnail}
                    alt={content.title}
                    fill
                    className="object-cover"
                    priority={priority}
                    fallbackText={content.title.charAt(0)}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                />

                {/* Progress Bar */}
                {content.progress && content.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                        <div
                            className="h-full bg-blue-600 transition-all"
                            style={{ width: `${Math.min(content.progress, 100)}%` }}
                        />
                    </div>
                )}

                {/* Gradient Overlay - Always visible but more prominent on hover */}
                <div
                    className={`absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent transition-all duration-300 ${
                        isHovered ? 'from-black/95 via-black/60' : 'from-black/70 via-transparent'
                    }`}
                />

                {/* Type Badge - Always visible */}
                <div className="absolute top-2 right-2 md:top-3 md:right-3 px-2 md:px-2.5 py-0.5 md:py-1 bg-black/80 backdrop-blur-sm text-[10px] md:text-xs font-semibold rounded-md border border-white/20">
                    {content.type === 'series' ? `Series${content.seasonCount ? ` • ${content.seasonCount}S` : ''}` : 'Movie'}
                </div>

                {/* Mobile: Show title always, Desktop: Show on hover */}
                <div
                    className={`absolute inset-0 p-3 md:p-4 flex flex-col justify-end transition-all duration-300 ${
                        isMobile || isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                >
                    {/* Action Buttons - Larger touch targets on mobile */}
                    <div className="flex items-center gap-2 mb-2 md:mb-3">
                        {/* Play Button - Prominent on mobile */}
                        <button
                            onClick={handlePlay}
                            className={`flex items-center justify-center gap-1.5 px-3 md:px-4 py-2.5 md:py-2.5 bg-white hover:bg-gray-100 active:bg-gray-200 text-black rounded-md transition-colors font-semibold text-xs md:text-sm shadow-lg flex-1 ${
                                isMobile ? 'min-h-[44px]' : ''
                            }`}
                        >
                            <Play size={isMobile ? 16 : 14} fill="currentColor" className="md:w-4 md:h-4" />
                            <span>Play</span>
                        </button>

                        {/* Watchlist Button - Larger touch area on mobile */}
                        <button
                            onClick={handleWatchlistToggle}
                            className={`p-2.5 md:p-2.5 bg-gray-800/90 hover:bg-gray-700 active:bg-gray-600 border border-gray-600 rounded-full transition-all hover:scale-110 active:scale-95 shadow-lg backdrop-blur-sm ${
                                isMobile ? 'min-w-[44px] min-h-[44px]' : ''
                            }`}
                            title={content.is_in_watchlist ? 'Remove from My List' : 'Add to My List'}
                        >
                            {content.is_in_watchlist ? (
                                <Check size={isMobile ? 20 : 16} className="text-green-400" />
                            ) : (
                                <Plus size={isMobile ? 20 : 16} />
                            )}
                        </button>

                        {/* Info Button - Desktop only or tablet */}
                        {!isMobile && (
                            <button
                                onClick={handleInfo}
                                className="p-2.5 md:p-2.5 bg-gray-800/90 hover:bg-gray-700 border border-gray-600 rounded-full transition-all hover:scale-110 shadow-lg backdrop-blur-sm"
                                title="More info"
                            >
                                <Info size={16} className="md:w-[18px] md:h-[18px]" />
                            </button>
                        )}
                    </div>

                    {/* Title and Metadata */}
                    <div className="space-y-1.5 md:space-y-2">
                        <h3 className="font-bold text-white text-sm md:text-base line-clamp-1 md:line-clamp-2 leading-tight">
                            {content.title}
                        </h3>
                        
                        {/* Description - Only on hover */}
                        {content.description && (
                            <p className="hidden md:block text-xs text-gray-300 line-clamp-2 leading-relaxed">
                                {content.description}
                            </p>
                        )}
                        
                        <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-gray-300 flex-wrap">
                            {content.rating && (
                                <span className="px-1.5 md:px-2 py-0.5 border border-gray-500 rounded text-white font-medium">
                                    {content.rating}
                                </span>
                            )}
                            {content.year && <span className="font-medium">{content.year}</span>}
                            {formatDuration(content.duration) && (
                                <span className="hidden sm:inline">{formatDuration(content.duration)}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
