'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { MainLayout, Container } from '@/components/layout'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchTrending, fetchNewReleases, fetchContentByType, toggleFavorite } from '@/store/slices/contentSlice'
import LoadingSpinner from '@/components/ui/loading'
import HeroSkeleton from '@/components/ui/HeroSkeleton'
import ContentRowSkeleton from '@/components/content/ContentRowSkeleton'
import { Play, Info, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ContentRow from '@/components/content/ContentRow'
import ContentImage from '@/components/ui/ContentImage'
import { toast } from 'sonner'
import { useResponsive } from '@/lib/hooks' 

export default function BrowsePage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { selectedProfile } = useAppSelector((state) => state.profiles)
  const { trending, newReleases, movies, shows, skits, afrimations, realEstate, loading } = useAppSelector((state) => state.content)
  const { isMobile, isTablet } = useResponsive()
  
  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Get featured content (top 5 trending items)
  const featuredSlides = trending?.slice(0, 5) || []

  useEffect(() => {
    // Fetch content
    dispatch(fetchTrending({}))
    dispatch(fetchNewReleases({}))
    
    // Fetch content by type
    dispatch(fetchContentByType({ type: 'movie', params: { per_page: 20 } }))
    dispatch(fetchContentByType({ type: 'show', params: { per_page: 20 } }))
    dispatch(fetchContentByType({ type: 'skit', params: { per_page: 20 } }))
    dispatch(fetchContentByType({ type: 'afrimation', params: { per_page: 20 } }))
    dispatch(fetchContentByType({ type: 'real_estate', params: { per_page: 20 } }))
  }, [selectedProfile, dispatch, router])

  // Auto-play slider
  useEffect(() => {
    if (!isAutoPlaying || featuredSlides.length <= 1) return

    const interval = setInterval(() => {
      setIsTransitioning(true)
      setCurrentSlide((prev) => (prev + 1) % featuredSlides.length)
      setTimeout(() => setIsTransitioning(false), 500)
    }, 6000) // Change slide every 6 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, featuredSlides.length])

  const goToSlide = useCallback((index: number) => {
    setIsTransitioning(true)
    setCurrentSlide(index)
    setIsAutoPlaying(false) // Pause auto-play when user manually navigates
    setTimeout(() => setIsTransitioning(false), 500)
    
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }, [])

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % featuredSlides.length)
  }, [currentSlide, featuredSlides.length, goToSlide])

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + featuredSlides.length) % featuredSlides.length)
  }, [currentSlide, featuredSlides.length, goToSlide])

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

  if (loading) {
    return (
      <MainLayout>
        <HeroSkeleton />
        
        {/* Content Sections Skeleton */}
        <div className="pb-12 space-y-8">
          <ContentRowSkeleton />
          <ContentRowSkeleton />
          <ContentRowSkeleton />
          <ContentRowSkeleton />
          <ContentRowSkeleton />
        </div>
      </MainLayout>
    )
  }

  const currentFeaturedContent = featuredSlides[currentSlide]

  return (
    <MainLayout>
      {/* Hero Slider Section - Responsive Heights */}
      <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[85vh] -mt-14 md:-mt-16 lg:-mt-20 overflow-hidden">
        {/* Slider Container */}
        <div className="relative w-full h-full">
          {featuredSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-transparent to-transparent z-10" />
                {slide?.backdrop_url ? (
                  <ContentImage
                    src={slide.backdrop_url}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900" />
                )}
              </div>

              {/* Slide Content - Mobile Optimized */}
              <Container className="relative z-20 h-full flex items-end md:items-center pb-20 md:pb-16">
                <div className="max-w-full md:max-w-2xl lg:max-w-4xl xl:max-w-5xl space-y-3 md:space-y-6">
                  {/* Title - Responsive Sizing with Max Width */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white drop-shadow-2xl leading-tight max-w-full md:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
                    {slide?.title || 'Welcome to UBIQ Entertainment'}
                  </h1>

                  {/* Description - Hidden on very small screens */}
                

                  {/* Metadata - Compact on mobile */}
                  {slide && (
                    <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-blue-200 flex-wrap">
                      <span className="px-2 py-0.5 md:py-1 bg-blue-600 text-white font-semibold rounded">
                        {slide.maturity_rating || 'PG-13'}
                      </span>
                      <span>{slide.release_year || '2024'}</span>
                      {slide.duration_seconds && (
                        <span className="hidden sm:inline">
                          {Math.floor(slide.duration_seconds / 60)}m
                        </span>
                      )}
                      <span className="px-2 py-0.5 md:py-1 border border-blue-400 rounded">HD</span>
                    </div>
                  )}

                  {/* Action Buttons - Mobile Responsive */}
                  <div className="flex items-center gap-2 md:gap-4 pt-2 md:pt-4">
                    <Button
                      size={isMobile ? 'default' : 'lg'}
                      className="bg-white text-black hover:bg-white/90 shadow-xl flex-1 sm:flex-none"
                      onClick={() => {
                        if (slide) {
                          router.push(`/watch/${slide.id}`)
                        }
                      }}
                    >
                      <Play className="w-4 h-4 md:w-5 md:h-5 mr-2 fill-current" />
                      Play
                    </Button>
                    <Button
                      size={isMobile ? 'default' : 'lg'}
                      variant="secondary"
                      className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm shadow-xl flex-1 sm:flex-none"
                      onClick={() => {
                        if (slide) {
                          router.push(`/content/${slide.id}`)
                        }
                      }}
                    >
                      <Info className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      {isMobile ? 'Info' : 'More Info'}
                    </Button>
                    {!isMobile && (
                      <Button
                        size="lg"
                        variant="ghost"
                        className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm shadow-xl"
                        onClick={() => handleToggleFavorite(slide?.id || 0)}
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        My List
                      </Button>
                    )}
                  </div>
                </div>
              </Container>
            </div>
          ))}
        </div>

        {/* Navigation Arrows - Desktop only */}
        {!isMobile && featuredSlides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/80 text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-all hover:scale-110"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/80 text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-all hover:scale-110"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </>
        )}

        {/* Slide Indicators - Bottom Right */}
        {featuredSlides.length > 1 && (
          <div className="absolute bottom-4 md:bottom-6 right-4 md:right-6 z-30 flex items-center gap-1.5 md:gap-2">
            {featuredSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all ${
                  index === currentSlide
                    ? 'w-6 md:w-10 h-1 md:h-1.5 bg-white shadow-lg'
                    : 'w-4 md:w-6 h-1 md:h-1.5 bg-white/40 hover:bg-white/60'
                } rounded-full`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Content Sections - Mobile Spacing */}
      <div className="pb-20 md:pb-12 space-y-4 md:space-y-8">
        {/* Trending Now */}
        {trending && trending.length > 0 && (
          <ContentRow
            title="Trending Now"
            content={trending.slice(0, 20).map((item: any) => ({
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
            onAddToWatchlist={handleToggleFavorite}
            onRemoveFromWatchlist={handleToggleFavorite}
            priority
          />
        )}

        {/* New Releases */}
        {newReleases && newReleases.length > 0 && (
          <ContentRow
            title="New Releases"
            content={newReleases.slice(0, 20).map((item: any) => ({
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
            onAddToWatchlist={handleToggleFavorite}
            onRemoveFromWatchlist={handleToggleFavorite}
          />
        )}

        {/* Movies */}
        {movies && movies.length > 0 && (
          <ContentRow
            title="Movies"
            content={movies.map((item: any) => ({
              id: item.id,
              title: item.title,
              thumbnail: item.poster_url || item.thumbnail_url,
              type: 'movie',
              duration: Math.floor(item.duration_seconds / 60),
              rating: item.maturity_rating,
              year: item.release_year,
              is_in_watchlist: item.is_favorited || false,
              description: item.description,
            }))}
            onAddToWatchlist={handleToggleFavorite}
            onRemoveFromWatchlist={handleToggleFavorite}
          />
        )}

        {/* TV Shows */}
        {shows && shows.length > 0 && (
          <ContentRow
            title="TV Shows"
            content={shows.map((item: any) => ({
              id: item.id,
              title: item.title,
              thumbnail: item.poster_url || item.thumbnail_url,
              type: 'series',
              duration: Math.floor(item.duration_seconds / 60),
              rating: item.maturity_rating,
              year: item.release_year,
              is_in_watchlist: item.is_favorited || false,
              description: item.description,
              seasonCount: item.show?.total_seasons,
            }))}
            onAddToWatchlist={handleToggleFavorite}
            onRemoveFromWatchlist={handleToggleFavorite}
          />
        )}

        {/* Skits */}
        {skits && skits.length > 0 && (
          <ContentRow
            title="Skits"
            content={skits.map((item: any) => ({
              id: item.id,
              title: item.title,
              thumbnail: item.poster_url || item.thumbnail_url,
              type: 'movie',
              duration: Math.floor(item.duration_seconds / 60),
              rating: item.maturity_rating,
              year: item.release_year,
              is_in_watchlist: item.is_favorited || false,
              description: item.description,
            }))}
            onAddToWatchlist={handleToggleFavorite}
            onRemoveFromWatchlist={handleToggleFavorite}
          />
        )}

        {/* Afrimations */}
        {afrimations && afrimations.length > 0 && (
          <ContentRow
            title="Afrimations"
            content={afrimations.map((item: any) => ({
              id: item.id,
              title: item.title,
              thumbnail: item.poster_url || item.thumbnail_url,
              type: 'movie',
              duration: Math.floor(item.duration_seconds / 60),
              rating: item.maturity_rating,
              year: item.release_year,
              is_in_watchlist: item.is_favorited || false,
              description: item.description,
            }))}
            onAddToWatchlist={handleToggleFavorite}
            onRemoveFromWatchlist={handleToggleFavorite}
          />
        )}

        {/* Real Estate */}
        {realEstate && realEstate.length > 0 && (
          <ContentRow
            title="Real Estate"
            content={realEstate.map((item: any) => ({
              id: item.id,
              title: item.title,
              thumbnail: item.poster_url || item.thumbnail_url,
              type: 'movie',
              duration: Math.floor(item.duration_seconds / 60),
              rating: item.maturity_rating,
              year: item.release_year,
              is_in_watchlist: item.is_favorited || false,
              description: item.description,
            }))}
            onAddToWatchlist={handleToggleFavorite}
            onRemoveFromWatchlist={handleToggleFavorite}
          />
        )}

        {/* Empty State */}
        {!loading && (!trending || trending.length === 0) && (!movies || movies.length === 0) && (
          <div className="text-center py-20 px-4">
            <h3 className="text-2xl font-semibold text-white mb-2">
              No content available yet
            </h3>
            <p className="text-blue-300 mb-6">
              Check back soon for new content!
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
