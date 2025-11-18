'use client'

import { useState } from 'react'
import { Search, X, Filter, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet'
import { useResponsive } from '@/lib/hooks'

interface FilterBarProps {
  onSearch: (filters: FilterValues) => void
  initialType?: string
}

export interface FilterValues {
  query?: string
  type?: string
  genre?: string
  maturity_rating?: string
}

export default function FilterBar({ onSearch, initialType }: FilterBarProps) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState(initialType || '')
  const [genre, setGenre] = useState('')
  const [maturity_rating, setMaturityRating] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const { isMobile, isTablet } = useResponsive()

  const handleSearch = () => {
    onSearch({
      query: query || undefined,
      type: type || undefined,
      genre: genre || undefined,
      maturity_rating: maturity_rating || undefined,
    })
    setIsFilterOpen(false)
  }

  const handleClear = () => {
    setQuery('')
    setGenre('')
    setMaturityRating('')
    // Keep type as it's from URL
    onSearch({
      type: type || undefined,
    })
  }

  const hasActiveFilters = query || genre || maturity_rating

  // Mobile Filter Sheet Content
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-200">Search Title</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          />
        </div>
      </div>

      {/* Genre Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-200">Genre</label>
        <Select value={genre} onValueChange={setGenre}>
          <SelectTrigger className="w-full h-12 text-base">
            <SelectValue placeholder="All Genres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            <SelectItem value="drama">Drama</SelectItem>
            <SelectItem value="comedy">Comedy</SelectItem>
            <SelectItem value="action">Action</SelectItem>
            <SelectItem value="romance">Romance</SelectItem>
            <SelectItem value="thriller">Thriller</SelectItem>
            <SelectItem value="horror">Horror</SelectItem>
            <SelectItem value="documentary">Documentary</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Maturity Rating Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-200">Maturity Rating</label>
        <Select value={maturity_rating} onValueChange={setMaturityRating}>
          <SelectTrigger className="w-full h-12 text-base">
            <SelectValue placeholder="All Ratings" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-ratings">All Ratings</SelectItem>
            <SelectItem value="all">All Ages</SelectItem>
            <SelectItem value="pg">PG</SelectItem>
            <SelectItem value="pg-13">PG-13</SelectItem>
            <SelectItem value="r">R</SelectItem>
            <SelectItem value="18+">18+</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  // Mobile View with Sheet
  if (isMobile) {
    return (
      <div className="w-full px-4 py-4 space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-5 h-5 z-10" />
          <input
            type="text"
            placeholder="Search titles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Button & Clear */}
        <div className="flex gap-2">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                className="flex-1 relative"
              >
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="bottom" 
              className="h-[80vh] bg-black/98 backdrop-blur-xl border-t border-white/10"
            >
              <SheetHeader>
                <SheetTitle className="text-white text-xl">Filter Content</SheetTitle>
              </SheetHeader>
              <div className="py-6">
                <FilterContent />
              </div>
              <SheetFooter className="flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="flex-1"
                >
                  Clear
                </Button>
                <Button
                  onClick={handleSearch}
                  className="flex-1"
                >
                  Apply Filters
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Tablet & Desktop View
  return (
    <div className="w-full flex justify-center py-4">
      <div className="flex flex-col md:flex-row gap-3 items-center justify-center w-full px-4 max-w-7xl">
        {/* Search Input */}
        <div className="relative flex-1 w-full max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-5 h-5 z-10" />
          <input
            type="text"
            placeholder="Search by title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
          />
        </div>

        {/* Genre Filter */}
        <Select value={genre} onValueChange={setGenre}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="All Genres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            <SelectItem value="drama">Drama</SelectItem>
            <SelectItem value="comedy">Comedy</SelectItem>
            <SelectItem value="action">Action</SelectItem>
            <SelectItem value="romance">Romance</SelectItem>
            <SelectItem value="thriller">Thriller</SelectItem>
            <SelectItem value="horror">Horror</SelectItem>
            <SelectItem value="documentary">Documentary</SelectItem>
          </SelectContent>
        </Select>

        {/* Maturity Rating Filter */}
        <Select value={maturity_rating} onValueChange={setMaturityRating}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="All Ratings" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-ratings">All Ratings</SelectItem>
            <SelectItem value="all">All Ages</SelectItem>
            <SelectItem value="pg">PG</SelectItem>
            <SelectItem value="pg-13">PG-13</SelectItem>
            <SelectItem value="r">R</SelectItem>
            <SelectItem value="18+">18+</SelectItem>
          </SelectContent>
        </Select>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            onClick={handleSearch}
            className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Filter className="w-4 h-4 mr-2" />
            Search
          </Button>
          
          {hasActiveFilters && (
            <Button
              onClick={handleClear}
              variant="ghost"
              className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
