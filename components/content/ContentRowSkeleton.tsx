import ContentCardSkeleton from './ContentCardSkeleton'

export default function ContentRowSkeleton() {
  return (
    <div className="relative group/row mb-12 py-8">
      {/* Title Skeleton */}
      <div className="px-4 md:px-8 mb-4">
        <div className="h-8 bg-gray-700 rounded w-48 animate-pulse" />
      </div>

      {/* Cards Skeleton */}
      <div className="overflow-hidden py-8 -my-8">
        <div className="flex gap-4 px-4 md:px-8">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="flex-[0_0_85%] min-w-0 sm:flex-[0_0_48%] md:flex-[0_0_32%] lg:flex-[0_0_24%] xl:flex-[0_0_19%]"
            >
              <ContentCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
