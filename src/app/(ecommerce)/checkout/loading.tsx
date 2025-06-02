import { Skeleton } from "@/components/ui/skeleton"

const CheckoutLoading = () => {
  return (
    <div className="container mx-auto py-8 px-4 2xl:px-0 min-h-[100dvh]">
      {/* Page Header */}
      <div className="mb-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="space-y-6">
          {/* Shipping Information */}
          <div className="border rounded-lg p-6 bg-white">
            <Skeleton className="h-6 w-40 mb-4" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full col-span-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full col-span-full" />
            </div>
          </div>

          {/* Payment Method */}
          <div className="border rounded-lg p-6 bg-white">
            <Skeleton className="h-6 w-36 mb-4" />
            
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              
              {/* Credit Card Form */}
              <div className="space-y-3 pl-6">
                <Skeleton className="h-10 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Place Order Button */}
          <Skeleton className="h-12 w-full" />
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Cart Items */}
          <div className="border rounded-lg p-6 bg-white">
            <Skeleton className="h-6 w-32 mb-4" />
            
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <CheckoutItemSkeleton key={i} />
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div className="border rounded-lg p-6 bg-white">
            <Skeleton className="h-6 w-28 mb-4" />
            
            <div className="space-y-3">
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
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Checkout Item Skeleton Component
const CheckoutItemSkeleton = () => {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="w-16 h-16" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  )
}

export default CheckoutLoading
