'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchFavorites, toggleFavorite } from '@/store/slices/contentSlice'
import { MainLayout, Container } from '@/components/layout'
import ContentCard from '@/components/content/ContentCard'
import LoadingSpinner from '@/components/ui/loading'
import ContentRowSkeleton from '@/components/content/ContentRowSkeleton'
import { Heart } from 'lucide-react'
import { toast } from 'sonner'
import { useResponsive } from '@/lib/hooks'

export default function MyListPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { selectedProfile } = useAppSelector((state) => state.profiles)
  const { favorites, loading } = useAppSelector((state) => state.content)
  const { isMobile, isTablet } = useResponsive()

  useEffect(() => {
    if (selectedProfile) {
      dispatch(fetchFavorites(selectedProfile.id))
    }
  }, [dispatch, selectedProfile])

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
        {/* Hero Skeleton - Mobile Responsive */}
        <section className="relative h-[30vh] sm:h-[35vh] md:h-[40vh] -mt-14 md:-mt-16 lg:-mt-20 bg-gradient-to-b from-blue-950 via-blue-900 to-black">
          <Container className="relative z-10 h-full flex items-center">
            <div className="max-w-full md:max-w-2xl">
              <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                  <Heart size={isMobile ? 24 : 32} className="text-white" fill="white" />
                </div>
                <div className="h-12 md:h-16 bg-gray-700 rounded w-48 md:w-64 animate-pulse"></div>
              </div>
              <div className="h-5 md:h-7 bg-gray-600 rounded w-64 md:w-96 animate-pulse"></div>
            </div>
          </Container>
        </section>

        {/* Content Skeleton */}
        <Container className="py-6 md:py-12 pb-24 md:pb-12">
          <div className="space-y-6 md:space-y-8">
            <ContentRowSkeleton />
          </div>
        </Container>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      {/* Hero Section - Mobile Responsive */}
      <section className="relative h-[30vh] sm:h-[35vh] md:h-[40vh] -mt-14 md:-mt-16 lg:-mt-20 bg-gradient-to-b from-blue-950 via-blue-900 to-black">
        <Container className="relative z-10 h-full flex items-center">
          <div className="max-w-full md:max-w-2xl">
            <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Heart size={isMobile ? 24 : 32} className="text-white" fill="white" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                My List
              </h1>
            </div>
            <p className="text-sm sm:text-base md:text-xl text-blue-200">
              Your personal collection of saved content
            </p>
          </div>
        </Container>
      </section>

      {/* Content Grid - Mobile Responsive */}
      <Container className="py-6 md:py-12 pb-24 md:pb-12">
        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {favorites.map((favorite: any) => {
              const item = favorite.content_item
              return (
                <ContentCard
                  key={item.id}
                  content={{
                    id: item.id,
                    title: item.title,
                    thumbnail: item.poster_url || item.thumbnail_url,
                    type: item.type === 'show' ? 'series' : 'movie',
                    duration: Math.floor(item.duration_seconds / 60),
                    rating: item.maturity_rating,
                    year: item.release_year,
                    is_in_watchlist: true,
                    description: item.description,
                  }}
                  onAddToWatchlist={handleToggleFavorite}
                  onRemoveFromWatchlist={handleToggleFavorite}
                />
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 md:py-20 px-4">
            <Heart size={isMobile ? 48 : 64} className="mx-auto text-gray-600 mb-3 md:mb-4" />
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
              Your list is empty
            </h3>
            <p className="text-sm md:text-base text-blue-300 mb-6">
              Start adding movies and shows to your list to watch them later
            </p>
            <button
              onClick={() => router.push('/browse')}
              className="px-5 py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-full text-sm md:text-base font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Browse Content
            </button>
          </div>
        )}
      </Container>
    </MainLayout>
  )
}
