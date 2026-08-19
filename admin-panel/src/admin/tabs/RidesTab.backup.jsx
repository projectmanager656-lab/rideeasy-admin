import React from 'react'
import { displayName, rowStableKey, statusBadgeClass, RIDE_STATUSES } from '../adminUtils'
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
  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#111827] sm:text-xl">Bookings Management</h2>
            <p className="text-sm text-[#6B7280]">Total: {rides.length} bookings</p>
          </div>
          {selectedIds.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FFA726]/10 px-3 py-1 text-sm font-semibold text-[#FFA726]">
              <i className="ri-checkbox-circle-line"></i>
              {selectedIds.length} selected
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <i className="ri-filter-line text-[#6B7280]"></i>
            <select
              value={rideStatusFilter}
              onChange={(e) => setRideStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-[#FAFAFA] text-[#111827] px-3 py-2 text-sm focus:border-[#FFA726] focus:outline-none focus:ring-2 focus:ring-[#FFA726]/20 transition-all"
            >
              {RIDE_STATUSES.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="relative flex-1">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"></i>
            <input
              type="search"
              placeholder="Search by city, passenger, driver…"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-[#FAFAFA] py-2 pl-10 pr-4 text-sm text-[#111827] placeholder:text-[#6B7280] focus:border-[#FFA726] focus:outline-none focus:ring-2 focus:ring-[#FFA726]/20 transition-all"
            />
          </div>

          {selectedIds.length > 0 && (
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={clearSelection} 
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-[#6B7280] hover:bg-slate-50 transition-colors"
              >
                Clear
              </button>
              <button 
                type="button" 
                onClick={bulkDeleteRides} 
                className="rounded-lg bg-[#E5484D] text-white px-3 py-2 text-sm font-medium hover:bg-[#D73A43] transition-colors"
              >
                Delete ({selectedIds.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Rides Table */}
      <Card className="p-0 overflow-hidden">
        {ridesLoading ? (
          <div className="p-12 text-center">
            <i className="ri-loader-4-line animate-spin text-2xl text-[#FFA726] mb-2 block"></i>
            <p className="text-sm text-[#6B7280]">Loading bookings…</p>
          </div>
        ) : filteredRides.length === 0 ? (
          <div className="p-12 text-center">
            <i className="ri-calendar-line text-4xl text-[#6B7280]/30 mb-2 block"></i>
            <p className="text-sm text-[#6B7280]">{tableSearch ? 'No bookings match your search.' : 'No bookings found.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F9FAFB] border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="w-10 px-4 py-3">
                    <input
                      ref={tableHeaderSelectRef}
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 cursor-pointer"
                      checked={filteredRides.length > 0 && filteredRides.every((r) => selectedIds.includes(String(r._id)))}
                      onChange={(e) => (e.target.checked ? selectAllVisible(filteredRides) : clearSelection())}
                    />
                  </th>
                  <th className="px-4 py-3 font-semibold text-[#111827]">Date</th>
                  <th className="px-4 py-3 font-semibold text-[#111827]">City</th>
                  <th className="px-4 py-3 font-semibold text-[#111827]">Passenger</th>
                  <th className="px-4 py-3 font-semibold text-[#111827]">Driver</th>
                  <th className="px-4 py-3 font-semibold text-[#111827]">Route</th>
                  <th className="px-4 py-3 font-semibold text-[#111827] text-right">Amount</th>
                  <th className="px-4 py-3 font-semibold text-[#111827]">Status</th>
                  <th className="px-4 py-3 font-semibold text-[#111827]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRides.map((r, idx) => (
                  <tr key={rowStableKey(r, idx)} className="hover:bg-[#FFF8F0] transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 cursor-pointer"
                        checked={selectedIds.includes(String(r._id))}
                        onChange={() => toggleSelect(r._id)}
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-[#6B7280] text-xs sm:text-sm">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="px-4 py-3 text-[#6B7280] text-xs sm:text-sm">{r.city || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="text-xs sm:text-sm font-medium text-[#111827]">{displayName(r.user?.name) || '—'}</div>
                      <div className="text-xs text-[#6B7280]">{r.user?.phone || '—'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs sm:text-sm font-medium text-[#111827]">{displayName(r.captain?.name) || '—'}</div>
                      <div className="text-xs text-[#6B7280]">{r.captain?.vehicleNumber || r.captain?.phone || '—'}</div>
                    </td>
                    <td className="max-w-xs px-4 py-3 text-[#6B7280] text-xs sm:text-sm">
                      <div className="line-clamp-1">{r.pickupLocation ?? '—'}</div>
                      <div className="text-[#6B7280]/50">→</div>
                      <div className="line-clamp-1">{r.dropLocation ?? '—'}</div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium text-[#111827] text-xs sm:text-sm">₹{r.price ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(r.status)}`}>
                        {r.status || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="text-xs font-medium px-2 py-1 rounded text-[#E5484D] hover:bg-[#FEECEC] transition-colors"
                        onClick={() => deleteRide(r._id)}
                        title="Delete booking"
                      >
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
