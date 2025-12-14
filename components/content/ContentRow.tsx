'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ContentCard, { ContentItem } from './ContentCard'
import { useResponsive } from '@/lib/hooks'

interface ContentRowProps {
  title: string
  content: ContentItem[]
  onAddToWatchlist?: (id: number) => void
  onRemoveFromWatchlist?: (id: number) => void
  priority?: boolean
}

export default function ContentRow({
  title,
  content,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  priority = false,
}: ContentRowProps) {
  const { isMobile } = useResponsive()
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: isMobile ? 1 : 'auto',
    dragFree: !isMobile,
    containScroll: 'trimSnaps',
  })
  
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)

    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  if (!content || content.length === 0) {
    return null
  }

  return (
    <div className="relative group/row">
      {/* Title */}
      <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 px-4 md:px-8">
        {title}
      </h2>

      {/* Carousel Container */}
      <div className="relative">
        {/* Previous Button - Desktop Only */}
        {!isMobile && canScrollPrev && (
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-0 bottom-0 z-20 w-12 md:w-16 bg-gradient-to-r from-black/80 to-transparent flex items-center justify-start pl-2 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
            aria-label="Previous"
          >
            <div className="w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition-colors">
              <ChevronLeft size={24} />
            </div>
          </button>
        )}

        {/* Next Button - Desktop Only */}
        {!isMobile && canScrollNext && (
          <button
            onClick={scrollNext}
            className="absolute right-0 top-0 bottom-0 z-20 w-12 md:w-16 bg-gradient-to-l from-black/80 to-transparent flex items-center justify-end pr-2 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
            aria-label="Next"
          >
            <div className="w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition-colors">
              <ChevronRight size={24} />
            </div>
          </button>
        )}

        {/* Embla Viewport */}
        <div className="overflow-hidden py-4 md:py-8 -my-4 md:-my-8" ref={emblaRef}>
          <div className="flex gap-2 md:gap-4 px-4 md:px-8">
            {content.map((item, index) => (
              <div
                key={item.id}
                className="flex-[0_0_38%] min-w-0 xs:flex-[0_0_36%] sm:flex-[0_0_48%] md:flex-[0_0_32%] lg:flex-[0_0_24%] xl:flex-[0_0_19%]"
              >
                <ContentCard
                  content={item}
                  onAddToWatchlist={onAddToWatchlist}
                  onRemoveFromWatchlist={onRemoveFromWatchlist}
                  priority={priority && index < 5}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
