'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchNewReleases, fetchTrending, addToWatchlist, removeFromWatchlist } from '@/store/slices/contentSlice'
import { MainLayout, Container } from '@/components/layout'
import ContentRow from '@/components/content/ContentRow'
import LoadingSpinner from '@/components/ui/loading'
import { toast } from 'sonner'
import { useResponsive } from '@/lib/hooks'

export default function NewPage() {
  const dispatch = useAppDispatch()
  const { trending, newReleases, loading } = useAppSelector((state) => state.content)
  const { isMobile, isTablet } = useResponsive()

  useEffect(() => {
    // Fetch new and trending content
    dispatch(fetchNewReleases({}))
    dispatch(fetchTrending({}))
  }, [dispatch])

  const handleAddToWatchlist = async (contentId: number) => {
    try {
      await dispatch(addToWatchlist(contentId)).unwrap()
      toast.success('Added to watchlist')
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to watchlist')
    }
  }

  const handleRemoveFromWatchlist = async (contentId: number) => {
    try {
      await dispatch(removeFromWatchlist(contentId)).unwrap()
      toast.success('Removed from watchlist')
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove from watchlist')
    }
  }

  if (loading && !trending.length && !newReleases.length) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size={isMobile ? 'sm' : 'lg'} />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      {/* Hero Section - Mobile Responsive */}
      <section className="relative h-[35vh] sm:h-[40vh] md:h-[50vh] -mt-14 md:-mt-16 lg:-mt-20 bg-gradient-to-b from-blue-950 via-blue-900 to-black">
        <Container className="relative z-10 h-full flex items-center">
          <div className="max-w-full md:max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-4">
              New & Popular
            </h1>
            <p className="text-sm sm:text-base md:text-xl text-blue-200">
              Discover the latest releases and trending content
            </p>
          </div>
        </Container>
      </section>

      {/* Content Rows - Mobile Responsive */}
      <div className="pb-24 md:pb-12">
        {/* Trending Now */}
        {trending.length > 0 && (
          <ContentRow
            title="Trending Now"
            content={trending.map((item: any) => ({
              id: item.id,
              title: item.title,
              thumbnail: item.thumbnail_url || item.poster_url,
              type: item.type === 'show' ? 'series' : 'movie',
              duration: Math.floor(item.duration_seconds / 60),
              rating: item.maturity_rating,
              year: item.release_year,
              is_in_watchlist: false,
            }))}
            onAddToWatchlist={handleAddToWatchlist}
            onRemoveFromWatchlist={handleRemoveFromWatchlist}
            priority
          />
        )}

        {/* New Releases */}
        {newReleases.length > 0 && (
          <ContentRow
            title="New Releases"
            content={newReleases.map((item: any) => ({
              id: item.id,
              title: item.title,
              thumbnail: item.thumbnail_url || item.poster_url,
              type: item.type === 'show' ? 'series' : 'movie',
              duration: Math.floor(item.duration_seconds / 60),
              rating: item.maturity_rating,
              year: item.release_year,
              is_in_watchlist: false,
            }))}
            onAddToWatchlist={handleAddToWatchlist}
            onRemoveFromWatchlist={handleRemoveFromWatchlist}
          />
        )}

        {/* Empty State - Mobile Responsive */}
        {!loading && !trending.length && !newReleases.length && (
          <Container className="py-16 md:py-20 text-center px-4">
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
              No content available yet
            </h3>
            <p className="text-sm md:text-base text-blue-300">
              Check back soon for new releases!
            </p>
          </Container>
        )}
      </div>
    </MainLayout>
  )
}
