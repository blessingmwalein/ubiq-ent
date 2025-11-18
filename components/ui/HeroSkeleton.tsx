import { Container } from '@/components/layout'

export default function HeroSkeleton() {
  return (
    <section className="relative h-[70vh] md:h-[85vh] -mt-16 md:-mt-20">
      {/* Background Skeleton */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-transparent to-transparent z-10" />
        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
      </div>

      {/* Hero Content Skeleton */}
      <Container className="relative z-20 h-full flex items-center">
        <div className="max-w-2xl space-y-6">
          {/* Title Skeleton */}
          <div className="space-y-3">
            <div className="h-12 md:h-16 lg:h-20 bg-gray-700 rounded w-full animate-pulse" />
            <div className="h-12 md:h-16 lg:h-20 bg-gray-700 rounded w-3/4 animate-pulse" />
          </div>

          {/* Description Skeleton */}
          <div className="space-y-2">
            <div className="h-6 bg-gray-600 rounded w-full animate-pulse" />
            <div className="h-6 bg-gray-600 rounded w-5/6 animate-pulse" />
            <div className="h-6 bg-gray-600 rounded w-4/6 animate-pulse" />
          </div>

          {/* Metadata Skeleton */}
          <div className="flex items-center gap-4">
            <div className="h-8 w-16 bg-gray-600 rounded animate-pulse" />
            <div className="h-6 w-12 bg-gray-600 rounded animate-pulse" />
            <div className="h-6 w-16 bg-gray-600 rounded animate-pulse" />
            <div className="h-8 w-12 bg-gray-600 rounded animate-pulse" />
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex items-center gap-4 pt-4">
            <div className="h-12 w-32 bg-gray-300 rounded animate-pulse" />
            <div className="h-12 w-32 bg-gray-600 rounded animate-pulse" />
            <div className="h-12 w-32 bg-gray-600 rounded animate-pulse" />
          </div>
        </div>
      </Container>
    </section>
  )
}
