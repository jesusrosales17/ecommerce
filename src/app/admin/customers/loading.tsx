import { Skeleton } from "@/components/ui/skeleton";

export default function CustomersLoading() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-20 mb-2" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-gray-100">
                <Skeleton className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-6 w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <Skeleton className="h-10 w-full sm:w-64" />
            <Skeleton className="h-10 w-full sm:w-40" />
            <Skeleton className="h-10 w-full sm:w-32" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Table Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="grid grid-cols-12 gap-4 font-medium text-gray-600">
            <div className="col-span-4 lg:col-span-3">
              <Skeleton className="h-4 w-14" />
            </div>
            <div className="col-span-3 lg:col-span-2 hidden lg:block">
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="col-span-2 lg:col-span-2">
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="col-span-2 lg:col-span-2">
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="col-span-3 lg:col-span-1">
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="col-span-0 lg:col-span-2">
              <Skeleton className="h-4 w-16 hidden lg:block" />
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="p-4">
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Customer Info */}
                <div className="col-span-4 lg:col-span-3">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                </div>

                {/* Registration Date */}
                <div className="col-span-3 lg:col-span-2 hidden lg:block">
                  <Skeleton className="h-4 w-20" />
                </div>

                {/* Orders Count */}
                <div className="col-span-2 lg:col-span-2">
                  <Skeleton className="h-4 w-8" />
                </div>

                {/* Total Spent */}
                <div className="col-span-2 lg:col-span-2">
                  <Skeleton className="h-4 w-16" />
                </div>

                {/* Status */}
                <div className="col-span-3 lg:col-span-1">
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>

                {/* Actions */}
                <div className="col-span-0 lg:col-span-2 hidden lg:block">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </div>

              {/* Mobile Info */}
              <div className="lg:hidden mt-3">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-40" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}
