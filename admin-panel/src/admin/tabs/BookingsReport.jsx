import React, { useMemo, useState } from 'react'

const money = (value) => {
  if (value == null || value === '') return '—'
  return `₹${Number(value).toLocaleString('en-IN')}`
}

const statusKey = (status) =>
  String(status || '').trim().toLowerCase()

const getFare = (ride) => {
  if (ride?.chargedAmount != null) return Number(ride.chargedAmount || 0)
  if (ride?.price != null) return Number(ride.price || 0)
  return 0
}

export default function BookingsReport ({
  rides = [],
  ridesLoading = false,
  onBack,
}) {
  const [dateRange, setDateRange] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredRides = useMemo(() => {
    const now = new Date()

    return rides.filter((ride) => {
      const status = statusKey(ride.status)

      if (statusFilter !== 'all' && status !== statusFilter) {
        return false
      }

      if (dateRange === 'all') return true

      const date = new Date(ride.createdAt)
      if (Number.isNaN(date.getTime())) return false

      const days = dateRange === '7' ? 7 : dateRange === '30' ? 30 : 90
      const start = new Date(now)
      start.setDate(start.getDate() - days)

      return date >= start
    })
  }, [rides, dateRange, statusFilter])

  const completedCount = filteredRides.filter(
    (ride) => statusKey(ride.status) === 'completed'
  ).length

  const cancelledCount = filteredRides.filter(
    (ride) => statusKey(ride.status) === 'cancelled'
  ).length

  const ongoingCount = filteredRides.filter((ride) =>
    ['started', 'ongoing', 'in_progress', 'accepted'].includes(
      statusKey(ride.status)
    )
  ).length

  const pendingCount = filteredRides.filter((ride) =>
    ['pending', 'requested', 'searching', 'matching'].includes(
      statusKey(ride.status)
    )
  ).length

  const totalBookingValue = filteredRides.reduce(
    (total, ride) => total + getFare(ride),
    0
  )

  return (
    <div className="space-y-5 pb-6 sm:space-y-6">
      {ridesLoading ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#E5E7EB] border-t-[#2563EB]" />
          <p className="mt-3 text-sm font-medium text-[#718096]">
            Loading bookings report…
          </p>
        </div>
      ) : (
        <>
          {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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
            Bookings Report
          </h1>

          <p className="mt-1 text-sm text-[#718096]">
            Booking activity and ride status overview
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-xl border border-[#E6EBF2] bg-white px-4 py-2.5 text-sm font-medium text-[#152238] outline-none focus:border-[#2563EB]"
          >
            <option value="all">All time</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-[#E6EBF2] bg-white px-4 py-2.5 text-sm font-medium text-[#152238] outline-none focus:border-[#2563EB]"
          >
            <option value="all">All statuses</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="started">Started</option>
            <option value="accepted">Accepted</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-[#E6EBF2] bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.05)]">
          <p className="text-xs font-medium text-[#718096]">Total Bookings</p>
          <p className="mt-2 text-2xl font-bold text-[#152238]">
            {filteredRides.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E6EBF2] bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.05)]">
          <p className="text-xs font-medium text-[#718096]">Completed</p>
          <p className="mt-2 text-2xl font-bold text-[#152238]">
            {completedCount}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E6EBF2] bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.05)]">
          <p className="text-xs font-medium text-[#718096]">Ongoing</p>
          <p className="mt-2 text-2xl font-bold text-[#152238]">
            {ongoingCount}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E6EBF2] bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.05)]">
          <p className="text-xs font-medium text-[#718096]">Cancelled</p>
          <p className="mt-2 text-2xl font-bold text-[#152238]">
            {cancelledCount}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E6EBF2] bg-white p-5 shadow-[0_2px_10px_rgba(15,23-42,0.05)]">
          <p className="text-xs font-medium text-[#718096]">Booking Value</p>
          <p className="mt-2 text-2xl font-bold text-[#152238]">
            {money(totalBookingValue)}
          </p>
        </div>
      </div>

      {/* Booking table */}
      <section className="overflow-hidden rounded-2xl border border-[#E6EBF2] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.05)]">
        <div className="border-b border-[#E6EBF2] px-5 py-4">
          <h2 className="text-base font-bold text-[#152238]">
            Booking Details
          </h2>
          <p className="mt-1 text-xs text-[#718096]">
            Ride, rider, driver and fare information
          </p>
        </div>

        {filteredRides.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <i className="ri-calendar-close-line text-3xl text-[#A0AEC0]" />
            <p className="mt-3 text-sm font-medium text-[#152238]">
              No bookings found
            </p>
            <p className="mt-1 text-xs text-[#718096]">
              Try changing the date or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1300px] w-full text-left">
              <thead>
                <tr className="border-b border-[#E6EBF2] bg-[#FAFBFC]">
                  <th className="px-5 py-3 text-xs font-semibold text-[#718096]">Ride</th>
                  <th className="px-5 py-3 text-xs font-semibold text-[#718096]">Date</th>
                  <th className="px-5 py-3 text-xs font-semibold text-[#718096]">Rider</th>
                  <th className="px-5 py-3 text-xs font-semibold text-[#718096]">Driver</th>
                  <th className="px-5 py-3 text-xs font-semibold text-[#718096]">Vehicle</th>
                  <th className="px-5 py-3 text-xs font-semibold text-[#718096]">Route</th>
                  <th className="px-5 py-3 text-xs font-semibold text-[#718096]">Fare</th>
                  <th className="px-5 py-3 text-xs font-semibold text-[#718096]">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E6EBF2]">
                {filteredRides.map((ride) => (
                  <tr key={ride._id} className="hover:bg-[#FAFBFC]">
                    <td className="px-5 py-4 text-sm font-semibold text-[#152238]">
                      {ride._id ? String(ride._id).slice(-8) : '—'}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-sm text-[#718096]">
                      {ride.createdAt
                        ? new Date(ride.createdAt).toLocaleString('en-IN')
                        : '—'}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#152238]">
                      <span className="font-medium">
                        {ride.user?.name || '—'}
                      </span>
                      <span className="block text-xs text-[#718096]">
                        {ride.user?.phone || ''}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#152238]">
                      <span className="font-medium">
                        {ride.captain?.name || 'Unassigned'}
                      </span>
                      <span className="block text-xs text-[#718096]">
                        {ride.captain?.vehicleNumber || ride.captain?.phone || ''}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#718096]">
                      {ride.vehicleType || '—'}
                    </td>

                    <td className="max-w-xs px-5 py-4 text-sm text-[#718096]">
                      <div className="line-clamp-1">{ride.pickupLocation || '—'}</div>
                      <div className="text-[#A0AEC0]">→</div>
                      <div className="line-clamp-1">{ride.dropLocation || '—'}</div>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-[#152238]">
                      {money(getFare(ride))}
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full border border-[#E6EBF2] bg-[#F7F9FC] px-2.5 py-1 text-xs font-medium capitalize text-[#152238]">
                        {ride.status || '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
        </>
      )}
    </div>
  )
}
