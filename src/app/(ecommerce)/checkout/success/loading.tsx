import { Skeleton } from "@/components/ui/skeleton"

export default function CheckoutSuccessLoading() {
  return (
    <div className="container max-w-md py-16 px-4 mx-auto">
      <div className="border rounded-lg p-8 text-center bg-white">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 p-3 rounded-full">
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </div>
        
        {/* Title */}
        <Skeleton className="h-8 w-48 mx-auto mb-2" />
        
        {/* Description */}
        <div className="space-y-2 mb-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
        </div>
        
        {/* Transaction ID */}
        <Skeleton className="h-4 w-40 mx-auto mb-6" />
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}
