import { Skeleton } from "@/components/ui/skeleton"

export default function FeaturedLoading() {
  return (
    <div className="container mx-auto py-8 px-4 2xl:px-0">
      {/* Page Header */}
      <div className="mb-8">
        <Skeleton className="h-8 w-56 mb-2" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Skeleton className="h-10 w-full sm:w-48" />
        <Skeleton className="h-10 w-full sm:w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 lg:gap-6">
        {[...Array(12)].map((_, i) => (
          <FeaturedProductCardSkeleton key={i} />
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center mt-8">
        <Skeleton className="h-12 w-40" />
      </div>
    </div>
  )
}

// Featured Product Card Skeleton Component
const FeaturedProductCardSkeleton = () => {
  return (
    <div className="group relative border lg:rounded-2xl bg-white">
      <div className="relative flex flex-col justify-between h-full">
        {/* Featured badge */}
        <Skeleton className="absolute top-2 right-2 w-20 h-6 z-10" />
        
        {/* Image skeleton */}
        <div className="aspect-[4/3] relative overflow-hidden w-full lg:border-b">
          <Skeleton className="w-full h-full" />
          
          {/* Sale badge skeleton */}
          <Skeleton className="absolute top-2 left-2 w-12 h-6" />
        </div>
        
        {/* Content skeleton */}
        <div className="p-3 space-y-2">
          {/* Category */}
          <Skeleton className="h-4 w-16" />
          
          {/* Product name */}
          <Skeleton className="h-5 w-full" />
          
          {/* Price */}
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          
          {/* Rating */}
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-4" />
            ))}
            <Skeleton className="h-4 w-8 ml-2" />
          </div>
          
          {/* Action buttons */}
          <div className="flex space-x-2 pt-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 flex-1" />
          </div>
        </div>
      </div>
    </div>  )
}
