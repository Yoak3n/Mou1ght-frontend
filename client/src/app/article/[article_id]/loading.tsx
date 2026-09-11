import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-muted/40 pb-12">
      <div className="container mx-auto px-4 relative z-10 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-card rounded-xl shadow-sm border border-border p-6 sm:p-10">
              <div className="space-y-4">
                <div className="space-y-3">
                  <Skeleton className="h-10 w-3/4 bg-muted" />
                  <Skeleton className="h-10 w-2/3 bg-muted" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-border">
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-8 h-8 bg-muted rounded-full" />
                      <Skeleton className="h-4 w-24 bg-muted" />
                    </div>
                    <Skeleton className="h-4 w-24 bg-muted hidden sm:block" />
                    <Skeleton className="h-4 w-20 bg-muted hidden sm:block" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-20 bg-muted rounded-md" />
                    <Skeleton className="h-9 w-20 bg-muted rounded-md" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border p-6 sm:p-10 min-h-[500px] space-y-3">
              <Skeleton className="h-4 w-full bg-muted" />
              <Skeleton className="h-4 w-11/12 bg-muted" />
              <Skeleton className="h-4 w-10/12 bg-muted" />
              <Skeleton className="h-4 w-9/12 bg-muted" />
              <Skeleton className="h-4 w-11/12 bg-muted" />
              <Skeleton className="h-4 w-8/12 bg-muted" />
              <Skeleton className="h-4 w-10/12 bg-muted" />
              <Skeleton className="h-4 w-full bg-muted" />
              <Skeleton className="h-4 w-7/12 bg-muted" />
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-24 space-y-6">
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <Skeleton className="h-5 w-32 bg-muted" />
                <div className="mt-4 flex items-center gap-4">
                  <Skeleton className="w-16 h-16 bg-muted rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28 bg-muted" />
                    <Skeleton className="h-3 w-16 bg-muted" />
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-10 bg-muted mx-auto" />
                    <Skeleton className="h-3 w-16 bg-muted mx-auto" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-10 bg-muted mx-auto" />
                    <Skeleton className="h-3 w-16 bg-muted mx-auto" />
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <Skeleton className="h-5 w-40 bg-muted" />
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-3 w-11/12 bg-muted" />
                  <Skeleton className="h-3 w-10/12 bg-muted" />
                  <Skeleton className="h-3 w-9/12 bg-muted" />
                  <Skeleton className="h-3 w-8/12 bg-muted" />
                  <Skeleton className="h-3 w-10/12 bg-muted" />
                </div>
              </div>

              <div className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-muted" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-16 bg-muted rounded-full" />
                    <Skeleton className="h-6 w-20 bg-muted rounded-full" />
                    <Skeleton className="h-6 w-14 bg-muted rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-px w-full bg-muted rounded-none" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16 bg-muted" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-14 bg-muted rounded-full" />
                    <Skeleton className="h-6 w-24 bg-muted rounded-full" />
                    <Skeleton className="h-6 w-20 bg-muted rounded-full" />
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

