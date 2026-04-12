"use client";

export default function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb skeleton */}
        <div className="flex gap-2 mb-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-[#1a1a24] rounded w-16 animate-pulse" />
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Image skeleton */}
          <div className="animate-pulse">
            <div className="aspect-[3/4] md:aspect-square bg-[#1a1a24] rounded-2xl" />
          </div>

          {/* Info skeleton */}
          <div className="space-y-4">
            {/* Badges */}
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-[#1a1a24] rounded-full" />
              <div className="h-6 w-24 bg-[#1a1a24] rounded-full" />
            </div>

            {/* Title */}
            <div className="h-12 bg-[#1a1a24] rounded w-3/4" />
            <div className="h-6 bg-[#1a1a24] rounded w-1/2" />

            {/* Price */}
            <div className="h-14 bg-[#1a1a24] rounded w-40" />

            {/* Stock box */}
            <div className="h-16 bg-[#1a1a24] rounded-xl" />

            {/* Buttons */}
            <div className="flex gap-4">
              <div className="h-14 flex-1 bg-[#1a1a24] rounded-xl" />
              <div className="h-14 w-14 bg-[#1a1a24] rounded-xl" />
            </div>

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-[#1a1a24] rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Sections skeleton */}
        <div className="space-y-8">
          <div className="h-8 bg-[#1a1a24] rounded w-40 mb-4" />
          <div className="h-48 bg-[#1a1a24] rounded-xl" />
          
          <div className="h-8 bg-[#1a1a24] rounded w-40 mb-4" />
          <div className="h-48 bg-[#1a1a24] rounded-xl" />

          <div className="h-8 bg-[#1a1a24] rounded w-40 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="aspect-[3/4] bg-[#1a1a24] rounded-xl mb-3" />
                <div className="h-4 bg-[#1a1a24] rounded w-3/4 mb-2" />
                <div className="h-4 bg-[#1a1a24] rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
