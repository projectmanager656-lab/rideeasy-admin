import React from 'react'

export default function AdminFinance() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#718096]">
          Admin
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#152238] sm:text-3xl">
          Finance
        </h1>

        <p className="mt-1 text-sm text-[#718096]">
          Financial operations and reporting.
        </p>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#FFF4D6] text-[#FFB21C]">
            <i className="ri-money-rupee-circle-line text-2xl" />
          </div>

          <div>
            <h2 className="font-semibold text-[#152238]">
              Finance module
            </h2>

            <p className="mt-1 text-sm text-[#718096]">
              Finance data and backend dependencies will be connected
              after the required API contract is confirmed.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
