import React, { useMemo, useState } from 'react'

const formatAmount = (value) => {
  const amount = Number(value || 0)
  return `₹${amount.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  })}`
}

const getRideAmount = (ride) => {
  if (ride?.chargedAmount !== undefined && ride?.chargedAmount !== null) {
    return Number(ride.chargedAmount || 0)
  }

  if (ride?.price !== undefined && ride?.price !== null) {
    return Math.max(
      0,
      Number(ride.price || 0) - Number(ride.discountAmount || 0)
    )
  }

  return 0
}

export default function EarningsReport ({ rides = [], payments = [], onBack }) {
  const [dateRange, setDateRange] = useState('all')

  const filteredRides = useMemo(() => {
    const now = new Date()

    return rides.filter((ride) => {
      if (dateRange === 'all') return true

      const date = new Date(ride.completedAt || ride.createdAt)
      if (Number.isNaN(date.getTime())) return false

      const days =
        dateRange === '7' ? 7 :
        dateRange === '30' ? 30 :
        90

      const start = new Date(now)
      start.setDate(start.getDate() - days)

      return date >= start
    })
  }, [rides, dateRange])

  const completedRides = useMemo(
    () =>
      filteredRides.filter(
        (ride) => String(ride.status || '').toLowerCase() === 'completed'
      ),
    [filteredRides]
  )

  const totalRevenue = useMemo(
    () =>
      completedRides.reduce(
        (total, ride) => total + getRideAmount(ride),
        0
      ),
    [completedRides]
  )

  const totalDiscount = useMemo(
    () =>
      completedRides.reduce(
        (total, ride) => total + Number(ride.discountAmount || 0),
        0
      ),
    [completedRides]
  )

  const platformFee = useMemo(
    () =>
      completedRides.reduce(
        (total, ride) => total + Number(ride.platformFee || 0),
        0
      ),
    [completedRides]
  )

  const driverEarnings = useMemo(
    () =>
      completedRides.reduce(
        (total, ride) => {
          if (
            ride.captainNetEarning !== undefined &&
            ride.captainNetEarning !== null
          ) {
            return total + Number(ride.captainNetEarning || 0)
          }

          return total
        },
        0
      ),
    [completedRides]
  )

  const recentRows = completedRides.slice(0, 10)

  return (
    <div className="space-y-5 pb-6 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-[#2563EB] hover:underline"
          >
            <i className="ri-arrow-left-line" />
            Back to Reports
          </button>

          <h1 className="text-[28px] font-bold tracking-[-0.04em] text-[#152238] sm:text-[32px]">
            Earnings Report
          </h1>

          <p className="mt-1 text-sm text-[#718096]">
            Revenue and earnings overview from completed rides
          </p>
        </div>

        <select
          value={dateRange}
          onChange={(event) => setDateRange(event.target.value)}
          className="rounded-xl border border-[#E6EBF2] bg-white px-4 py-2.5 text-sm font-medium text-[#152238] outline-none focus:border-[#2563EB]"
        >
          <option value="all">All time</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-[#E6EBF2] bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.05)]">
          <p className="text-xs font-medium text-[#718096]">Total Revenue</p>
          <p className="mt-2 text-2xl font-bold text-[#152238]">
            {formatAmount(totalRevenue)}
          </p>
          <p className="mt-1 text-xs text-[#718096]">
            From completed rides
          </p>
        </div>

        <div className="rounded-2xl border border-[#E6EBF2] bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.05)]">
          <p className="text-xs font-medium text-[#718096]">Driver Earnings</p>
          <p className="mt-2 text-2xl font-bold text-[#152238]">
            {formatAmount(driverEarnings)}
          </p>
          <p className="mt-1 text-xs text-[#718096]">
            Recorded captain earnings
          </p>
        </div>

        <div className="rounded-2xl border border-[#E6EBF2] bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.05)]">
          <p className="text-xs font-medium text-[#718096]">Platform Fee</p>
          <p className="mt-2 text-2xl font-bold text-[#152238]">
            {formatAmount(platformFee)}
          </p>
          <p className="mt-1 text-xs text-[#718096]">
            Recorded platform fees
          </p>
        </div>

        <div className="rounded-2xl border border-[#E6EBF2] bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.05)]">
          <p className="text-xs font-medium text-[#718096]">Discounts</p>
          <p className="mt-2 text-2xl font-bold text-[#152238]">
            {formatAmount(totalDiscount)}
          </p>
          <p className="mt-1 text-xs text-[#718096]">
            Applied to completed rides
          </p>
        </div>
      </div>

      {/* Ride earnings table */}
      <section className="overflow-hidden rounded-2xl border border-[#E6EBF2] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.05)]">
        <div className="border-b border-[#E6EBF2] px-5 py-4">
          <h2 className="text-base font-bold text-[#152238]">
            Ride Earnings
          </h2>
          <p className="mt-1 text-xs text-[#718096]">
            Completed rides included in this report
          </p>
        </div>

        {recentRows.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <i className="ri-bar-chart-box-line text-3xl text-[#A0AEC0]" />
            <p className="mt-3 text-sm font-medium text-[#152238]">
              No completed ride earnings found
            </p>
            <p className="mt-1 text-xs text-[#718096]">
              Try another date range.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full">
              <thead>
                <tr className="border-b border-[#E6EBF2] bg-[#FAFBFC] text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-[#718096]">
                    Ride
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-[#718096]">
                    Date
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-[#718096]">
                    Fare
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-[#718096]">
                    Discount
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-[#718096]">
                    Platform Fee
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-[#718096]">
                    Driver Earnings
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E6EBF2]">
                {recentRows.map((ride) => (
                  <tr key={ride._id} className="hover:bg-[#FAFBFC]">
                    <td className="px-5 py-4 text-sm font-semibold text-[#152238]">
                      {ride._id ? String(ride._id).slice(-8) : '—'}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#718096]">
                      {ride.completedAt || ride.createdAt
                        ? new Date(
                            ride.completedAt || ride.createdAt
                          ).toLocaleDateString('en-IN')
                        : '—'}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-[#152238]">
                      {formatAmount(getRideAmount(ride))}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#718096]">
                      {formatAmount(ride.discountAmount)}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#718096]">
                      {formatAmount(ride.platformFee)}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-[#152238]">
                      {formatAmount(ride.captainNetEarning)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
