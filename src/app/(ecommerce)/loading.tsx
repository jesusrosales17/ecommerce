
import { Skeleton } from "@/components/ui/skeleton"

const Loading = () => {
  return (
    <main className="xl:container mx-auto mb-4">      {/* Hero Carousel Skeleton */}
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden bg-gray-100">
        <Skeleton className="w-full h-full" />
        
        {/* Navigation dots skeleton */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="w-3 h-3 rounded-full" />
          ))}
        </div>
        
        {/* Navigation arrows skeleton */}
        <Skeleton className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full" />
        <Skeleton className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full" />
      </div>

      <div className="space-y-16 mt-16">
        {/* Special Offers Skeleton */}
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-6 w-32" />
          </div>
          
          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 2xl:grid-cols-6 lg:gap-6 overflow-hidden lg:mx-4">
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Featured Products Skeleton */}
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-52" />
              <Skeleton className="h-4 w-80" />
            </div>
            <Skeleton className="h-6 w-40" />
          </div>
          
          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 2xl:grid-cols-6 lg:gap-6 overflow-hidden lg:mx-4">
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Featured Categories Skeleton */}
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-6 w-36" />
          </div>
          
          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
            {[...Array(6)].map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

// Product Card Skeleton Component
const ProductCardSkeleton = () => {
  return (
    <div className="group relative border lg:rounded-2xl bg-white">
      <div className="relative flex flex-col justify-between h-full">
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
          
          {/* Action buttons */}
          <div className="flex space-x-2 pt-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Category Card Skeleton Component  
const CategoryCardSkeleton = () => {
  return (
    <div className="group cursor-pointer">
      <div className="bg-white rounded-lg border hover:shadow-lg transition-all duration-300">
        {/* Image skeleton */}
        <div className="aspect-square relative overflow-hidden rounded-t-lg">
          <Skeleton className="w-full h-full" />
        </div>
        
        {/* Content skeleton */}
        <div className="p-4 text-center space-y-2">
          <Skeleton className="h-5 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
      </div>
    </div>
  )
}

export default Loading