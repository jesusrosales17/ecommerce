import { Skeleton } from "@/components/ui/skeleton"

export default function ProductsLoading() {
  return (
    <div className="container mx-auto py-8 px-4 2xl:px-0">
      {/* Page Header */}
      <div className="mb-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Filters and Results Section */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-64 space-y-6">
          {/* Search Filter */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Categories Filter */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-20" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>

          {/* Products List */}
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <ProductCardLongSkeleton key={i} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-10" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Product Card Long Skeleton Component (para lista de productos)
const ProductCardLongSkeleton = () => {
  return (
    <div className="flex border rounded-lg p-4 bg-white space-x-4">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <Skeleton className="w-24 h-24 md:w-32 md:h-32" />
      </div>

      {/* Product Info */}
      <div className="flex-1 space-y-2">
        {/* Category */}
        <Skeleton className="h-4 w-20" />
        
        {/* Product Name */}
        <Skeleton className="h-6 w-3/4" />
        
        {/* Description */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        
        {/* Price and Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>    </div>
  )
}
