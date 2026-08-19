import React from 'react'
import {
  displayName,
  rowStableKey,
  statusBadgeClass,
  RIDE_STATUSES,
} from '../adminUtils'
import { Card } from '../../components/AdminUIComponents'

export default function RidesTab ({
  ridesLoading,
  filteredRides,
  rides,
  rideStatusFilter,
  setRideStatusFilter,
  tableSearch,
  setTableSearch,
  selectedIds,
  toggleSelect,
  selectAllVisible,
  clearSelection,
  tableHeaderSelectRef,
  deleteRide,
  bulkDeleteRides,
}) {
  const completedCount = rides.filter(
    (ride) => String(ride.status).toLowerCase() === 'completed'
  ).length

  const pendingCount = rides.filter(
    (ride) =>
      ['pending', 'requested', 'searching'].includes(
        String(ride.status).toLowerCase()
      )
  ).length

  const cancelledCount = rides.filter(
    (ride) => String(ride.status).toLowerCase() === 'cancelled'
  ).length

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-6">

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B86B00]">
              Operations
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#111827]">
              Bookings
            </h2>

            <p className="mt-1 text-sm text-[#6B7280]">
              Monitor and manage RideEasy bookings.
            </p>
          </div>

          {/* Booking statistics */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">

            <div className="rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] px-3 py-2">
              <p className="text-[11px] text-[#6B7280]">
                Total
              </p>
              <p className="mt-0.5 font-bold text-[#111827]">
                {rides.length}
              </p>
            </div>

            <div className="rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] px-3 py-2">
              <p className="text-[11px] text-[#6B7280]">
                Completed
              </p>
              <p className="mt-0.5 font-bold text-[#16A34A]">
                {completedCount}
              </p>
            </div>

            <div className="rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] px-3 py-2">
              <p className="text-[11px] text-[#6B7280]">
                Pending
              </p>
              <p className="mt-0.5 font-bold text-[#B86B00]">
                {pendingCount}
              </p>
            </div>

            <div className="rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] px-3 py-2">
              <p className="text-[11px] text-[#6B7280]">
                Cancelled
              </p>
              <p className="mt-0.5 font-bold text-[#DC2626]">
                {cancelledCount}
              </p>
            </div>

          </div>
        </div>

        {/* Search + Filter */}
        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center">

          {/* Status filter */}
          <div className="relative">
            <i className="ri-filter-3-line absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />

            <select
              value={rideStatusFilter}
              onChange={(e) => setRideStatusFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] py-2.5 pl-10 pr-9 text-sm font-medium text-[#111827] outline-none transition-all focus:border-[#FFB21C] focus:ring-2 focus:ring-[#FFB21C]/20 sm:w-[190px]"
            >
              {RIDE_STATUSES.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>

            <i className="ri-arrow-down-s-line pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          </div>

          {/* Search */}
          <div className="relative flex-1">

            <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-base text-[#6B7280]" />

            <input
              type="search"
              placeholder="Search by city, passenger, driver or route…"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="w-full rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] py-2.5 pl-11 pr-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all focus:border-[#FFB21C] focus:ring-2 focus:ring-[#FFB21C]/20"
            />
          </div>

          {/* Bulk actions */}
          {selectedIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">

              <span className="inline-flex items-center gap-2 rounded-xl bg-[#FFF4DF] px-3 py-2 text-sm font-semibold text-[#B86B00]">
                <i className="ri-checkbox-multiple-line" />
                {selectedIds.length} selected
              </span>

              <button
                type="button"
                onClick={clearSelection}
                className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-medium text-[#6B7280] transition hover:bg-[#F7F9FC] hover:text-[#111827]"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={bulkDeleteRides}
                className="inline-flex items-center gap-2 rounded-xl bg-[#EF4444] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#DC2626]"
              >
                <i className="ri-delete-bin-line" />
                Delete ({selectedIds.length})
              </button>

            </div>
          )}
        </div>
      </div>

      {/* Bookings table */}
      <Card className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-0 shadow-sm">

        {/* Table heading */}
        <div className="flex flex-col justify-between gap-2 border-b border-[#E5E7EB] px-5 py-4 sm:flex-row sm:items-center">

          <div>
            <h3 className="font-bold text-[#111827]">
              All Bookings
            </h3>

            <p className="mt-0.5 text-xs text-[#6B7280]">
              {filteredRides.length} booking
              {filteredRides.length === 1 ? '' : 's'} shown
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
            <i className="ri-information-line" />
            Booking data from RideEasy
          </div>

        </div>

        {ridesLoading ? (

          /* Loading */
          <div className="flex min-h-[360px] flex-col items-center justify-center p-12 text-center">

            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FFF4DF] text-[#FFB21C]">
              <i className="ri-loader-4-line animate-spin text-2xl" />
            </div>

            <p className="mt-4 text-sm font-medium text-[#6B7280]">
              Loading bookings…
            </p>

          </div>

        ) : filteredRides.length === 0 ? (

          /* Empty */
          <div className="flex min-h-[360px] flex-col items-center justify-center p-12 text-center">

            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#F7F9FC] text-[#9CA3AF]">
              <i className="ri-calendar-close-line text-2xl" />
            </div>

            <h3 className="mt-4 font-bold text-[#111827]">
              No bookings found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-[#6B7280]">
              {tableSearch
                ? 'No bookings match your current search.'
                : 'There are currently no bookings for this filter.'}
            </p>

          </div>

        ) : (

          /* Table */
          <div className="overflow-x-auto">

            <table className="w-full min-w-[1150px] text-left text-sm">

              <thead className="border-b border-[#E5E7EB] bg-[#F7F9FC]">

                <tr>

                  <th className="w-12 px-5 py-3.5">
                    <input
                      ref={tableHeaderSelectRef}
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#FFB21C]"
                      checked={
                        filteredRides.length > 0 &&
                        filteredRides.every((ride) =>
                          selectedIds.includes(String(ride._id))
                        )
                      }
                      onChange={(e) =>
                        e.target.checked
                          ? selectAllVisible(filteredRides)
                          : clearSelection()
                      }
                    />
                  </th>

                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    Date
                  </th>

                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    Passenger
                  </th>

                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    Driver
                  </th>

                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    City
                  </th>

                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    Route
                  </th>

                  <th className="px-4 py-3.5 text-right text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    Amount
                  </th>

                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    Status
                  </th>

                  <th className="px-4 py-3.5 text-right text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-[#E5E7EB]">

                {filteredRides.map((ride, idx) => (

                  <tr
                    key={rowStableKey(ride, idx)}
                    className="transition-colors hover:bg-[#FFFCF5]"
                  >

                    {/* Checkbox */}
                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#FFB21C]"
                        checked={selectedIds.includes(String(ride._id))}
                        onChange={() => toggleSelect(ride._id)}
                      />
                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap px-4 py-4">

                      <p className="text-sm font-medium text-[#111827]">
                        {ride.createdAt
                          ? new Date(ride.createdAt).toLocaleDateString(
                              'en-IN'
                            )
                          : '—'}
                      </p>

                      {ride.createdAt && (
                        <p className="mt-0.5 text-xs text-[#9CA3AF]">
                          {new Date(ride.createdAt).toLocaleTimeString(
                            'en-IN',
                            {
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </p>
                      )}

                    </td>

                    {/* Passenger */}
                    <td className="px-4 py-4">

                      <div className="flex items-center gap-2.5">

                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#0B1B2B] text-xs font-bold text-white">
                          {String(
                            displayName(ride.user?.name) || 'U'
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[#111827]">
                            {displayName(ride.user?.name) || 'Guest'}
                          </p>

                          <p className="text-xs text-[#9CA3AF]">
                            {ride.user?.phone || 'No phone'}
                          </p>
                        </div>

                      </div>

                    </td>

                    {/* Driver */}
                    <td className="px-4 py-4">

                      <div className="flex items-center gap-2.5">

                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#EAF4FF] text-[#2563EB]">
                          <i className="ri-steering-2-line" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[#111827]">
                            {displayName(ride.captain?.name) || 'Unassigned'}
                          </p>

                          <p className="text-xs text-[#9CA3AF]">
                            {ride.captain?.vehicleNumber ||
                              ride.captain?.phone ||
                              'No vehicle'}
                          </p>
                        </div>

                      </div>

                    </td>

                    {/* City */}
                    <td className="px-4 py-4">

                      <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
                        <i className="ri-map-pin-line text-[#9CA3AF]" />
                        {ride.city || '—'}
                      </div>

                    </td>

                    {/* Route */}
                    <td className="max-w-[270px] px-4 py-4">

                      <div className="space-y-1">

                        <div className="flex items-start gap-2">
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#22C55E]" />

                          <p className="truncate text-xs text-[#6B7280]">
                            {ride.pickupLocation || 'Pickup unavailable'}
                          </p>
                        </div>

                        <div className="ml-0.5 h-2 border-l border-dashed border-[#D1D5DB]" />

                        <div className="flex items-start gap-2">
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#EF4444]" />

                          <p className="truncate text-xs text-[#6B7280]">
                            {ride.dropLocation || 'Destination unavailable'}
                          </p>
                        </div>

                      </div>

                    </td>

                    {/* Amount */}
                    <td className="px-4 py-4 text-right">

                      <p className="font-bold tabular-nums text-[#111827]">
                        ₹{ride.price ?? '—'}
                      </p>

                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${statusBadgeClass(
                          ride.status
                        )}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {ride.status || 'Unknown'}
                      </span>

                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 text-right">

                      <button
                        type="button"
                        onClick={() => deleteRide(ride._id)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-[#DC2626] transition hover:bg-red-100"
                        title="Delete booking"
                      >
                        <i className="ri-delete-bin-line" />
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>
            </table>

          </div>
        )}

      </Card>
    </div>
  )
}
