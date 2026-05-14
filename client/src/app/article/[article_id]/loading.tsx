import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <div className="container mx-auto px-4 relative z-10 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-10">
              <div className="space-y-4">
                <div className="space-y-3">
                  <Skeleton className="h-10 w-3/4 bg-gray-200" />
                  <Skeleton className="h-10 w-2/3 bg-gray-200" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-8 h-8 bg-gray-200 rounded-full" />
                      <Skeleton className="h-4 w-24 bg-gray-200" />
                    </div>
                    <Skeleton className="h-4 w-24 bg-gray-200 hidden sm:block" />
                    <Skeleton className="h-4 w-20 bg-gray-200 hidden sm:block" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-20 bg-gray-200 rounded-md" />
                    <Skeleton className="h-9 w-20 bg-gray-200 rounded-md" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-10 min-h-[500px] space-y-3">
              <Skeleton className="h-4 w-full bg-gray-200" />
              <Skeleton className="h-4 w-11/12 bg-gray-200" />
              <Skeleton className="h-4 w-10/12 bg-gray-200" />
              <Skeleton className="h-4 w-9/12 bg-gray-200" />
              <Skeleton className="h-4 w-11/12 bg-gray-200" />
              <Skeleton className="h-4 w-8/12 bg-gray-200" />
              <Skeleton className="h-4 w-10/12 bg-gray-200" />
              <Skeleton className="h-4 w-full bg-gray-200" />
              <Skeleton className="h-4 w-7/12 bg-gray-200" />
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <Skeleton className="h-5 w-32 bg-gray-200" />
                <div className="mt-4 flex items-center gap-4">
                  <Skeleton className="w-16 h-16 bg-gray-200 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28 bg-gray-200" />
                    <Skeleton className="h-3 w-16 bg-gray-200" />
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-10 bg-gray-200 mx-auto" />
                    <Skeleton className="h-3 w-16 bg-gray-200 mx-auto" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-10 bg-gray-200 mx-auto" />
                    <Skeleton className="h-3 w-16 bg-gray-200 mx-auto" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <Skeleton className="h-5 w-40 bg-gray-200" />
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-3 w-11/12 bg-gray-200" />
                  <Skeleton className="h-3 w-10/12 bg-gray-200" />
                  <Skeleton className="h-3 w-9/12 bg-gray-200" />
                  <Skeleton className="h-3 w-8/12 bg-gray-200" />
                  <Skeleton className="h-3 w-10/12 bg-gray-200" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-gray-200" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-16 bg-gray-200 rounded-full" />
                    <Skeleton className="h-6 w-20 bg-gray-200 rounded-full" />
                    <Skeleton className="h-6 w-14 bg-gray-200 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-px w-full bg-gray-100 rounded-none" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16 bg-gray-200" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-14 bg-gray-200 rounded-full" />
                    <Skeleton className="h-6 w-24 bg-gray-200 rounded-full" />
                    <Skeleton className="h-6 w-20 bg-gray-200 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

