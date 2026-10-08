import React, { useEffect, useState } from 'react'
import { useAdminLanguage } from '../../context/AdminLanguageContext'
import { displayName, rowStableKey, statusBadgeClass, RIDE_STATUSES } from '../adminUtils'
import MobileRecordCard, { MobileField } from '../../components/MobileRecordCard'
import Modal from '../../components/ui/Modal'

const money = (value) => {
  if (value == null || value === '') return '—'
  return `₹${Number(value).toLocaleString('en-IN')}`
}

const fareDifference = (bookedFare, finalFare) => {
  if (bookedFare == null || finalFare == null) return null
  return Number(finalFare) - Number(bookedFare)
}

export default function RidesTab ({
  ridesLoading,
  filteredRides,
  rides,
  users,
  drivers,
  selectedRide,
  rideAudit,
  rideAuditLoading,
  rideAuditError,
  onViewRide,
  rideStatusFilter,
  setRideStatusFilter,
  rideDateFilter,
  setRideDateFilter,
  rideDriverFilter,
  setRideDriverFilter,
  rideUserFilter,
  setRideUserFilter,
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
  const { t } = useAdminLanguage()

  const [ridesPage, setRidesPage] = useState(1)
  const ridesPageSize = 10

  const ridesPageCount = Math.max(
    1,
    Math.ceil(filteredRides.length / ridesPageSize)
  )

  const paginatedRides = filteredRides.slice(
    (ridesPage - 1) * ridesPageSize,
    ridesPage * ridesPageSize
  )

  useEffect(() => {
    setRidesPage(1)
  }, [rideStatusFilter, tableSearch])

  useEffect(() => {
    if (ridesPage > ridesPageCount) {
      setRidesPage(ridesPageCount)
    }
  }, [ridesPage, ridesPageCount])
  return (
    <div className="space-y-4">
      <div className="px-1">
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">{t.operations}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
          {t.rides}
        </h1>
        <p className="mt-2 text-base text-[var(--color-text-secondary)]">
          {t.ridesPageSubtitle}
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white px-3 py-3 sm:px-4 dark:border-[#26384D] dark:bg-[#0B1B2B]">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm text-neutral-600">
            {t.status}
            <select
              value={rideStatusFilter}
              onChange={(e) => setRideStatusFilter(e.target.value)}
              className="ml-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-black dark:border-[#3A4D63] dark:bg-[#0B1B2B] dark:text-white"
            >
              {RIDE_STATUSES.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>

          <label className="text-sm text-neutral-600">
            {t.date}
            <input
              type="date"
              value={rideDateFilter}
              onChange={(e) => setRideDateFilter(e.target.value)}
              className="ml-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-black dark:border-[#3A4D63] dark:bg-[#0B1B2B] dark:text-white"
            />
          </label>

          <label className="text-sm text-neutral-600">
            {t.driverLabel}
            <select
              value={rideDriverFilter}
              onChange={(e) => setRideDriverFilter(e.target.value)}
              className="ml-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-black dark:border-[#3A4D63] dark:bg-[#0B1B2B] dark:text-white"
            >
              <option value="all">{t.allDrivers}</option>
              {drivers.map((driver) => (
                <option key={driver._id} value={driver._id}>
                  {displayName(driver.name) || driver.phone || t.unnamedDriver}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-neutral-600">
            {t.user}
            <select
              value={rideUserFilter}
              onChange={(e) => setRideUserFilter(e.target.value)}
              className="ml-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-black dark:border-[#3A4D63] dark:bg-[#0B1B2B] dark:text-white"
            >
              <option value="all">{t.allUsers}</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {displayName(user.name) || user.phone || t.unnamedUser}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-3">
          <input
            type="search"
            placeholder={t.searchRides}
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-black placeholder:text-neutral-500 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-[#3A4D63] dark:bg-[#0B1B2B] dark:text-white dark:placeholder:text-[#7183A0] dark:focus:border-white dark:focus:ring-white"
          />
        </div>

        {selectedIds.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-neutral-600">{selectedIds.length} {t.selected}</span>
            <button type="button" onClick={clearSelection} className="text-xs text-neutral-600 hover:text-black">{t.clear}</button>
            <button type="button" onClick={bulkDeleteRides} className="rounded-lg border border-black bg-black px-2 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 sm:px-3">{t.deleteSelected}</button>
          </div>
        )}
      </div>
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-[#26384D] dark:bg-[#0B1B2B]">
        {ridesLoading ? (
          <div className="p-12 text-center text-neutral-600">{t.loadingRides}</div>
        ) : (
          <>
          <div className="space-y-3 p-3 md:hidden">
            {paginatedRides.map((ride, index) => <MobileRecordCard key={rowStableKey(ride, index)} title={`Ride ${String(ride._id).slice(-8)}`} subtitle={ride.createdAt ? new Date(ride.createdAt).toLocaleString() : t.dateUnavailable} badge={<span className={`rounded-full border px-2 py-1 text-[10px] font-semibold capitalize ${statusBadgeClass(ride.status)}`}>{ride.status || '—'}</span>} checked={selectedIds.includes(String(ride._id))} onCheck={() => toggleSelect(ride._id)} actions={<div className="flex gap-2">
  <button
    type="button"
    onClick={() => onViewRide(ride)}
    className="rounded-lg bg-neutral-100 px-3 py-2 text-xs font-semibold text-neutral-800"
  >
    {t.view}
  </button>
  <button
    type="button"
    onClick={() => deleteRide(ride._id)}
    className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-[#DC2626]"
  >
    {t.delete}
  </button>
</div>}><MobileField label={t.pickup} value={ride.pickupLocation} /><MobileField label={t.drop} value={ride.dropLocation} /><MobileField label={t.user} value={displayName(ride.user?.name)} /><MobileField label={t.driver} value={displayName(ride.captain?.name) || t.unassigned} /><MobileField label={t.vehicle} value={ride.vehicleType || '—'} /><MobileField label={t.distance} value={ride.distance != null ? `${ride.distance} km` : '—'} /><MobileField label={t.bookedFare} value={money(ride.price)} /><MobileField label={t.finalFare} value={ride.chargedAmount != null ? money(ride.chargedAmount) : t.paymentPending} /><MobileField label={t.difference} value={(() => { const difference = fareDifference(ride.price, ride.chargedAmount); return difference == null ? '—' : `${difference >= 0 ? '+' : '−'}${money(Math.abs(difference))}` })()} /><MobileField label={t.payment} value={ride.paymentMethod ? `${ride.paymentMethod} · ${ride.paymentStatus || 'pending'}` : (ride.paymentStatus || '—')} /></MobileRecordCard>)}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[1200px] text-left text-sm text-neutral-900 dark:text-white">
              <thead className="border-b border-neutral-200 bg-neutral-100 text-xs uppercase tracking-wide text-neutral-500 dark:border-[#26384D] dark:bg-[#122437] dark:text-[#AAB8CC]">
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
                  <th className="px-4 py-3">{t.when}</th>
                  <th className="px-4 py-3">{t.city}</th>
                  <th className="px-4 py-3">{t.rider}</th>
                  <th className="px-4 py-3">{t.driver}</th>
                  <th className="px-4 py-3">{t.pickupDestination}</th>
                  <th className="px-4 py-3">{t.completed}</th>
                  <th className="px-4 py-3 text-right">{t.bookedFare}</th>
                  <th className="px-4 py-3 text-right">{t.finalFare}</th>
                  <th className="px-4 py-3 text-right">{t.difference}</th>
                  <th className="px-4 py-3">{t.status}</th>
                  <th className="sticky right-0 z-20 bg-neutral-100 px-4 py-3">{t.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {!ridesLoading && filteredRides.length === 0 && (
                  <tr>
                    <td colSpan={12} className="px-4 py-8 text-center text-neutral-500">
                      {rides.length === 0
                        ? t.noRidesYet
                        : t.noRidesMatch}
                    </td>
                  </tr>
                )}
                {paginatedRides.map((r, idx) => (
                  <tr key={rowStableKey(r, idx)} className="bg-white hover:bg-neutral-100 dark:bg-[#0B1B2B] dark:hover:bg-[#122437]">
                    <td className="px-2 py-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-neutral-400 bg-white text-black border-neutral-400 focus:ring-black"
                        checked={selectedIds.includes(String(r._id))}
                        onChange={() => toggleSelect(r._id)}
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-neutral-500 dark:text-[#AAB8CC]">
                      {r.createdAt ? new Date(r.createdAt).toLocaleString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-neutral-600 dark:text-[#D3DCE8]">{r.city || '—'}</td>
                    <td className="px-4 py-3 text-neutral-600 dark:text-[#D3DCE8]">
                      {displayName(r.user?.name) || '—'}
                      <span className="block text-xs text-neutral-500 dark:text-[#8FA1BA]">{r.user?.phone || ''}</span>
                    </td>
                    <td className="px-4 py-3 text-neutral-600 dark:text-[#D3DCE8]">
                      {displayName(r.captain?.name) || '—'}
                      <span className="block text-xs text-neutral-500 dark:text-[#8FA1BA]">{r.captain?.vehicleNumber || r.captain?.phone || ''}</span>
                    </td>
                    <td className="max-w-xs px-4 py-3 text-neutral-600 dark:text-[#D3DCE8] dark:text-[#D3DCE8]">
                      <div className="line-clamp-2">{r.pickupLocation ?? '—'}</div>
                      <div className="text-neutral-400">→</div>
                      <div className="line-clamp-2">{r.dropLocation ?? '—'}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-neutral-600">
                      {r.completedAt ? new Date(r.completedAt).toLocaleString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium text-black">
                      {money(r.price)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium text-black">
                      {money(r.chargedAmount)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium">
                      {(() => {
                        const difference = fareDifference(r.price, r.chargedAmount)
                        return difference == null
                          ? '—'
                          : `${difference >= 0 ? '+' : '−'}${money(Math.abs(difference))}`
                      })()}
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
                          {t.view}
                        </button>
                        <button
                          type="button"
                          className="text-sm font-medium text-red-600 underline hover:text-red-800"
                          onClick={() => deleteRide(r._id)}
                        >
                          {t.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRides.length > ridesPageSize && (
            <div className="flex flex-col gap-3 border-t border-neutral-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-neutral-500">
                Showing {((ridesPage - 1) * ridesPageSize) + 1}–{Math.min(ridesPage * ridesPageSize, filteredRides.length)} of {filteredRides.length} rides
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRidesPage((page) => Math.max(1, page - 1))}
                  disabled={ridesPage === 1}
                  className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="min-w-[80px] text-center text-sm font-medium text-neutral-700">
                  Page {ridesPage} of {ridesPageCount}
                </span>

                <button
                  type="button"
                  onClick={() => setRidesPage((page) => Math.min(ridesPageCount, page + 1))}
                  disabled={ridesPage === ridesPageCount}
                  className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
          </>
        )}
      </div>

      <Modal
        open={Boolean(selectedRide)}
        onClose={() => onViewRide?.(null)}
        title={t.rideDetails}
        size="xl"
      >
        {selectedRide && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">{t.rideId}</p>
                <p className="mt-1 break-all text-sm font-semibold text-neutral-900">{selectedRide._id || '—'}</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">Status</p>
                <p className="mt-1 text-sm font-semibold capitalize text-neutral-900">{selectedRide.status || '—'}</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">{t.pickup}</p>
                <p className="mt-1 text-sm text-neutral-900">{selectedRide.pickupLocation || '—'}</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">{t.drop}</p>
                <p className="mt-1 text-sm text-neutral-900">{selectedRide.dropLocation || '—'}</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">{t.vehicle}</p>
                <p className="mt-1 text-sm text-neutral-900">{selectedRide.vehicleType || '—'}</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">{t.distance}</p>
                <p className="mt-1 text-sm text-neutral-900">
                  {selectedRide.distance != null ? `${selectedRide.distance} km` : '—'}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">{t.bookedFare}</p>
                <p className="mt-1 text-sm font-semibold text-neutral-900">
                  {selectedRide.price != null ? `₹${selectedRide.price}` : '—'}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">{t.chargedAmount}</p>
                <p className="mt-1 text-sm font-semibold text-neutral-900">
                  {selectedRide.chargedAmount != null ? `₹${selectedRide.chargedAmount}` : '—'}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">{t.payment}</p>
                <p className="mt-1 text-sm text-neutral-900">
                  {selectedRide.paymentMethod || '—'}
                  {selectedRide.paymentStatus ? ` · ${selectedRide.paymentStatus}` : ''}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">{t.passenger}</p>
                <p className="mt-1 text-sm text-neutral-900">{displayName(selectedRide.user?.name) || '—'}</p>
                <p className="text-xs text-neutral-500">{selectedRide.user?.phone || '—'}</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">{t.driver}</p>
                <p className="mt-1 text-sm text-neutral-900">{displayName(selectedRide.captain?.name) || t.unassigned}</p>
                <p className="text-xs text-neutral-500">
                  {selectedRide.captain?.phone || '—'}
                  {selectedRide.captain?.vehicleNumber ? ` · ${selectedRide.captain.vehicleNumber}` : ''}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">{t.created}</p>
                <p className="mt-1 text-sm text-neutral-900">
                  {selectedRide.createdAt ? new Date(selectedRide.createdAt).toLocaleString() : '—'}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-neutral-200 pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900">{t.paymentBreakdown}</h3>
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
                  <p className="text-xs text-neutral-500">{t.userPaid}</p>
                  <p className="mt-1 text-lg font-semibold text-neutral-900">
                    {selectedRide.chargedAmount != null
                      ? `₹${selectedRide.chargedAmount}`
                      : '—'}
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                  <p className="text-xs text-neutral-500">{t.driverGets}</p>
                  <p className="mt-1 text-lg font-semibold text-neutral-900">
                    {selectedRide.captainNetEarning != null
                      ? `₹${selectedRide.captainNetEarning}`
                      : '—'}
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                  <p className="text-xs text-neutral-500">{t.adminPlatformFee}</p>
                  <p className="mt-1 text-lg font-semibold text-neutral-900">
                    {selectedRide.platformFee != null
                      ? `₹${selectedRide.platformFee}`
                      : '—'}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs text-neutral-500">
                {t.payment}:
                <span className="ml-1 font-semibold text-neutral-700">
                  {selectedRide.paymentStatus || 'pending'}
                </span>
              </p>
            </div>

            <div className="border-t border-neutral-200 pt-5">
              <h3 className="text-sm font-semibold text-neutral-900">{t.assignmentSummary}</h3>

              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                  <p className="text-xs text-neutral-500">{t.currentDriver}</p>
                  <p className="mt-1 text-sm font-semibold text-neutral-900">
                    {displayName(selectedRide.captain?.name) || t.unassigned}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {selectedRide.captain?.phone || '—'}
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                  <p className="text-xs text-neutral-500">{t.vehicle}</p>
                  <p className="mt-1 text-sm font-semibold text-neutral-900">
                    {selectedRide.captain?.vehicleNumber || '—'}
                  </p>
                  <p className="mt-1 text-xs uppercase text-neutral-500">
                    {selectedRide.captain?.vehicleType || selectedRide.vehicleType || '—'}
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                  <p className="text-xs text-neutral-500">{t.currentRideState}</p>
                  <p className="mt-1 text-sm font-semibold capitalize text-neutral-900">
                    {selectedRide.status || '—'}
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                  <p className="text-xs text-neutral-500">{t.assignmentTime}</p>
                  <p className="mt-1 text-sm text-neutral-900">
                    {selectedRide.acceptedAt
                      ? new Date(selectedRide.acceptedAt).toLocaleString()
                      : t.notAssigned}
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                  <p className="text-xs text-neutral-500">{t.eta}</p>
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
                    {t.matchingAttempts}
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
                              {displayName(captain?.name) || t.driverUnavailable}
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
                            <p className="text-xs text-neutral-500">{t.offeredAt}</p>
                            <p className="mt-1 text-neutral-900">
                              {attempt.offeredAt
                                ? new Date(attempt.offeredAt).toLocaleString()
                                : '—'}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-neutral-500">{t.respondedAt}</p>
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
                <h3 className="text-sm font-semibold text-neutral-900">{t.assignmentTimeline}</h3>
                <button
                  type="button"
                  onClick={refreshRides}
                  disabled={ridesLoading}
                  className="inline-flex w-fit items-center rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {ridesLoading ? t.refreshing : t.refreshTimeline}
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {[
                  [t.rideCreated, selectedRide.createdAt, 'normal'],
                  [t.driverAccepted, selectedRide.acceptedAt, 'normal'],
                  [t.driverArrived, selectedRide.arrivedAt, 'normal'],
                  [t.pinVerified, selectedRide.otpVerifiedAt, 'success'],
                  [t.pinVerificationFailed, selectedRide.otpVerificationFailedAt, 'failed'],
                  [t.rideStarted, selectedRide.startedAt, 'success'],
                  [t.completed, selectedRide.completedAt, 'normal'],
                  [t.rideCancelled, selectedRide.cancelledAt, 'failed'],
                ]
                  .filter(([, value]) => value)
                  .map(([label, value, type], index, events) => (
                    <div key={`${label}-${index}`} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span
                          className={`mt-1 h-2.5 w-2.5 rounded-full ${
                            type === 'failed'
                              ? 'bg-red-500'
                              : type === 'success'
                                ? 'bg-emerald-500'
                                : 'bg-neutral-900'
                          }`}
                        />
                        {index < events.length - 1 && (
                          <span className="mt-1 h-full min-h-6 w-px bg-neutral-200" />
                        )}
                      </div>

                      <div className="pb-2">
                        <p className="text-sm font-semibold text-neutral-900">{label}</p>
                        <p className="mt-1 text-xs text-neutral-500">
                          {new Date(value).toLocaleString()}
                        </p>
                        {type === 'failed' && label === t.pinVerificationFailed && (
                          <p className="mt-1 text-xs font-medium text-red-600">
                            {selectedRide.otpVerificationFailureReason === 'expired_pin'
                              ? t.pinExpired
                              : t.invalidPin}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-5">
              <h3 className="text-sm font-semibold text-neutral-900">{t.changeAudit}</h3>

              {rideAuditLoading && (
                <p className="mt-3 text-sm text-neutral-500">{t.loadingAuditHistory}</p>
              )}

              {rideAuditError && (
                <p className="mt-3 text-sm text-red-600">{rideAuditError}</p>
              )}

              {!rideAuditLoading && !rideAuditError && rideAudit.length === 0 && (
                <p className="mt-3 text-sm text-neutral-500">
                  No ride changes have been recorded yet.
                </p>
              )}

              {!rideAuditLoading && rideAudit.length > 0 && (
                <div className="mt-4 space-y-3">
                  {rideAudit.map((entry, index) => (
                    <div
                      key={entry._id || `${entry.field}-${entry.createdAt}-${index}`}
                      className="rounded-xl border border-neutral-200 bg-neutral-50 p-3"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold capitalize text-neutral-900">
                            {String(entry.field || t.change).replace(/([A-Z])/g, ' $1')}
                          </p>
                          <p className="mt-1 text-xs text-neutral-500">
                            {t.actor} {entry.actorType || t.system}
                            {entry.actor ? ` · ${entry.actor}` : ''}
                          </p>
                        </div>

                        <p className="text-xs text-neutral-500">
                          {entry.createdAt
                            ? new Date(entry.createdAt).toLocaleString()
                            : '—'}
                        </p>
                      </div>

                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        <div className="rounded-lg bg-white p-2">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                            Old Value
                          </p>
                          <p className="mt-1 break-words text-xs text-neutral-900">
                            {entry.oldValue != null
                              ? typeof entry.oldValue === 'object'
                                ? JSON.stringify(entry.oldValue)
                                : String(entry.oldValue)
                              : '—'}
                          </p>
                        </div>

                        <div className="rounded-lg bg-white p-2">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                            New Value
                          </p>
                          <p className="mt-1 break-words text-xs text-neutral-900">
                            {entry.newValue != null
                              ? typeof entry.newValue === 'object'
                                ? JSON.stringify(entry.newValue)
                                : String(entry.newValue)
                              : '—'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                            Resulting Route
                          </p>
                          <p className="mt-1 text-xs text-neutral-700">
                            {entry.route?.pickup || '—'} → {entry.route?.drop || '—'}
                            {entry.route?.distance != null
                              ? ` · ${entry.route.distance} km`
                              : ''}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                            Resulting Fare
                          </p>
                          <p className="mt-1 text-xs text-neutral-700">
                            {entry.fare?.price != null
                              ? `Price ₹${entry.fare.price}`
                              : 'Price —'}
                            {entry.fare?.chargedAmount != null
                              ? ` · Charged ₹${entry.fare.chargedAmount}`
                              : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {(selectedRide.cancelledBy || selectedRide.cancellationReason ||
              selectedRide.cancellationFee != null) && (
              <div className="border-t border-neutral-200 pt-5">
                <h3 className="text-sm font-semibold text-neutral-900">{t.cancellation}</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-neutral-500">{t.cancelledBy}</p>
                    <p className="mt-1 text-sm capitalize text-neutral-900">{selectedRide.cancelledBy || '—'}</p>
                  </div>

                  <div>
                    <p className="text-xs text-neutral-500">{t.cancellationFee}</p>
                    <p className="mt-1 text-sm text-neutral-900">
                      {selectedRide.cancellationFee != null ? `₹${selectedRide.cancellationFee}` : '—'}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-xs text-neutral-500">{t.reason}</p>
                    <p className="mt-1 text-sm text-neutral-900">{selectedRide.cancellationReason || '—'}</p>
                  </div>
                </div>
              </div>
            )}

            {selectedRide && (
              <div className="border-t border-neutral-200 pt-5">
                <h3 className="text-sm font-semibold text-neutral-900">{t.ratings}</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-neutral-500">{t.passengerRating}</p>
                    <p className="mt-1 text-sm text-neutral-900">
                      {selectedRide.rating != null ? `${selectedRide.rating}/5` : t.notRated}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-neutral-500">{t.driverRating}</p>
                    <p className="mt-1 text-sm text-neutral-900">
                      {selectedRide.captainPassengerRating != null
                        ? `${selectedRide.captainPassengerRating}/5`
                        : t.notRated}
                    </p>
                  </div>

                  {selectedRide.ratingComment && (
                    <div className="sm:col-span-2">
                      <p className="text-xs text-neutral-500">{t.comment}</p>
                      <p className="mt-1 text-sm text-neutral-900">{selectedRide.ratingComment}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-neutral-500">{t.compliments}</p>
                    <p className="mt-1 text-sm text-neutral-900">
                      {Array.isArray(selectedRide.compliments) && selectedRide.compliments.length > 0
                        ? selectedRide.compliments.join(', ')
                        : t.none}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-neutral-500">{t.tip}</p>
                    <p className="mt-1 text-sm text-neutral-900">
                      ₹{Number(selectedRide.tipAmount || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
