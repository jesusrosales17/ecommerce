import { Skeleton } from "@/components/ui/skeleton"

const FavoritesLoading = () => {
  return (
    <div className="container mx-auto py-8 px-4 2xl:px-0 min-h-[100dvh] h-screen ">
      {/* Page Header */}
      <div className="mb-8">
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Favorites Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 lg:gap-6">
        {[...Array(12)].map((_, i) => (
          <FavoriteProductCardSkeleton key={i} />
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center mt-8">
        <Skeleton className="h-12 w-32" />
      </div>
    </div>
  )
}

// Favorite Product Card Skeleton Component
const FavoriteProductCardSkeleton = () => {
  return (
    <div className="group relative border lg:rounded-2xl bg-white">
      <div className="relative flex flex-col justify-between h-full">
        {/* Image skeleton */}
        <div className="aspect-[4/3] relative overflow-hidden w-full lg:border-b">
          <Skeleton className="w-full h-full" />
          
          {/* Favorite heart skeleton */}
          <Skeleton className="absolute top-2 right-2 w-8 h-8 rounded-full" />
          
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
          
          {/* Action buttons */}
          <div className="flex space-x-2 pt-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 flex-1" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FavoritesLoading
