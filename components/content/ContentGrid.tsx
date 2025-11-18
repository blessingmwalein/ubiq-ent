'use client'

import ContentCard, { ContentItem } from './ContentCard'

interface ContentGridProps {
  title: string
  content: ContentItem[]
  onAddToWatchlist?: (id: number) => void
  onRemoveFromWatchlist?: (id: number) => void
}

export default function ContentGrid({
  title,
  content,
  onAddToWatchlist,
  onRemoveFromWatchlist,
}: ContentGridProps) {
  if (!content || content.length === 0) {
    return null
  }

  return (
    <div className="mb-12 px-4 md:px-8 lg:px-16">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {content.map((item) => (
          <ContentCard
            key={item.id}
            content={item}
            onAddToWatchlist={onAddToWatchlist}
            onRemoveFromWatchlist={onRemoveFromWatchlist}
          />
        ))}
      </div>
    </div>
  )
}
