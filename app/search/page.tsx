'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { searchContent, addToWatchlist, removeFromWatchlist } from '@/store/slices/contentSlice'
import { MainLayout, Container } from '@/components/layout'
import { Search, X, Filter, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ContentCard from '@/components/content/ContentCard'
import LoadingSpinner from '@/components/ui/loading'
import { toast } from 'sonner'
import { useResponsive } from '@/lib/hooks'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

function SearchPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const { items, loading } = useAppSelector((state) => state.content)
  const { isMobile, isTablet } = useResponsive()

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery)
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    category: searchParams.get('category') || '',
    rating: searchParams.get('rating') || '',
  })
  const [showFilters, setShowFilters] = useState(false)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Perform search when debounced query or filters change
  useEffect(() => {
    if (debouncedQuery.trim()) {
      const params: any = { q: debouncedQuery }
      
      if (filters.type) params.type = filters.type
      if (filters.category) params.category_id = filters.category
      if (filters.rating) params.maturity_rating = filters.rating

      dispatch(searchContent(params))

      // Update URL
      const queryParams = new URLSearchParams()
      queryParams.set('q', debouncedQuery)
      if (filters.type) queryParams.set('type', filters.type)
      if (filters.category) queryParams.set('category', filters.category)
      if (filters.rating) queryParams.set('rating', filters.rating)
      
      router.push(`/search?${queryParams.toString()}`, { scroll: false })
    }
  }, [debouncedQuery, filters, dispatch, router])

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

  const clearFilters = () => {
    setFilters({ type: '', category: '', rating: '' })
  }

  const hasActiveFilters = filters.type || filters.category || filters.rating

  // Filter content component
  const FilterContent = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base md:text-lg font-semibold text-white">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs md:text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-3 md:space-y-4">
        {/* Type Filter */}
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-300 mb-2">
            Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="w-full px-3 md:px-4 py-2.5 md:py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm md:text-base text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All Types</option>
            <option value="movie">Movies</option>
            <option value="show">TV Shows</option>
            <option value="skit">Skits</option>
            <option value="afrimation">Afrimations</option>
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-300 mb-2">
            Rating
          </label>
          <select
            value={filters.rating}
            onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
            className="w-full px-3 md:px-4 py-2.5 md:py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm md:text-base text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All Ratings</option>
            <option value="G">G - General Audiences</option>
            <option value="PG">PG - Parental Guidance</option>
            <option value="PG-13">PG-13</option>
            <option value="R">R - Restricted</option>
            <option value="NC-17">NC-17</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-300 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="w-full px-3 md:px-4 py-2.5 md:py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm md:text-base text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All Categories</option>
            <option value="1">Action</option>
            <option value="2">Comedy</option>
            <option value="3">Drama</option>
            <option value="4">Horror</option>
            <option value="5">Romance</option>
          </select>
        </div>
      </div>
    </div>
  )

  return (
    <MainLayout>
      <Container className="py-4 md:py-8 pb-24 md:pb-8 min-h-screen">
        {/* Search Header - Mobile Responsive */}
        <div className="mb-6 md:mb-8 space-y-3 md:space-y-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">Search</h1>

          {/* Search Input - Mobile Optimized */}
          <div className="flex gap-2 md:gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={isMobile ? 18 : 20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isMobile ? "Search..." : "Search for movies, shows, and more..."}
                className="w-full pl-10 md:pl-12 pr-10 md:pr-12 py-3 md:py-4 bg-gray-900 border border-gray-700 rounded-lg text-sm md:text-base text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                autoFocus={!isMobile}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={isMobile ? 18 : 20} />
                </button>
              )}
            </div>

            {/* Mobile: Sheet Filters, Desktop: Toggle Filters */}
            {isMobile ? (
              <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetTrigger asChild>
                  <Button
                    size="default"
                    variant={hasActiveFilters ? 'default' : 'secondary'}
                    className="px-3 relative"
                  >
                    <SlidersHorizontal size={20} />
                    {hasActiveFilters && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                        {Object.values(filters).filter(Boolean).length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="bg-gray-900 border-gray-700">
                  <SheetHeader>
                    <SheetTitle className="text-white">Search Filters</SheetTitle>
                    <SheetDescription className="text-gray-400">
                      Refine your search results
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Button
                variant={showFilters ? 'default' : 'secondary'}
                className="px-6"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={20} className="mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                    {Object.values(filters).filter(Boolean).length}
                  </span>
                )}
              </Button>
            )}
          </div>

          {/* Desktop Filters Panel */}
          {showFilters && !isMobile && (
            <div className="p-6 bg-gray-900 border border-gray-700 rounded-lg">
              <FilterContent />
            </div>
          )}
        </div>

        {/* Search Results - Mobile Responsive */}
        {loading ? (
          <div className="flex items-center justify-center py-16 md:py-20">
            <LoadingSpinner size={isMobile ? 'sm' : 'lg'} />
          </div>
        ) : debouncedQuery.trim() === '' ? (
          <div className="text-center py-16 md:py-20 px-4">
            <Search size={isMobile ? 48 : 64} className="mx-auto text-gray-600 mb-3 md:mb-4" />
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
              Start searching
            </h3>
            <p className="text-sm md:text-base text-gray-400">
              Enter a search term to find movies, shows, and more
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 md:py-20 px-4">
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
              No results found
            </h3>
            <p className="text-sm md:text-base text-gray-400 mb-6">
              Try adjusting your search or filters
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} size={isMobile ? 'default' : 'lg'}>
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 md:mb-6">
              <p className="text-sm md:text-base text-gray-400">
                Found <span className="text-white font-semibold">{items.length}</span> result{items.length !== 1 ? 's' : ''} for{' '}
                <span className="text-white font-semibold">&quot;{debouncedQuery}&quot;</span>
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {items.map((item: any) => (
                <ContentCard
                  key={item.id}
                  content={{
                    id: item.id,
                    title: item.title,
                    thumbnail: item.thumbnail_url || item.poster_url,
                    type: item.type === 'show' ? 'series' : 'movie',
                    duration: Math.floor(item.duration_seconds / 60),
                    rating: item.maturity_rating,
                    year: item.release_year,
                    is_in_watchlist: false,
                  }}
                  onAddToWatchlist={handleAddToWatchlist}
                  onRemoveFromWatchlist={handleRemoveFromWatchlist}
                />
              ))}
            </div>
          </>
        )}
      </Container>
    </MainLayout>
  )
}

// Wrap in Suspense to handle useSearchParams
export default function SearchPage() {
  return (
    <Suspense fallback={
      <MainLayout>
        <Container className="py-8">
          <div className="flex items-center justify-center min-h-[50vh]">
            <LoadingSpinner size="lg" />
          </div>
        </Container>
      </MainLayout>
    }>
      <SearchPageContent />
    </Suspense>
  )
}
