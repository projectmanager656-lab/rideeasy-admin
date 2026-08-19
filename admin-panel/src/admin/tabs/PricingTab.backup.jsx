import React from 'react'
import { Card, AlertCard } from '../../components/AdminUIComponents'

export default function PricingTab ({ pricingJson, setPricingJson, savePricing, pricingLoading }) {
  if (pricingLoading) {
    return (
      <Card className="text-center py-12">
        <div className="inline-flex items-center gap-2 text-neutral-600">
          <i className="ri-loader-4-line animate-spin text-xl"></i>
          <span>Loading pricing…</span>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Info Alert */}
      <AlertCard
        type="info"
        title="Pricing Configuration"
        message="Edit pricing in JSON format. Includes rates (per-vehicle baseFare, perKm, platformFee) and driverPlans (weekly/monthly/yearly subscriptions per vehicle type)."
      />

      {/* Pricing Editor */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-2">Pricing JSON</h3>
            <textarea
              className="h-72 w-full rounded-lg border border-neutral-300 bg-neutral-50 p-4 font-mono text-xs sm:text-sm text-neutral-900 focus:border-[#FFA726] focus:outline-none focus:ring-1 focus:ring-[#FFA726] resize-none"
              value={pricingJson}
              onChange={(e) => setPricingJson(e.target.value)}
              placeholder='{"rates": {}, "driverPlans": {}}'
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={savePricing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFA726] text-white font-medium hover:bg-[#FB8817] transition-colors"
            >
              <i className="ri-save-line"></i>
              Save pricing
            </button>
            <p className="text-xs text-neutral-500">Changes will be saved to the database</p>
          </div>
        </div>
      </Card>

      {/* Example Format */}
      <Card className="p-6 bg-neutral-50">
        <h3 className="text-sm font-semibold text-neutral-900 mb-3">JSON Structure Reference</h3>
        <pre className="text-xs bg-white rounded-lg p-3 border border-neutral-200 overflow-x-auto text-neutral-700">
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
      </Card>
    </div>
  )
}
