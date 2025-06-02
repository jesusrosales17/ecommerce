import { Skeleton } from "@/components/ui/skeleton"

export default function AddressesLoading() {
  return (
    <div className="container mx-auto py-8 px-4 2xl:px-0 min-h-[100dvh]">
      {/* Page Header */}
      <div className="mb-8">
        <Skeleton className="h-8 w-44 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Add New Address Button */}
      <div className="mb-6">
        <Skeleton className="h-12 w-48" />
      </div>

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(4)].map((_, i) => (
          <AddressCardSkeleton key={i} />
        ))}
        
        {/* Add New Address Card */}
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px]">
          <Skeleton className="h-12 w-12 rounded-full mb-4" />
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    </div>
  )
}

// Address Card Skeleton Component
const AddressCardSkeleton = () => {
  return (
    <div className="border rounded-lg p-6 bg-white relative">
      {/* Default badge */}
      <Skeleton className="absolute top-4 right-4 h-6 w-16" />
      
      {/* Address Type */}
      <div className="flex items-center space-x-2 mb-3">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-5 w-16" />
      </div>
      
      {/* Recipient Name */}
      <Skeleton className="h-6 w-3/4 mb-2" />
      
      {/* Address Lines */}
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      
      {/* Phone */}
      <Skeleton className="h-4 w-32 mb-4" />
      
      {/* Action Buttons */}
      <div className="flex space-x-2 pt-4 border-t">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-16" />
      </div>
    </div>  )
}
