 'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchContentById, toggleFavorite } from '@/store/slices/contentSlice'
import { MainLayout } from '@/components/layout'
import { 
    Play, Plus, ThumbsUp, Share2, Check, 
    Info, Tag, Building2, Calendar, Clock, Eye, 
    Film, Star, Globe, Video, HardDrive, CheckCircle2, Loader2, Tv, ChevronDown, ChevronUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import LoadingSpinner from '@/components/ui/loading'
import ContentRow from '@/components/content/ContentRow'
import SeasonEpisodeList from '@/components/content/SeasonEpisodeList'
import { toast } from 'sonner'
import ContentImage from '@/components/ui/ContentImage'
import { useResponsive } from '@/lib/hooks'

export default function ContentDetailPage() {
    const params = useParams()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { currentItem, loading, trending } = useAppSelector((state) => state.content)
    const { user } = useAppSelector((state) => state.auth)
    const { selectedProfile } = useAppSelector((state) => state.profiles)
    const { isMobile, isTablet } = useResponsive()

    const contentId = parseInt(params.id as string)

    const [isTrailerOpen, setIsTrailerOpen] = useState(false)

    useEffect(() => {
        if (contentId) {
            dispatch(fetchContentById(contentId))
        }
    }, [contentId, dispatch])

    const handleToggleFavorite = async () => {
        if (!selectedProfile) {
            toast.error('Please select a profile first')
            return
        }

        try {
            const result = await dispatch(toggleFavorite({ 
                contentId, 
                profileId: selectedProfile.id 
            })).unwrap()
            
            if (result.data.is_favorited) {
                toast.success('Added to My List')
            } else {
                toast.success('Removed from My List')
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update favorites')
        }
    }

    const handlePlay = () => {
        router.push(`/watch/${contentId}`)
    }

    const handleShare = async () => {
        const url = window.location.href
        if (navigator.share) {
            try {
                await navigator.share({
                    title: currentItem?.title,
                    text: currentItem?.description,
                    url,
                })
            } catch (error) {
                // User cancelled or error occurred
            }
        } else {
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(url)
                toast.success('Link copied to clipboard')
            } catch (error) {
                toast.error('Failed to copy link')
            }
        }
    }

    if (loading || !currentItem) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <LoadingSpinner size="lg" />
                </div>
            </MainLayout>
        )
    }

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
    }

    const formatFileSize = (sizeMB: string | number) => {
        const size = typeof sizeMB === 'string' ? parseFloat(sizeMB) : sizeMB
        if (size >= 1024) {
            return `${(size / 1024).toFixed(2)} GB`
        }
        return `${size.toFixed(2)} MB`
    }

    const isFavorited = currentItem?.is_favorited || false

    return (
        <MainLayout>
            {/* Hero Section - Mobile Responsive */}
            <section className="relative h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[90vh] -mt-14 md:-mt-16 lg:-mt-20">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10" />
                    {currentItem?.backdrop_url ? (
                        <ContentImage
                            src={currentItem.backdrop_url}
                            alt={currentItem.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900" />
                    )}
                </div>

                {/* Content - Mobile Optimized */}
                <div className="relative z-20 h-full flex items-end pb-12 md:pb-16 lg:pb-20 px-4 md:px-8 lg:px-16">
                    <div className="max-w-full md:max-w-3xl space-y-3 md:space-y-6 w-full">
                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white drop-shadow-2xl leading-tight">
                            {currentItem.title}
                        </h1>

                        {/* Metadata */}
                        <div className="flex items-center gap-2 md:gap-4 text-xs sm:text-sm md:text-base text-white flex-wrap">
                            <span className="px-2 py-0.5 md:py-1 bg-blue-600 font-semibold rounded">
                                {currentItem.maturity_rating || 'PG-13'}
                            </span>
                            <span>{currentItem.release_year}</span>
                            <span className="hidden sm:inline">{formatDuration(currentItem.duration_seconds)}</span>
                            <span className="capitalize hidden sm:inline">{currentItem.type}</span>
                            {currentItem.visibility === 'premium' && (
                                <span className="px-2 py-0.5 md:py-1 border border-yellow-400 text-yellow-400 font-semibold rounded text-xs">
                                    Premium
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <p className="hidden sm:block text-sm sm:text-base md:text-lg text-gray-200 drop-shadow-lg line-clamp-2 md:line-clamp-4">
                            {currentItem.description}
                        </p>

                        {/* Action Buttons - Mobile Optimized */}
                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                            <Button
                                size={isMobile ? 'default' : 'lg'}
                                className="bg-white text-black hover:bg-white/90 flex-1 sm:flex-none min-w-[120px]"
                                onClick={handlePlay}
                            >
                                <Play className="w-4 h-4 md:w-5 md:h-5 mr-2 fill-current" />
                                Play
                            </Button>
                            <Button
                                size={isMobile ? 'default' : 'lg'}
                                variant="secondary"
                                className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm flex-1 sm:flex-none"
                                onClick={handleToggleFavorite}
                            >
                                {isFavorited ? (
                                    <>
                                        <Check className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                                        <span className="hidden sm:inline">In My List</span>
                                        <span className="sm:hidden">My List</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                                        <span className="hidden sm:inline">Add to My List</span>
                                        <span className="sm:hidden">Add</span>
                                    </>
                                )}
                            </Button>
                            {!isMobile && (
                                <>
                                    <Button
                                        size="lg"
                                        variant="ghost"
                                        className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                                    >
                                        <ThumbsUp className="w-5 h-5 mr-2" />
                                        Like
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="ghost"
                                        className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                                        onClick={handleShare}
                                    >
                                        <Share2 className="w-5 h-5 mr-2" />
                                        Share
                                    </Button>
                                </>
                            )}
                            {isMobile && (
                                <Button
                                    size="default"
                                    variant="ghost"
                                    className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm flex-none w-12 h-10 p-0 justify-center"
                                    onClick={handleShare}
                                >
                                    <Share2 className="w-5 h-5" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Bottom-right quick info (Category & Provider) - Desktop Only */}
                    {!isMobile && currentItem.category && currentItem.provider && (
                        <div className="absolute right-6 bottom-6 hidden md:flex flex-col items-end gap-3">
                            {currentItem.category && (
                                <div className="px-3 py-2 bg-black/70 rounded-md border border-white/10 text-right">
                                    <p className="text-xs text-gray-300">Category</p>
                                    <p className="text-sm font-semibold text-white">{currentItem.category.title || currentItem.category.name}</p>
                                </div>
                            )}
                            {currentItem.provider && (
                                <div className="px-3 py-2 bg-black/70 rounded-md border border-white/10 text-right">
                                    <p className="text-xs text-gray-300">Provider</p>
                                    <p className="text-sm font-semibold text-white">{currentItem.provider.display_name}</p>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </section>

            {/* Details Section - Mobile Responsive */}
            <section className="px-4 md:px-8 lg:px-16 py-6 md:py-12 space-y-6 md:space-y-8 pb-24 md:pb-12">
                {/* About Card - Mobile Responsive */}
                <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-4 md:p-8 border border-gray-700/50 shadow-2xl">
                    <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Info className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white">About</h2>
                    </div>
                    <p className="text-gray-300 text-sm md:text-lg leading-relaxed">{currentItem.description}</p>
                </div>

                {/* Info Grid - Tags - Mobile Responsive */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {/* Tags Card */}
                    {currentItem.tags && (
                        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                    <Star className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                </div>
                                <h3 className="text-base md:text-lg font-semibold text-white">Tags</h3>
                            </div>
                            <div className="flex flex-wrap gap-1.5 md:gap-2 pl-0 md:pl-13">
                                {(Array.isArray(currentItem.tags)
                                    ? currentItem.tags
                                    : currentItem.tags.split(',')
                                ).map((tag: string, index: number) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1.5 bg-purple-600/20 border border-purple-500/30 text-purple-300 rounded-full text-xs font-medium"
                                    >
                                        {tag.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Details Card - Mobile Responsive */}
                <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-4 md:p-8 border border-gray-700/50 shadow-2xl">
                    <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                            <Film className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white">Details</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                        {/* Release Year */}
                        <div className="flex items-center gap-2 md:gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs md:text-sm">Release Year</p>
                                <p className="text-white font-semibold text-sm md:text-lg">{currentItem.release_year}</p>
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="flex items-center gap-2 md:gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                                <Clock className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs md:text-sm">Duration</p>
                                <p className="text-white font-semibold text-sm md:text-lg">{formatDuration(currentItem.duration_seconds)}</p>
                            </div>
                        </div>

                        {/* Views */}
                        <div className="flex items-center gap-2 md:gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                                <Eye className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs md:text-sm">Views</p>
                                <p className="text-white font-semibold text-sm md:text-lg">{currentItem.views_count.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Type */}
                        <div className="flex items-center gap-2 md:gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                                <Video className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs md:text-sm">Type</p>
                                <p className="text-white font-semibold text-sm md:text-lg capitalize">{currentItem.type}</p>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 md:gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-rose-500/20 to-red-500/20 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
                                <Star className="w-5 h-5 md:w-6 md:h-6 text-rose-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs md:text-sm">Rating</p>
                                <p className="text-white font-semibold text-sm md:text-lg uppercase">{currentItem.maturity_rating || 'Not Rated'}</p>
                            </div>
                        </div>

                        {/* Visibility */}
                        <div className="flex items-center gap-2 md:gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                                <Globe className="w-5 h-5 md:w-6 md:h-6 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs md:text-sm">Visibility</p>
                                <p className="text-white font-semibold text-sm md:text-lg capitalize">{currentItem.visibility}</p>
                            </div>
                        </div>

                        {/* Published Date */}
                        {currentItem.published_at && (
                            <div className="flex items-center gap-2 md:gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/30 flex items-center justify-center flex-shrink-0">
                                    <Calendar className="w-5 h-5 md:w-6 md:h-6 text-teal-400" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs md:text-sm">Published</p>
                                    <p className="text-white font-semibold text-sm md:text-lg">
                                        {new Date(currentItem.published_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Video Assets Section - Mobile Responsive */}
                {/* {(currentItem as any).video_assets && (currentItem as any).video_assets.length > 0 && (
                    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-4 md:p-8 border border-gray-700/50 shadow-2xl">
                        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                                <HardDrive className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-white">Available Versions</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                            {(currentItem as any).video_assets.map((asset: any) => (
                                <div
                                    key={asset.id}
                                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center">
                                                <Video className="w-5 h-5 text-orange-400" />
                                            </div>
                                            <div>
                                                <p className="text-white font-semibold capitalize">
                                                    {asset.rendition_key}
                                                </p>
                                                {asset.resolution && (
                                                    <p className="text-gray-400 text-sm">{asset.resolution}</p>
                                                )}
                                            </div>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                                                asset.status === 'ready'
                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                            }`}
                                        >
                                            {asset.status === 'ready' ? (
                                                <CheckCircle2 className="w-3 h-3" />
                                            ) : (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                            )}
                                            {asset.status}
                                        </span>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        {asset.bitrate && (
                                            <div className="flex justify-between text-gray-400">
                                                <span>Bitrate:</span>
                                                <span className="text-gray-300">{asset.bitrate}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-gray-400">
                                            <span>Size:</span>
                                            <span className="text-gray-300 font-semibold">{formatFileSize(asset.file_size_mb)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )} */}

                {/* Trailer Section - Mobile Responsive */}
                {currentItem.trailer_url && (
                    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
                        <button
                            onClick={() => setIsTrailerOpen(!isTrailerOpen)}
                            className="w-full p-4 md:p-6 lg:p-8 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                        >
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                                    <Play className="w-5 h-5 md:w-6 md:h-6 text-white fill-current" />
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-white">Trailer</h2>
                            </div>
                            {isTrailerOpen ? (
                                <ChevronUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            ) : (
                                <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            )}
                        </button>
                        
                        {isTrailerOpen && (
                            <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8">
                                <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
                                    <video
                                        src={currentItem.trailer_url}
                                        controls
                                        className="w-full h-full"
                                        poster={currentItem.thumbnail_url}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Seasons and Episodes Section - Only for Shows - Mobile Responsive */}
                {currentItem.type === 'show' && currentItem.show?.seasons && currentItem.show.seasons.length > 0 && (
                    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-4 md:p-8 border border-gray-700/50 shadow-2xl">
                        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <Tv className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-white">Seasons & Episodes</h2>
                                <p className="text-xs md:text-sm text-gray-400 mt-0.5 md:mt-1">
                                    {currentItem.show.total_seasons} Season{currentItem.show.total_seasons !== 1 ? 's' : ''} • {currentItem.show.total_episodes} Episode{currentItem.show.total_episodes !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                        <SeasonEpisodeList seasons={currentItem.show.seasons} contentId={contentId} />
                    </div>
                )}
            </section>            {/* Similar Content - Mobile Responsive */}
            {trending && trending.length > 0 && (
                <div className="pb-24 md:pb-12">
                    <ContentRow
                        title="More Like This"
                        content={trending
                            .filter((item: any) => item.id !== contentId)
                            .slice(0, 20)
                            .map((item: any) => ({
                                id: item.id,
                                title: item.title,
                                thumbnail: item.poster_url || item.thumbnail_url,
                                type: item.type === 'show' ? 'series' : 'movie',
                                duration: Math.floor(item.duration_seconds / 60),
                                rating: item.maturity_rating,
                                year: item.release_year,
                                is_in_watchlist: item.is_favorited || false,
                                description: item.description,
                                seasonCount: item.show?.total_seasons,
                            }))}
                        onAddToWatchlist={(id) => {
                            if (!selectedProfile) {
                                toast.error('Please select a profile first')
                                return
                            }
                            dispatch(toggleFavorite({ contentId: id, profileId: selectedProfile.id }))
                                .unwrap()
                                .then((result) => {
                                    if (result.data.is_favorited) {
                                        toast.success('Added to My List')
                                    } else {
                                        toast.success('Removed from My List')
                                    }
                                })
                                .catch((error: any) => toast.error(error.message))
                        }}
                        onRemoveFromWatchlist={(id) => {
                            if (!selectedProfile) {
                                toast.error('Please select a profile first')
                                return
                            }
                            dispatch(toggleFavorite({ contentId: id, profileId: selectedProfile.id }))
                                .unwrap()
                                .then((result) => {
                                    if (result.data.is_favorited) {
                                        toast.success('Added to My List')
                                    } else {
                                        toast.success('Removed from My List')
                                    }
                                })
                                .catch((error: any) => toast.error(error.message))
                        }}
                    />
                </div>
            )}
        </MainLayout>
    )
}
