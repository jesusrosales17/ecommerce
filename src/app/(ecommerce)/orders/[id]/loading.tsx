import { Skeleton } from "@/components/ui/skeleton"

export default function OrderDetailLoading() {
  return (
    <div className="container py-8 px-4 2xl:px-0 mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Order Info Card */}
      <div className="border rounded-lg p-6 mb-6 bg-white">
        <div className="flex justify-between items-start">
          <div>
            <Skeleton className="h-7 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="text-right">
            <Skeleton className="h-6 w-20 mb-2" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Products Card */}
        <div className="md:col-span-2 border rounded-lg bg-white">
          <div className="p-6 border-b">
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="p-6">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 mb-4 pb-2 border-b">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12 justify-self-end" />
              <Skeleton className="h-4 w-16 justify-self-end" />
              <Skeleton className="h-4 w-16 justify-self-end" />
            </div>

            {/* Table Rows */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="grid grid-cols-4 gap-4 py-3 border-b last:border-b-0">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-16 justify-self-end" />
                <Skeleton className="h-4 w-8 justify-self-end" />
                <Skeleton className="h-4 w-20 justify-self-end" />
              </div>
            ))}

            {/* Order Summary */}
            <div className="mt-6 pt-4 border-t">
              <div className="text-right space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <div className="h-px bg-gray-200 my-2" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-10" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Info Card */}
        <div className="border rounded-lg bg-white">
          <div className="p-6 border-b">
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="p-6 space-y-4">
            {/* Name */}
            <div>
              <Skeleton className="h-4 w-12 mb-1" />
              <Skeleton className="h-5 w-32" />
            </div>

            {/* Address */}
            <div>
              <Skeleton className="h-4 w-16 mb-1" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-4 w-28" />
            </div>

            {/* References */}
            <div>
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
