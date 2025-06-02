import { Skeleton } from "@/components/ui/skeleton"

export default function CartLoading() {
  return (
    <div className="container py-8 mx-auto px-4 2xl:px-0 min-h-[100dvh]">
      {/* Page Header */}
      <div className="mb-6">
        <Skeleton className="h-8 w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {[...Array(3)].map((_, i) => (
            <CartItemSkeleton key={i} />
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 bg-white sticky top-4">
            {/* Summary Header */}
            <Skeleton className="h-6 w-32 mb-4" />
            
            {/* Summary Lines */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-4 w-14" />
              </div>
            </div>

            {/* Separator */}
            <div className="border-t my-4"></div>

            {/* Total */}
            <div className="flex justify-between mb-6">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-24" />
            </div>

            {/* Checkout Button */}
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Cart Item Skeleton Component
const CartItemSkeleton = () => {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex space-x-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <Skeleton className="w-20 h-20" />
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-6" />
          </div>

          <div className="flex items-center justify-between">
            {/* Quantity Controls */}
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-8 w-8" />
            </div>

            {/* Price */}
            <div className="text-right space-y-1">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      </div>
    </div>  )
}
