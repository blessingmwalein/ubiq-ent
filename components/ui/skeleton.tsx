import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-800/50", className)}
      {...props}
    />
  )
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 border border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-8 w-48" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          ))}
        </div>
      </div>

      {/* Account Details */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 border border-gray-700">
        <Skeleton className="h-8 w-40 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function DevicesSkeleton() {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 border border-gray-700">
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-4 w-96 mb-6" />

      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-6 rounded-2xl bg-slate-800/50 border-2 border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-64" />
                </div>
              </div>
              <Skeleton className="w-10 h-10 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SubscriptionSkeleton() {
  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-blue-500/50 rounded-3xl p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8" />
              <Skeleton className="h-10 w-40" />
            </div>
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>

        <div className="flex gap-4">
          <Skeleton className="flex-1 h-12 rounded-2xl" />
          <Skeleton className="flex-1 h-12 rounded-2xl" />
        </div>
      </div>

      {/* Billing Information */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 border border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="w-6 h-6" />
          <Skeleton className="h-8 w-48" />
        </div>
        
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

export { Skeleton }

