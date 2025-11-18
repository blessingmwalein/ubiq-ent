'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronUp, Play, Clock, Calendar } from 'lucide-react'
import ContentImage from '@/components/ui/ContentImage'
import { Button } from '@/components/ui/button'
import { useResponsive } from '@/lib/hooks'

interface Episode {
  id: number
  uuid: string
  episode_number: number
  title: string
  description: string
  duration_seconds: number
  thumbnail_url: string
  views_count: number
  released_at: string
}

interface Season {
  id: number
  uuid: string
  season_number: number
  title: string
  description: string
  poster_url: string | null
  episode_count: number
  released_at: string
  episodes: Episode[]
}

interface SeasonEpisodeListProps {
  seasons: Season[]
  contentId: number
}

export default function SeasonEpisodeList({ seasons, contentId }: SeasonEpisodeListProps) {
  const router = useRouter()
  const { isMobile, isTablet } = useResponsive()
  const [expandedSeasons, setExpandedSeasons] = useState<number[]>([seasons[0]?.id])

  const toggleSeason = (seasonId: number) => {
    setExpandedSeasons((prev) =>
      prev.includes(seasonId)
        ? prev.filter((id) => id !== seasonId)
        : [...prev, seasonId]
    )
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (!seasons || seasons.length === 0) {
    return null
  }

  return (
    <div className="space-y-3 md:space-y-4">
      {[...seasons]
        .sort((a, b) => a.season_number - b.season_number)
        .map((season) => {
          const isExpanded = expandedSeasons.includes(season.id)

          return (
            <div
              key={season.id}
              className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-xl md:rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden"
            >
              {/* Season Header - Mobile Responsive */}
              <button
                onClick={() => toggleSeason(season.id)}
                className="w-full px-4 md:px-6 py-3 md:py-5 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-base md:text-lg">
                      S{season.season_number}
                    </span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-base md:text-xl font-bold text-white leading-tight">
                      {isMobile ? `Season ${season.season_number}` : `Season ${season.season_number}: ${season.title}`}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-400 mt-0.5 md:mt-1">
                      {season.episode_count} Ep{season.episode_count !== 1 && !isMobile ? 'isode' : ''}{season.episode_count !== 1 ? 's' : ''}
                      {!isMobile && ` • Released ${formatDate(season.released_at)}`}
                    </p>
                  </div>
                </div>
                <div className="text-white">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 md:w-6 md:h-6" />
                  ) : (
                    <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
                  )}
                </div>
              </button>

              {/* Season Description - Desktop Only */}
              {isExpanded && season.description && !isMobile && (
                <div className="px-4 md:px-6 py-3 md:py-4 border-t border-gray-700/50">
                  <p className="text-sm md:text-base text-gray-300 leading-relaxed">{season.description}</p>
                </div>
              )}

              {/* Episodes Grid - Mobile Responsive */}
              {isExpanded && season.episodes && season.episodes.length > 0 && (
                <div className="p-3 md:p-6 border-t border-gray-700/50 space-y-3 md:space-y-4">
                  {[...season.episodes]
                    .sort((a, b) => a.episode_number - b.episode_number)
                    .map((episode) => (
                      <div
                        key={episode.id}
                        className="group bg-gray-800/50 rounded-lg md:rounded-xl overflow-hidden hover:bg-gray-800/70 transition-all duration-300 hover:shadow-lg cursor-pointer"
                        onClick={() => router.push(`/watch/${contentId}?episode=${episode.id}`)}
                      >
                        <div className="flex gap-2 md:gap-4 p-2 md:p-4">
                          {/* Episode Thumbnail - Mobile Responsive */}
                          <div className="relative w-24 h-16 sm:w-32 sm:h-20 md:w-40 md:h-24 flex-shrink-0 rounded md:rounded-lg overflow-hidden bg-gray-900">
                            {episode.thumbnail_url ? (
                              <ContentImage
                                src={episode.thumbnail_url}
                                alt={episode.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                                <span className="text-lg md:text-2xl font-bold text-gray-500">
                                  {episode.episode_number}
                                </span>
                              </div>
                            )}
                            {/* Play Overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Play className="w-6 h-6 md:w-10 md:h-10 text-white fill-current" />
                            </div>
                          </div>

                          {/* Episode Info - Mobile Optimized */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1 md:mb-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
                                  <span className="text-sm md:text-lg font-bold text-white flex-shrink-0">
                                    {episode.episode_number}.
                                  </span>
                                  <h4 className="text-sm md:text-lg font-semibold text-white truncate">
                                    {episode.title}
                                  </h4>
                                </div>
                                <p className="text-xs md:text-sm text-gray-400 line-clamp-1 md:line-clamp-2 leading-relaxed">
                                  {episode.description}
                                </p>
                              </div>
                              {!isMobile && (
                                <Button
                                  size="sm"
                                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm flex-shrink-0"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    router.push(`/watch/${contentId}?episode=${episode.id}`)
                                  }}
                                >
                                  <Play className="w-4 h-4 mr-1 fill-current" />
                                  Play
                                </Button>
                              )}
                            </div>

                            {/* Episode Metadata - Mobile Responsive */}
                            <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-xs text-gray-400 mt-1 md:mt-3">
                              <div className="flex items-center gap-1 md:gap-1.5">
                                <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                <span>{formatDuration(episode.duration_seconds)}</span>
                              </div>
                              {!isMobile && (
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>{formatDate(episode.released_at)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Empty Episodes State */}
              {isExpanded && (!season.episodes || season.episodes.length === 0) && (
                <div className="p-4 md:p-6 border-t border-gray-700/50 text-center text-gray-400 text-sm md:text-base">
                  No episodes available yet
                </div>
              )}
            </div>
          )
        })}
    </div>
  )
}
