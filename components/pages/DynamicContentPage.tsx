'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { searchContent, toggleFavorite } from '@/store/slices/contentSlice'
import { MainLayout, Container } from '@/components/layout'
import ContentGrid from '@/components/content/ContentGrid'
import FilterBar, { FilterValues } from '@/components/content/FilterBar'
import ContentImage from '@/components/ui/ContentImage'
import HeroSkeleton from '@/components/ui/HeroSkeleton'
import { Play, Info, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useResponsive } from '@/lib/hooks'

interface DynamicContentPageProps {
    contentType: 'movie' | 'show' | 'skit' | 'afrimation' | 'real_estate'
}

function DynamicContentPageContent({ contentType }: DynamicContentPageProps) {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { selectedProfile } = useAppSelector((state) => state.profiles)
    const { items, loading } = useAppSelector((state) => state.content)
    const { isMobile, isTablet } = useResponsive()

    const [featuredContent, setFeaturedContent] = useState<any>(null)
    const [isMuted, setIsMuted] = useState(true)
    const [currentTrailerIndex, setCurrentTrailerIndex] = useState(0)
    const videoRef = useRef<HTMLVideoElement>(null)

    const contentTypeTitles = {
        movie: 'Movies',
        show: 'TV Shows',
        skit: 'Skits',
        afrimation: 'Afrimations',
        real_estate: 'Real Estate'
    }

    useEffect(() => {
        // Initial search with content type
        handleSearch({ type: contentType })
    }, [contentType])

    useEffect(() => {
        // Set featured content with trailer for hero
        if (items.length > 0) {
            const contentWithTrailer = items.find((item: any) => item.trailer_url)
            setFeaturedContent(contentWithTrailer || items[0])
        }
    }, [items])

    // Auto-rotate trailers every 30 seconds
    useEffect(() => {
        if (!items.length) return

        const contentWithTrailers = items.filter((item: any) => item.trailer_url)
        if (contentWithTrailers.length === 0) return

        const interval = setInterval(() => {
            setCurrentTrailerIndex((prev) => {
                const nextIndex = (prev + 1) % contentWithTrailers.length
                setFeaturedContent(contentWithTrailers[nextIndex])
                return nextIndex
            })
        }, 30000) // 30 seconds

        return () => clearInterval(interval)
    }, [items])

    const handleSearch = (filters: FilterValues) => {
        const searchFilters = {
            ...filters,
            type: contentType, // Always use page content type
            per_page: 50,
        }
        dispatch(searchContent(searchFilters))
    }

    const handleToggleFavorite = async (contentId: number) => {
        if (!selectedProfile) {
            toast.error('Please select a profile first')
            return
        }

        try {
            const result = await dispatch(toggleFavorite({ contentId, profileId: selectedProfile.id })).unwrap()
            if (result.data.is_favorited) {
                toast.success('Added to My List')
            } else {
                toast.success('Removed from My List')
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update list')
        }
    }

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
    }

    // Group content by category
    const groupedContent = items.reduce((acc: any, item: any) => {
        const categoryName = item.category?.title || item.category?.name || 'Other'
        if (!acc[categoryName]) {
            acc[categoryName] = []
        }
        acc[categoryName].push(item)
        return acc
    }, {})

    if (loading && items.length === 0) {
        return (
            <MainLayout>
                <HeroSkeleton />
                <FilterBar onSearch={handleSearch} initialType={contentType} />
                <div className="py-12 px-4 md:px-8 lg:px-16">
                    <div className="h-8 bg-gray-700 rounded w-48 animate-pulse mb-6"></div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="aspect-video bg-gray-800 rounded-lg animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout>
            {/* Hero Section with Video Trailer - Mobile Responsive */}
            <section className="relative h-[60vh] sm:h-[70vh] md:h-[75vh] lg:h-[80vh] -mt-14 md:-mt-16 lg:-mt-20">
                {/* Background Video/Image */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent z-10" />

                    {featuredContent?.trailer_url && !isMobile ? (
                        <video
                            ref={videoRef}
                            src={featuredContent.trailer_url}
                            autoPlay
                            loop
                            muted={isMuted}
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    ) : featuredContent?.backdrop_url ? (
                        <ContentImage
                            src={featuredContent.backdrop_url}
                            alt={featuredContent?.title || ''}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900" />
                    )}
                </div>

                {/* Content - Mobile Optimized */}
                <Container className="relative z-20 h-full flex flex-col items-start justify-end pb-16 md:pb-20 lg:pb-24">
                    <div className="max-w-full md:max-w-3xl space-y-3 md:space-y-4 w-full">
                        {featuredContent && (
                            <>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white drop-shadow-2xl leading-tight">
                                    {featuredContent.title}
                                </h1>

                                <div className="flex items-center gap-2 md:gap-3 text-xs sm:text-sm md:text-base text-white flex-wrap">
                                    <span className="px-2 py-0.5 md:py-1 bg-blue-600 font-semibold rounded">
                                        {featuredContent.maturity_rating || 'PG-13'}
                                    </span>
                                    <span>{featuredContent.release_year || new Date(featuredContent.published_at).getFullYear()}</span>
                                    <span className="hidden sm:inline">{formatDuration(featuredContent.duration_seconds)}</span>
                                    <span className="capitalize hidden sm:inline">{featuredContent.type}</span>
                                </div>

                                <p className="hidden sm:block text-sm sm:text-base md:text-lg text-gray-200 drop-shadow-lg line-clamp-2 md:line-clamp-3">
                                    {featuredContent.description}
                                </p>

                                <div className="flex items-center gap-2 md:gap-3 pt-2">
                                    <Button
                                        size={isMobile ? 'default' : 'lg'}
                                        className="bg-white text-black hover:bg-white/90 flex-1 sm:flex-none"
                                        onClick={() => router.push(`/watch/${featuredContent.id}`)}
                                    >
                                        <Play className="w-4 h-4 md:w-5 md:h-5 mr-2 fill-current" />
                                        Play
                                    </Button>
                                    <Button
                                        size={isMobile ? 'default' : 'lg'}
                                        variant="secondary"
                                        className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm flex-1 sm:flex-none"
                                        onClick={() => router.push(`/content/${featuredContent.id}`)}
                                    >
                                        <Info className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                                        {isMobile ? 'Info' : 'More Info'}
                                    </Button>
                                    {featuredContent.trailer_url && !isMobile && (
                                        <button
                                            onClick={() => setIsMuted(!isMuted)}
                                            className="p-2 md:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all"
                                        >
                                            {isMuted ? (
                                                <VolumeX className="w-5 h-5 text-white" />
                                            ) : (
                                                <Volume2 className="w-5 h-5 text-white" />
                                            )}
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                    
                    {/* Filter Bar - Centered below action buttons - Mobile Responsive */}
                    <div className="w-full flex justify-center mt-4 md:mt-8">
                        <FilterBar onSearch={handleSearch} initialType={contentType} />
                    </div>
                </Container>
            </section>

            {/* Content Grid by Category - Mobile Responsive */}
            <div className="py-6 md:py-12 pb-24 md:pb-12">
                {Object.entries(groupedContent).map(([category, categoryItems]: [string, any]) => (
                    <ContentGrid
                        key={category}
                        title={category}
                        content={categoryItems.map((item: any) => ({
                            id: item.id,
                            title: item.title,
                            thumbnail: item.poster_url || item.thumbnail_url,
                            type: item.type === 'show' ? 'series' : 'movie',
                            duration: Math.floor(item.duration_seconds / 60),
                            rating: item.maturity_rating,
                            year: item.release_year || new Date(item.published_at).getFullYear(),
                            is_in_watchlist: item.is_favorited || false,
                            description: item.description,
                            seasonCount: item.show?.total_seasons,
                        }))}
                        onAddToWatchlist={handleToggleFavorite}
                        onRemoveFromWatchlist={handleToggleFavorite}
                    />
                ))}

                {/* Empty State */}
                {!loading && items.length === 0 && (
                    <div className="text-center py-20 px-4">
                        <h3 className="text-2xl font-semibold text-white mb-2">
                            No {contentTypeTitles[contentType].toLowerCase()} found
                        </h3>
                        <p className="text-gray-400 mb-6">
                            Try adjusting your filters or check back later for new content
                        </p>
                    </div>
                )}
            </div>
        </MainLayout>
    )
}

// Wrap in Suspense to handle any async operations
export default function DynamicContentPage(props: DynamicContentPageProps) {
    return (
        <Suspense fallback={<HeroSkeleton />}>
            <DynamicContentPageContent {...props} />
        </Suspense>
    )
}
