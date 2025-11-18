'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MainLayout, Container } from '@/components/layout'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchTrending, fetchNewReleases, fetchContentByType, toggleFavorite } from '@/store/slices/contentSlice'
import LoadingSpinner from '@/components/ui/loading'
import HeroSkeleton from '@/components/ui/HeroSkeleton'
import ContentRowSkeleton from '@/components/content/ContentRowSkeleton'
import { Play, Info, Plus } from 'lucide-react'
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

  const featuredContent = trending?.[0]

  return (
    <MainLayout>
      {/* Hero Section - Responsive Heights */}
      <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[85vh] -mt-14 md:-mt-16 lg:-mt-20">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-transparent to-transparent z-10" />
          {featuredContent?.backdrop_url ? (
            <ContentImage
              src={featuredContent.backdrop_url}
              alt={featuredContent.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900" />
          )}
        </div>

        {/* Hero Content - Mobile Optimized */}
        <Container className="relative z-20 h-full flex items-end md:items-center pb-16 md:pb-0">
          <div className="max-w-full md:max-w-2xl space-y-3 md:space-y-6">
            {/* Title - Responsive Sizing */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white drop-shadow-2xl leading-tight">
              {featuredContent?.title || 'Welcome to UBIQ Entertainment'}
            </h1>

            {/* Description - Hidden on very small screens */}
            <p className="hidden sm:block text-base md:text-lg lg:text-xl text-blue-100 drop-shadow-lg line-clamp-2 md:line-clamp-3">
              {featuredContent?.description ||
                'Stream unlimited African movies, TV shows, and exclusive content. Watch anywhere, anytime.'}
            </p>

            {/* Metadata - Compact on mobile */}
            {featuredContent && (
              <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-blue-200 flex-wrap">
                <span className="px-2 py-0.5 md:py-1 bg-blue-600 text-white font-semibold rounded">
                  PG-13
                </span>
                <span>{featuredContent.release_year || '2024'}</span>
                <span className="hidden sm:inline">2h 15m</span>
                <span className="px-2 py-0.5 md:py-1 border border-blue-400 rounded">HD</span>
              </div>
            )}

            {/* Action Buttons - Mobile Responsive */}
            <div className="flex items-center gap-2 md:gap-4 pt-2 md:pt-4">
              <Button
                size={isMobile ? 'default' : 'lg'}
                className="bg-white text-black hover:bg-white/90 shadow-xl flex-1 sm:flex-none"
                onClick={() => {
                  if (featuredContent) {
                    router.push(`/watch/${featuredContent.id}`)
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
                  if (featuredContent) {
                    router.push(`/content/${featuredContent.id}`)
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
                  onClick={() => handleToggleFavorite(featuredContent?.id || 0)}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  My List
                </Button>
              )}
            </div>
          </div>
        </Container>
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
