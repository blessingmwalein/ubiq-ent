export default function ContentCardSkeleton() {
  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-800 animate-pulse">
      {/* Thumbnail Skeleton */}
      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800" />
      
      {/* Bottom Info Skeleton */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        {/* Title Skeleton */}
        <div className="h-4 bg-gray-600 rounded mb-2 w-3/4" />
        
        {/* Metadata Skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-3 bg-gray-600 rounded w-12" />
          <div className="h-3 bg-gray-600 rounded w-16" />
          <div className="h-3 bg-gray-600 rounded w-14" />
        </div>
      </div>
    </div>
  )
}
