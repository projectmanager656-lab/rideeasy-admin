import React from 'react'

export default function AdminLiveOperations() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <p className="text-sm font-medium text-[#718096]">
          Operations
        </p>

        <h1 className="mt-1 text-2xl font-bold text-[#152238] sm:text-3xl">
          Live Operations
        </h1>

        <p className="mt-2 text-sm text-[#718096]">
          Monitor active rides and real-time platform operations.
        </p>
      </div>

      {/* Skeleton Content */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="flex min-h-[300px] items-center justify-center text-center">
          <div>
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#FFF4D6]">
              <i className="ri-radar-line text-3xl text-[#FFB21C]" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-[#152238]">
              Live Operations
            </h2>

            <p className="mt-2 max-w-md text-sm text-[#718096]">
              Real-time ride monitoring and operational controls
              will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
