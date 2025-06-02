import { Skeleton } from "@/components/ui/skeleton"

export default function CategoryProductsLoading() {
  return (
    <main className="container mx-auto lg:px-3 py-3 grid grid-cols-1 md:grid-cols-[30%_70%] lg:grid-cols-[20%_77%] mt-5 gap-4 relative w-full">
      
      {/* Sidebar with Filters */}
      <div className="px-3 lg:px-0">
        {/* Category Title */}
        <Skeleton className="h-7 w-48 mb-2" />
        <Skeleton className="h-4 w-32 mb-4" />
        
        {/* Filters Section */}
        <div className="space-y-6">
          {/* Sale Filter */}
          <div>
            <Skeleton className="h-5 w-24 mb-3" />
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>

          {/* Featured Filter */}
          <div>
            <Skeleton className="h-5 w-28 mb-3" />
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <Skeleton className="h-5 w-20 mb-3" />
            <div className="space-y-3">
              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Products List */}
      <div className="grid grid-cols-1 bg-white">
        {[...Array(6)].map((_, i) => (
          <ProductCardLongSkeleton key={i} />
        ))}
      </div>
    </main>
  )
}

// Product Card Long Skeleton Component
const ProductCardLongSkeleton = () => {
  return (
    <div className="flex flex-col sm:flex-row border-b last:border-b-0 p-4 hover:bg-gray-50 transition-colors">
      {/* Product Image */}
      <div className="w-full sm:w-48 h-48 flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
        <Skeleton className="w-full h-full rounded-lg" />
      </div>
      
      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <Skeleton className="h-4 w-20 mb-2" />
          
          {/* Product Name */}
          <Skeleton className="h-6 w-3/4 mb-2" />
          
          {/* Description */}
          <div className="space-y-1 mb-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          
          {/* Rating */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-4" />
              ))}
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
        
        {/* Price and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-3 sm:mb-0">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-24 mt-1" />
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      </div>
    </div>
  )
}
