import { Skeleton } from "@/components/ui/skeleton"

export default function ProductDetailLoading() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs Skeleton */}
      <div className="flex items-center space-x-2 mb-6">
        <Skeleton className="h-4 w-12" />
        <span className="text-gray-400">/</span>
        <Skeleton className="h-4 w-20" />
        <span className="text-gray-400">/</span>
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-8 p-6">
          {/* Image Gallery Skeleton */}
          <div className="w-full space-y-4">
            {/* Main Image */}
            <div className="aspect-square relative overflow-hidden rounded-lg">
              <Skeleton className="w-full h-full" />
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-1 aspect-square max-w-20">
                  <Skeleton className="w-full h-full rounded-md" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="flex flex-col space-y-6">
            {/* Product Title */}
            <div>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-5 w-24" />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-5 w-5" />
                ))}
              </div>
              <Skeleton className="h-4 w-16" />
            </div>

            {/* Stock Status */}
            <Skeleton className="h-5 w-28" />

            {/* Product Options */}
            <div className="space-y-4">
              <div>
                <Skeleton className="h-5 w-16 mb-2" />
                <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-16" />
                  ))}
                </div>
              </div>
              
              <div>
                <Skeleton className="h-5 w-20 mb-2" />
                <div className="flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-8 rounded-full" />
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <Skeleton className="h-5 w-16 mb-2" />
              <Skeleton className="h-10 w-24" />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>

            {/* Additional Info */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="border-t p-6">
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex border-b">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-24 mr-4" />
              ))}
            </div>

            {/* Content */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Specifications */}
              <div className="space-y-3 mt-6">
                <Skeleton className="h-6 w-36" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex justify-between py-2 border-b">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
