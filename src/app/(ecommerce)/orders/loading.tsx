import { Skeleton } from "@/components/ui/skeleton"

const OrdersLoading = () => {
  return (
    <div className="container mx-auto py-8 px-4 2xl:px-0 min-h-[100dvh]">
      {/* Page Header */}
      <div className="mb-8">
        <Skeleton className="h-8 w-36 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Skeleton className="h-10 w-full sm:w-48" />
        <Skeleton className="h-10 w-full sm:w-40" />
        <Skeleton className="h-10 w-full sm:w-32" />
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <OrderCardSkeleton key={i} />
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
  )
}

// Order Card Skeleton Component
const OrderCardSkeleton = () => {
  return (
    <div className="border rounded-lg bg-white p-6">
      {/* Order Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="mt-2 sm:mt-0 text-right space-y-1">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-3 mb-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
            <Skeleton className="w-12 h-12" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <div className="flex items-center space-x-4">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>

      {/* Order Actions */}
      <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
        <Skeleton className="h-9 w-full sm:w-32" />
        <Skeleton className="h-9 w-full sm:w-28" />
        <Skeleton className="h-9 w-full sm:w-36" />
      </div>
    </div>
  )
}

export default OrdersLoading
