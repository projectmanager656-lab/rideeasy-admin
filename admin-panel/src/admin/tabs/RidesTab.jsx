import React from 'react'
import { displayName, rowStableKey, statusBadgeClass, RIDE_STATUSES } from '../adminUtils'
import MobileRecordCard, { MobileField } from '../../components/MobileRecordCard'
import Modal from '../../components/ui/Modal'

export default function RidesTab ({
  ridesLoading,
  filteredRides,
  rides,
  selectedRide,
  onViewRide,
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
  refreshRides,
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white px-3 py-3 sm:px-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-neutral-600">
            Status
            <select
              value={rideStatusFilter}
              onChange={(e) => setRideStatusFilter(e.target.value)}
              className="ml-2 rounded-lg border border-neutral-300 bg-white text-black px-3 py-2 text-sm"
            >
              {RIDE_STATUSES.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
        </div>
        <input
          type="search"
          placeholder="Search city, route, passenger, driver, id…"
          value={tableSearch}
          onChange={(e) => setTableSearch(e.target.value)}
          className="w-full max-w-full sm:max-w-md rounded-lg border border-neutral-300 bg-white text-black px-3 py-2 text-sm placeholder:text-neutral-500 focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:ml-auto"
        />
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-neutral-600">{selectedIds.length} selected</span>
            <button type="button" onClick={clearSelection} className="text-xs text-neutral-600 hover:text-black">Clear</button>
            <button type="button" onClick={bulkDeleteRides} className="rounded-lg border border-black bg-black px-2 py-1.5 sm:px-3 text-xs font-medium text-white hover:bg-neutral-800">Delete selected</button>
          </div>
        )}
      </div>
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl">
        {ridesLoading ? (
          <div className="p-12 text-center text-neutral-600">Loading rides…</div>
        ) : (
          <>
          <div className="space-y-3 p-3 md:hidden">
            {filteredRides.map((ride, index) => <MobileRecordCard key={rowStableKey(ride, index)} title={`Ride ${String(ride._id).slice(-8)}`} subtitle={ride.createdAt ? new Date(ride.createdAt).toLocaleString() : 'Date unavailable'} badge={<span className={`rounded-full border px-2 py-1 text-[10px] font-semibold capitalize ${statusBadgeClass(ride.status)}`}>{ride.status || '—'}</span>} checked={selectedIds.includes(String(ride._id))} onCheck={() => toggleSelect(ride._id)} actions={<div className="flex gap-2">
  <button
    type="button"
    onClick={() => onViewRide(ride)}
    className="rounded-lg bg-neutral-100 px-3 py-2 text-xs font-semibold text-neutral-800"
  >
    View
  </button>
  <button
    type="button"
    onClick={() => deleteRide(ride._id)}
    className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-[#DC2626]"
  >
    Delete
  </button>
</div>}><MobileField label="Pickup" value={ride.pickupLocation} /><MobileField label="Drop" value={ride.dropLocation} /><MobileField label="User" value={displayName(ride.user?.name)} /><MobileField label="Driver" value={displayName(ride.captain?.name) || 'Unassigned'} /><MobileField label="Vehicle" value={ride.vehicleType || '—'} /><MobileField label="Distance" value={ride.distance != null ? `${ride.distance} km` : '—'} /><MobileField label="Fare" value={ride.price != null ? `₹${ride.price}` : '—'} /><MobileField label="Payment" value={ride.paymentMethod ? `${ride.paymentMethod} · ${ride.paymentStatus || 'pending'}` : (ride.paymentStatus || '—')} /></MobileRecordCard>)}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[1200px] text-left text-sm text-neutral-900">
              <thead className="border-b border-neutral-200 bg-neutral-100 text-xs uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="w-10 px-2 py-3">
                    <input
                      ref={tableHeaderSelectRef}
                      type="checkbox"
                      className="h-4 w-4 rounded border-neutral-400 bg-white text-black border-neutral-400 focus:ring-black"
                      checked={filteredRides.length > 0 && filteredRides.every((r) => selectedIds.includes(String(r._id)))}
                      onChange={(e) => (e.target.checked ? selectAllVisible(filteredRides) : clearSelection())}
                    />
                  </th>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">City</th>
                  <th className="px-4 py-3">Passenger</th>
                  <th className="px-4 py-3">Driver</th>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Distance</th>
                  <th className="px-4 py-3">Route</th>
                  <th className="px-4 py-3 text-right">₹</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="sticky right-0 z-20 bg-neutral-100 px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {!ridesLoading && filteredRides.length === 0 && (
                  <tr>
                    <td colSpan={12} className="px-4 py-8 text-center text-neutral-500">
                      {rides.length === 0
                        ? 'No rides in the database yet. Pick All under Status, or check the backend connection.'
                        : 'No rides match your search or filter.'}
                    </td>
                  </tr>
                )}
                {filteredRides.map((r, idx) => (
                  <tr key={rowStableKey(r, idx)} className="hover:bg-neutral-100">
                    <td className="px-2 py-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-neutral-400 bg-white text-black border-neutral-400 focus:ring-black"
                        checked={selectedIds.includes(String(r._id))}
                        onChange={() => toggleSelect(r._id)}
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-neutral-500">
                      {r.createdAt ? new Date(r.createdAt).toLocaleString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{r.city || '—'}</td>
                    <td className="px-4 py-3 text-neutral-600">
                      {displayName(r.user?.name) || '—'}
                      <span className="block text-xs text-neutral-500">{r.user?.phone || ''}</span>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {displayName(r.captain?.name) || '—'}
                      <span className="block text-xs text-neutral-500">{r.captain?.vehicleNumber || r.captain?.phone || ''}</span>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                    {r.vehicleType || '—'}
                  </td>
                  <td className="px-4 py-3 text-neutral-600 whitespace-nowrap">
                    {r.distance != null ? `${r.distance} km` : '—'}
                  </td>
                  <td className="max-w-xs px-4 py-3 text-neutral-600">
                      <span className="line-clamp-2">{r.pickupLocation ?? '—'}</span>
                      <span className="text-neutral-600"> → </span>
                      <span className="line-clamp-2">{r.dropLocation ?? '—'}</span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium text-black">₹{r.price ?? '—'}</td>
                    <td className="px-4 py-3 text-neutral-600">
                      {r.paymentMethod || '—'}
                      <span className="block text-xs text-neutral-500">
                        {r.paymentStatus || ''}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${statusBadgeClass(r.status)}`}>
                        {r.status || '—'}
                      </span>
                    </td>
                    <td className="sticky right-0 z-10 bg-white px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className="text-sm font-medium text-neutral-600 underline hover:text-black"
                          onClick={() => onViewRide(r)}
                        >
                          View
                        </button>
                        <button
                          type="button"
                          className="text-sm font-medium text-red-600 underline hover:text-red-800"
                          onClick={() => deleteRide(r._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>

      <Modal
        open={Boolean(selectedRide)}
        onClose={() => onViewRide?.(null)}
        title="Ride Details"
        size="xl"
      >
        {selectedRide && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">Ride ID</p>
                <p className="mt-1 break-all text-sm font-semibold text-neutral-900">{selectedRide._id || '—'}</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">Status</p>
                <p className="mt-1 text-sm font-semibold capitalize text-neutral-900">{selectedRide.status || '—'}</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">Pickup</p>
                <p className="mt-1 text-sm text-neutral-900">{selectedRide.pickupLocation || '—'}</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">Drop</p>
                <p className="mt-1 text-sm text-neutral-900">{selectedRide.dropLocation || '—'}</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">Vehicle</p>
                <p className="mt-1 text-sm text-neutral-900">{selectedRide.vehicleType || '—'}</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">Distance</p>
                <p className="mt-1 text-sm text-neutral-900">
                  {selectedRide.distance != null ? `${selectedRide.distance} km` : '—'}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">Fare</p>
                <p className="mt-1 text-sm font-semibold text-neutral-900">
                  {selectedRide.price != null ? `₹${selectedRide.price}` : '—'}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">Charged Amount</p>
                <p className="mt-1 text-sm font-semibold text-neutral-900">
                  {selectedRide.chargedAmount != null ? `₹${selectedRide.chargedAmount}` : '—'}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">Payment</p>
                <p className="mt-1 text-sm text-neutral-900">
                  {selectedRide.paymentMethod || '—'}
                  {selectedRide.paymentStatus ? ` · ${selectedRide.paymentStatus}` : ''}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">Passenger</p>
                <p className="mt-1 text-sm text-neutral-900">{displayName(selectedRide.user?.name) || '—'}</p>
                <p className="text-xs text-neutral-500">{selectedRide.user?.phone || '—'}</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">Driver</p>
                <p className="mt-1 text-sm text-neutral-900">{displayName(selectedRide.captain?.name) || 'Unassigned'}</p>
                <p className="text-xs text-neutral-500">
                  {selectedRide.captain?.phone || '—'}
                  {selectedRide.captain?.vehicleNumber ? ` · ${selectedRide.captain.vehicleNumber}` : ''}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">Created</p>
                <p className="mt-1 text-sm text-neutral-900">
                  {selectedRide.createdAt ? new Date(selectedRide.createdAt).toLocaleString() : '—'}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-neutral-200 pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900">Payment Breakdown</h3>
                  <p className="mt-1 text-xs text-neutral-500">
                    User payment, driver earnings and platform fee
                  </p>
                </div>
                <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold capitalize text-neutral-700">
                  {selectedRide.paymentMethod || '—'}
                </span>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                  <p className="text-xs text-neutral-500">User Paid</p>
                  <p className="mt-1 text-lg font-semibold text-neutral-900">
                    {selectedRide.chargedAmount != null
                      ? `₹${selectedRide.chargedAmount}`
                      : '—'}
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                  <p className="text-xs text-neutral-500">Driver Gets</p>
                  <p className="mt-1 text-lg font-semibold text-neutral-900">
                    {selectedRide.captainNetEarning != null
                      ? `₹${selectedRide.captainNetEarning}`
                      : '—'}
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                  <p className="text-xs text-neutral-500">Admin / Platform Fee</p>
                  <p className="mt-1 text-lg font-semibold text-neutral-900">
                    {selectedRide.platformFee != null
                      ? `₹${selectedRide.platformFee}`
                      : '—'}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs text-neutral-500">
                Payment Status:
                <span className="ml-1 font-semibold text-neutral-700">
                  {selectedRide.paymentStatus || 'pending'}
                </span>
              </p>
            </div>

            <div className="border-t border-neutral-200 pt-5">
              <h3 className="text-sm font-semibold text-neutral-900">Assignment Summary</h3>

              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                  <p className="text-xs text-neutral-500">Current Driver</p>
                  <p className="mt-1 text-sm font-semibold text-neutral-900">
                    {displayName(selectedRide.captain?.name) || 'Unassigned'}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {selectedRide.captain?.phone || '—'}
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                  <p className="text-xs text-neutral-500">Vehicle</p>
                  <p className="mt-1 text-sm font-semibold text-neutral-900">
                    {selectedRide.captain?.vehicleNumber || '—'}
                  </p>
                  <p className="mt-1 text-xs uppercase text-neutral-500">
                    {selectedRide.captain?.vehicleType || selectedRide.vehicleType || '—'}
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                  <p className="text-xs text-neutral-500">Current Ride State</p>
                  <p className="mt-1 text-sm font-semibold capitalize text-neutral-900">
                    {selectedRide.status || '—'}
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                  <p className="text-xs text-neutral-500">Assignment Time</p>
                  <p className="mt-1 text-sm text-neutral-900">
                    {selectedRide.acceptedAt
                      ? new Date(selectedRide.acceptedAt).toLocaleString()
                      : 'Not assigned'}
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                  <p className="text-xs text-neutral-500">ETA</p>
                  <p className="mt-1 text-sm text-neutral-500">
                    Not available from backend
                  </p>
                </div>
              </div>
            </div>

            {(() => {
              const matchingAttempts = selectedRide.matchingAttempts || []

              return (
              <div className="border-t border-neutral-200 pt-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-neutral-900">
                    Matching Attempts
                  </h3>
                  <span className="text-xs text-neutral-500">
                    {matchingAttempts.length} attempt
                    {matchingAttempts.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="mt-3 space-y-3">
                  {matchingAttempts.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-4 text-sm text-neutral-500">
                      No matching attempts recorded yet.
                    </div>
                  ) : (
                    matchingAttempts.map((attempt, index) => {
                    const captain = attempt.captain
                    const response = attempt.response || 'pending'

                    const responseClass = {
                      accepted: 'border-green-200 bg-green-50 text-green-700',
                      rejected: 'border-red-200 bg-red-50 text-red-700',
                      expired: 'border-amber-200 bg-amber-50 text-amber-700',
                      pending: 'border-neutral-200 bg-neutral-100 text-neutral-600',
                    }[response] || 'border-neutral-200 bg-neutral-100 text-neutral-600'

                    return (
                      <div
                        key={`${attempt._id || attempt.attemptNumber || index}`}
                        className="rounded-xl border border-neutral-200 bg-neutral-50 p-3"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-xs font-medium uppercase text-neutral-500">
                              Attempt #{attempt.attemptNumber || index + 1}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-neutral-900">
                              {displayName(captain?.name) || 'Driver unavailable'}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {captain?.phone || captain?.vehicleNumber || '—'}
                            </p>
                          </div>

                          <span
                            className={`inline-flex w-fit rounded-full border px-2 py-1 text-xs font-semibold capitalize ${responseClass}`}
                          >
                            {response}
                          </span>
                        </div>

                        <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                          <div>
                            <p className="text-xs text-neutral-500">Offered At</p>
                            <p className="mt-1 text-neutral-900">
                              {attempt.offeredAt
                                ? new Date(attempt.offeredAt).toLocaleString()
                                : '—'}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-neutral-500">Responded At</p>
                            <p className="mt-1 text-neutral-900">
                              {attempt.respondedAt
                                ? new Date(attempt.respondedAt).toLocaleString()
                                : '—'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                    })
                  )}
                </div>
              </div>
              )
            })()}

            <div className="border-t border-neutral-200 pt-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-sm font-semibold text-neutral-900">Assignment Timeline</h3>
                <button
                  type="button"
                  onClick={refreshRides}
                  disabled={ridesLoading}
                  className="inline-flex w-fit items-center rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {ridesLoading ? 'Refreshing...' : 'Refresh Timeline'}
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {[
                  ['Ride Created', selectedRide.createdAt],
                  ['Driver Accepted', selectedRide.acceptedAt],
                  ['Driver Arrived', selectedRide.arrivedAt],
                  ['Ride Started', selectedRide.startedAt],
                  ['Ride Completed', selectedRide.completedAt],
                  ['Ride Cancelled', selectedRide.cancelledAt],
                ]
                  .filter(([, value]) => value)
                  .map(([label, value], index) => (
                    <div key={label} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-neutral-900" />
                        {index < 5 && (
                          <span className="mt-1 h-full min-h-6 w-px bg-neutral-200" />
                        )}
                      </div>

                      <div className="pb-2">
                        <p className="text-sm font-semibold text-neutral-900">{label}</p>
                        <p className="mt-1 text-xs text-neutral-500">
                          {new Date(value).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {(selectedRide.cancelledBy || selectedRide.cancellationReason ||
              selectedRide.cancellationFee != null) && (
              <div className="border-t border-neutral-200 pt-5">
                <h3 className="text-sm font-semibold text-neutral-900">Cancellation</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-neutral-500">Cancelled By</p>
                    <p className="mt-1 text-sm capitalize text-neutral-900">{selectedRide.cancelledBy || '—'}</p>
                  </div>

                  <div>
                    <p className="text-xs text-neutral-500">Cancellation Fee</p>
                    <p className="mt-1 text-sm text-neutral-900">
                      {selectedRide.cancellationFee != null ? `₹${selectedRide.cancellationFee}` : '—'}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-xs text-neutral-500">Reason</p>
                    <p className="mt-1 text-sm text-neutral-900">{selectedRide.cancellationReason || '—'}</p>
                  </div>
                </div>
              </div>
            )}

            {(selectedRide.rating != null || selectedRide.ratingComment ||
              selectedRide.captainPassengerRating != null) && (
              <div className="border-t border-neutral-200 pt-5">
                <h3 className="text-sm font-semibold text-neutral-900">Ratings</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-neutral-500">Passenger Rating</p>
                    <p className="mt-1 text-sm text-neutral-900">
                      {selectedRide.rating != null ? `${selectedRide.rating}/5` : '—'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-neutral-500">Driver Rating</p>
                    <p className="mt-1 text-sm text-neutral-900">
                      {selectedRide.captainPassengerRating != null
                        ? `${selectedRide.captainPassengerRating}/5`
                        : '—'}
                    </p>
                  </div>

                  {selectedRide.ratingComment && (
                    <div className="sm:col-span-2">
                      <p className="text-xs text-neutral-500">Comment</p>
                      <p className="mt-1 text-sm text-neutral-900">{selectedRide.ratingComment}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
