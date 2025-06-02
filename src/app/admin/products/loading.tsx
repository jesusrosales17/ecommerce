import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center md:justify-between gap-4 md:items-center mb-5 flex-col md:flex-row">
        <div>
          <Skeleton className="h-7 w-24 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-full md:w-40" />
      </div>

      {/* Filters and Search */}
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

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Table Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="grid grid-cols-12 gap-4 font-medium text-gray-600">
            <div className="col-span-4 lg:col-span-3">
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="col-span-2 hidden lg:block">
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="col-span-2 hidden lg:block">
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Skeleton className="h-4 w-14" />
            </div>
            <div className="col-span-2 lg:col-span-2">
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="p-4">
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Product Info */}
                <div className="col-span-4 lg:col-span-3">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-12 w-12 rounded" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="col-span-2 hidden lg:block">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                {/* Stock */}
                <div className="col-span-2 hidden lg:block">
                  <Skeleton className="h-4 w-8" />
                </div>

                {/* Price */}
                <div className="col-span-2 lg:col-span-1">
                  <Skeleton className="h-4 w-16" />
                </div>

                {/* Status */}
                <div className="col-span-2 lg:col-span-1">
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>

                {/* Actions */}
                <div className="col-span-2 lg:col-span-2">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
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
