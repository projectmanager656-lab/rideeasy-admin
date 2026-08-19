import React from 'react'
import { displayName, rowStableKey } from '../adminUtils'

export default function DriversTab ({
  driversLoading,
  filteredDrivers,
  drivers,
  tableSearch,
  setTableSearch,
  selectedIds,
  toggleSelect,
  selectAllVisible,
  clearSelection,
  tableHeaderSelectRef,
  approveDriver,
  rejectDriver,
  toggleDriverBlock,
  deleteDriver,
  bulkDeleteDrivers,
}) {
<<<<<<< Updated upstream
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl">
      <p className="border-b border-neutral-200 px-4 py-2 text-xs text-neutral-500">Approve new drivers or revoke approval. Use Block for abuse.</p>
      {driversLoading ? (
        <div className="p-12 text-center text-neutral-600">Loading drivers…</div>
      ) : (
        <>
          <div className="flex flex-col gap-3 border-b border-neutral-200 px-3 py-3 sm:px-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
=======
  const approvedCount = drivers.filter((driver) => driver.approved).length
  const pendingCount = drivers.filter((driver) => !driver.approved).length
  const blockedCount = drivers.filter((driver) => driver.blocked).length
  const offlineCount = drivers.filter((driver) => driver.approved && !driver.blocked && driver.online === false).length
  const activeCount = drivers.filter((driver) => driver.approved && !driver.blocked && driver.online !== false).length

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-6">

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#111827]">
              Drivers
            </h2>

            <p className="mt-1 text-sm text-[#6B7280]">
              Manage driver approvals, vehicles and account status.
            </p>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2 xl:grid-cols-4">

            <div className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] px-3 py-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#EAF4FF] text-[#2563EB]">
                <i className="ri-steering-2-line" />
              </div>

              <div>
                <p className="text-[11px] text-[#6B7280]">
                  Active
                </p>
                <p className="font-bold text-[#111827]">
                  {activeCount}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] px-3 py-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#EAFBF2] text-[#16A34A]">
                <i className="ri-checkbox-circle-line" />
              </div>

              <div>
                <p className="text-[11px] text-[#6B7280]">
                  Approved
                </p>
                <p className="font-bold text-[#111827]">
                  {approvedCount}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] px-3 py-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#FFF4DF] text-[#B86B00]">
                <i className="ri-time-line" />
              </div>

              <div>
                <p className="text-[11px] text-[#6B7280]">
                  Pending
                </p>
                <p className="font-bold text-[#111827]">
                  {pendingCount}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] px-3 py-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#F1F5F9] text-[#64748B]">
                <i className="ri-user-off-line" />
              </div>

              <div>
                <p className="text-[11px] text-[#6B7280]">
                  Offline
                </p>
                <p className="font-bold text-[#111827]">
                  {offlineCount}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Search + Actions */}
        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center">

          <div className="relative flex-1">
            <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-base text-[#6B7280]" />

>>>>>>> Stashed changes
            <input
              type="search"
              placeholder="Search driver, email, vehicle, city…"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="w-full max-w-full sm:max-w-md rounded-lg border border-neutral-300 bg-white text-black px-3 py-2 text-sm placeholder:text-neutral-500 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
            {selectedIds.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-neutral-600">{selectedIds.length} selected</span>
                <button type="button" onClick={clearSelection} className="text-xs text-neutral-600 hover:text-black">Clear</button>
                <button type="button" onClick={bulkDeleteDrivers} className="rounded-lg border border-black bg-black px-2 py-1.5 sm:px-3 text-xs font-medium text-white hover:bg-neutral-800">Delete selected</button>
              </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] sm:min-w-[1040px] text-left text-sm text-neutral-900">
              <thead className="border-b border-neutral-200 bg-neutral-100 text-xs uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="w-10 px-2 py-3">
                    <input
                      ref={tableHeaderSelectRef}
                      type="checkbox"
                      className="h-4 w-4 rounded border-neutral-400 bg-white text-black border-neutral-400 focus:ring-black"
                      checked={filteredDrivers.length > 0 && filteredDrivers.every((d) => selectedIds.includes(String(d._id)))}
                      onChange={(e) => (e.target.checked ? selectAllVisible(filteredDrivers) : clearSelection())}
                    />
                  </th>
                  <th className="px-4 py-3">Driver</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">City / Vehicle</th>
                  <th className="px-4 py-3">Subscription</th>
                  <th className="px-4 py-3 text-right">Rides</th>
                  <th className="px-4 py-3 text-right">Income ₹</th>
                  <th className="px-4 py-3">Flags</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredDrivers.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-neutral-500">
                      {drivers.length === 0 ? 'No drivers yet.' : 'No drivers match your search.'}
                    </td>
                  </tr>
                )}
                {filteredDrivers.map((d, idx) => {
                  const subStatus = d.effectiveSubscriptionStatus || d.subscriptionStatus
                  return (
                    <tr key={rowStableKey(d, idx)} className="hover:bg-neutral-100">
                      <td className="px-2 py-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-neutral-400 bg-white text-black border-neutral-400 focus:ring-black"
                          checked={selectedIds.includes(String(d._id))}
                          onChange={() => toggleSelect(d._id)}
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-black">{displayName(d.name) || '—'}</td>
                      <td className="px-4 py-3 text-neutral-600">{d.email}</td>
                      <td className="px-4 py-3 text-neutral-600">
                        {d.city || '—'}
                        <span className="block text-xs text-neutral-500">{d.vehicleType} {d.vehicleNumber}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          subStatus === 'active' ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-800'
                        }`}
                        >
                          {subStatus || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-neutral-700">{d.completedRides ?? 0}</td>
                      <td className="px-4 py-3 text-right tabular-nums font-medium text-black">{d.driverIncome ?? 0}</td>
                      <td className="px-4 py-3 text-xs text-neutral-600">
                        {d.approved ? <span className="text-black font-medium">Approved</span> : <span className="text-neutral-600">Pending</span>}
                        {d.blocked ? <span className="ml-2 text-neutral-600 border border-black/20 rounded px-1">Blocked</span> : null}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          {!d.approved && (
                            <button type="button" onClick={() => approveDriver(d._id)} className="text-left text-sm font-medium text-black underline decoration-neutral-400 hover:decoration-black">
                              Approve
                            </button>
                          )}
                          {d.approved && (
                            <button type="button" onClick={() => rejectDriver(d._id)} className="text-left text-sm font-medium text-neutral-700 underline hover:text-black">
                              Reject
                            </button>
                          )}
                          <button type="button" onClick={() => toggleDriverBlock(d._id, !d.blocked)} className="text-left text-sm text-neutral-600 hover:text-black">
                            {d.blocked ? 'Unblock' : 'Block'}
                          </button>
                          <button type="button" onClick={() => deleteDriver(d._id)} className="text-left text-sm font-medium text-neutral-600 underline hover:text-black">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
