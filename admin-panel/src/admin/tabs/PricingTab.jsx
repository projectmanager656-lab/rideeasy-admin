import React from 'react'

export default function PricingTab ({ pricingJson, setPricingJson, savePricing, pricingLoading }) {
  if (pricingLoading) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center text-neutral-600 shadow-xl">
        Loading pricing…
      </div>
    )
  }

  return (
<<<<<<< Updated upstream
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 shadow-xl">
      <p className="mb-3 text-xs sm:text-sm text-neutral-600">
        JSON with <code className="rounded border border-neutral-200 bg-neutral-100 px-1 font-mono text-black">rates</code> (per-vehicle{' '}
        <code className="rounded border border-neutral-200 bg-neutral-100 px-1 font-mono text-black">baseFare</code>,{' '}
        <code className="rounded border border-neutral-200 bg-neutral-100 px-1 font-mono text-black">perKm</code>,{' '}
        <code className="rounded border border-neutral-200 bg-neutral-100 px-1 font-mono text-black">platformFee</code>) and{' '}
        <code className="rounded border border-neutral-200 bg-neutral-100 px-1 font-mono text-black">driverPlans</code> (weekly/monthly/yearly ₹ per vehicle type). Both are stored in MongoDB.
      </p>
      <textarea
        className="h-64 sm:h-72 w-full rounded-xl border border-neutral-300 bg-neutral-50 p-3 sm:p-4 font-mono text-xs sm:text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        value={pricingJson}
        onChange={(e) => setPricingJson(e.target.value)}
      />
      <button
        type="button"
        onClick={savePricing}
        className="mt-4 rounded-lg bg-black px-4 py-2.5 sm:px-5 text-xs sm:text-sm font-semibold text-white hover:bg-neutral-800"
      >
        Save pricing
      </button>
=======
    <div className="space-y-6">

      {/* Page Header */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-6">

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#111827]">
              Pricing
            </h2>

            <p className="mt-1 max-w-2xl text-sm text-[#6B7280]">
              Configure vehicle rates, platform fees and driver subscription
              plans for RideEasy.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#BBE7C9] bg-[#EAFBF2] px-4 py-3">

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#16A34A] shadow-sm">
              <i className="ri-money-rupee-circle-line text-xl" />
            </div>

            <div>
              <p className="text-xs text-[#6B7280]">
                Configuration
              </p>

              <p className="font-bold text-[#15803D]">
                Editable
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Pricing Editor */}
      <Card className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-0 shadow-sm">

        <div className="border-b border-[#E5E7EB] px-5 py-4 sm:px-6">

          <div className="flex items-start gap-3">

            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FFF4DF] text-[#B86B00]">
              <i className="ri-code-s-slash-line text-lg" />
            </div>

            <div>
              <h3 className="font-bold text-[#111827]">
                Pricing Configuration
              </h3>

              <p className="mt-0.5 text-xs text-[#6B7280]">
                Edit the existing pricing JSON configuration.
              </p>
            </div>

          </div>

        </div>

        <div className="p-5 sm:p-6">

          <div className="rounded-2xl border border-[#D9DEE7] bg-[#0B1B2B] p-1 shadow-inner">

            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">

              <div className="flex items-center gap-2">

                <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FFB21C]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />

                <span className="ml-2 text-xs font-medium text-slate-400">
                  pricing.json
                </span>

              </div>

              <span className="rounded-lg bg-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                JSON
              </span>

            </div>

            <textarea
              value={pricingJson}
              onChange={(event) =>
                setPricingJson(event.target.value)
              }
              placeholder='{"rates": {}, "driverPlans": {}}'
              spellCheck={false}
              className="h-[360px] w-full resize-none bg-[#0B1B2B] p-5 font-mono text-xs leading-6 text-[#F8FAFC] outline-none placeholder:text-slate-600 sm:text-sm"
            />

          </div>

          {/* Save */}
          <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#E5E7EB] bg-[#F7F9FC] p-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-3">

              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-[#B86B00]">
                <i className="ri-information-line" />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#111827]">
                  Save pricing changes
                </p>

                <p className="mt-0.5 text-xs text-[#6B7280]">
                  Changes will be saved to the existing pricing configuration.
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={savePricing}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFB21C] px-5 py-2.5 text-sm font-bold text-[#0B1B2B] shadow-sm transition hover:bg-[#FFC34D]"
            >
              <i className="ri-save-line" />
              Save Pricing
            </button>

          </div>

        </div>

      </Card>

      {/* Structure Reference */}
      <Card className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-0 shadow-sm">

        <div className="border-b border-[#E5E7EB] px-5 py-4 sm:px-6">

          <div className="flex items-center gap-3">

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#EEF2FF] text-[#4F46E5]">
              <i className="ri-file-code-line text-lg" />
            </div>

            <div>
              <h3 className="font-bold text-[#111827]">
                JSON Structure Reference
              </h3>

              <p className="mt-0.5 text-xs text-[#6B7280]">
                Example structure for rates and driver plans.
              </p>
            </div>

          </div>

        </div>

        <div className="p-5 sm:p-6">

          <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#F7F9FC]">

            <div className="border-b border-[#E5E7EB] px-4 py-3">
              <span className="text-xs font-semibold text-[#6B7280]">
                Example
              </span>
            </div>

            <pre className="overflow-x-auto p-5 font-mono text-xs leading-6 text-[#334155] sm:text-sm">
{`{
  "rates": {
    "auto": {
      "baseFare": 50,
      "perKm": 15,
      "platformFee": 5
    },
    "sedan": {
      "baseFare": 75,
      "perKm": 20,
      "platformFee": 7
    }
  },
  "driverPlans": {
    "auto": {
      "weekly": 200,
      "monthly": 700,
      "yearly": 7500
    }
  }
}`}
            </pre>

          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">

            <div className="rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] p-4">

              <div className="flex items-center gap-2">
                <i className="ri-road-map-line text-[#B86B00]" />
                <p className="text-sm font-bold text-[#111827]">
                  Vehicle rates
                </p>
              </div>

              <p className="mt-1 text-xs leading-5 text-[#6B7280]">
                Configure base fare, per-kilometre pricing and platform fees.
              </p>

            </div>

            <div className="rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] p-4">

              <div className="flex items-center gap-2">
                <i className="ri-user-star-line text-[#4F46E5]" />
                <p className="text-sm font-bold text-[#111827]">
                  Driver plans
                </p>
              </div>

              <p className="mt-1 text-xs leading-5 text-[#6B7280]">
                Configure weekly, monthly and yearly driver subscription plans.
              </p>

            </div>

          </div>

        </div>

      </Card>

>>>>>>> Stashed changes
    </div>
  )
}
