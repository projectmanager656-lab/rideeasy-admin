import React from 'react'
import { displayName, rowStableKey } from '../adminUtils'
import { Card } from '../../components/AdminUIComponents'

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
  const approvedCount = drivers.filter((driver) => driver.approved).length
  const pendingCount = drivers.filter((driver) => !driver.approved).length
  const blockedCount = drivers.filter((driver) => driver.blocked).length

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-6">

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B86B00]">
              Platform
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#111827]">
              Drivers
            </h2>

            <p className="mt-1 text-sm text-[#6B7280]">
              Manage driver approvals, vehicles and account status.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            <div className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] px-3 py-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#EAF4FF] text-[#2563EB]">
                <i className="ri-steering-2-line" />
              </div>

              <div>
                <p className="text-[11px] text-[#6B7280]">
                  Total
                </p>
                <p className="font-bold text-[#111827]">
                  {drivers.length}
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

          </div>
        </div>

        {/* Search + Actions */}
        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center">

          <div className="relative flex-1">
            <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-base text-[#6B7280]" />

            <input
              type="search"
              placeholder="Search by driver name, email, vehicle or city…"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="w-full rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] py-2.5 pl-11 pr-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all focus:border-[#FFB21C] focus:ring-2 focus:ring-[#FFB21C]/20"
            />
          </div>

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
                onClick={bulkDeleteDrivers}
                className="inline-flex items-center gap-2 rounded-xl bg-[#EF4444] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#DC2626]"
              >
                <i className="ri-delete-bin-line" />
                Delete ({selectedIds.length})
              </button>

            </div>
          )}
        </div>
      </div>

      {/* Driver Table */}
      <Card className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-0 shadow-sm">

        <div className="flex flex-col justify-between gap-2 border-b border-[#E5E7EB] px-5 py-4 sm:flex-row sm:items-center">

          <div>
            <h3 className="font-bold text-[#111827]">
              All Drivers
            </h3>

            <p className="mt-0.5 text-xs text-[#6B7280]">
              {filteredDrivers.length} driver
              {filteredDrivers.length === 1 ? '' : 's'} shown
            </p>
          </div>

          {blockedCount > 0 && (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-[#DC2626]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444]" />
              {blockedCount} blocked
            </span>
          )}

        </div>

        {driversLoading ? (

          /* Loading */
          <div className="flex min-h-[360px] flex-col items-center justify-center p-12 text-center">

            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FFF4DF] text-[#FFB21C]">
              <i className="ri-loader-4-line animate-spin text-2xl" />
            </div>

            <p className="mt-4 text-sm font-medium text-[#6B7280]">
              Loading drivers…
            </p>

          </div>

        ) : filteredDrivers.length === 0 ? (

          /* Empty */
          <div className="flex min-h-[360px] flex-col items-center justify-center p-12 text-center">

            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#F7F9FC] text-[#9CA3AF]">
              <i className="ri-steering-2-line text-2xl" />
            </div>

            <h3 className="mt-4 font-bold text-[#111827]">
              No drivers found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-[#6B7280]">
              {tableSearch
                ? 'No drivers match your current search.'
                : 'There are currently no registered drivers.'}
            </p>

          </div>

        ) : (

          /* Table */
          <div className="overflow-x-auto">

            <table className="w-full min-w-[950px] text-left text-sm">

              <thead className="border-b border-[#E5E7EB] bg-[#F7F9FC]">
                <tr>

                  <th className="w-12 px-5 py-3.5">
                    <input
                      ref={tableHeaderSelectRef}
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#FFB21C]"
                      checked={
                        filteredDrivers.length > 0 &&
                        filteredDrivers.every((d) =>
                          selectedIds.includes(String(d._id))
                        )
                      }
                      onChange={(e) =>
                        e.target.checked
                          ? selectAllVisible(filteredDrivers)
                          : clearSelection()
                      }
                    />
                  </th>

                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    Driver
                  </th>

                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    Email
                  </th>

                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    Vehicle
                  </th>

                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    City
                  </th>

                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    Approval
                  </th>

                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    Account
                  </th>

                  <th className="px-4 py-3.5 text-right text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-[#E5E7EB]">

                {filteredDrivers.map((d, idx) => {

                  const approved = Boolean(d.approved)
                  const blocked = Boolean(d.blocked)

                  return (
                    <tr
                      key={rowStableKey(d, idx)}
                      className="transition-colors hover:bg-[#FFFCF5]"
                    >

                      {/* Checkbox */}
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#FFB21C]"
                          checked={selectedIds.includes(String(d._id))}
                          onChange={() => toggleSelect(d._id)}
                        />
                      </td>

                      {/* Driver */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">

                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#0B1B2B] text-sm font-bold text-white">
                            {String(displayName(d.name) || 'D')
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-[#111827]">
                              {displayName(d.name) || 'Unnamed Driver'}
                            </p>

                            <p className="text-xs text-[#9CA3AF]">
                              Driver
                            </p>
                          </div>

                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-4">
                        <span className="text-sm text-[#6B7280]">
                          {d.email || '—'}
                        </span>
                      </td>

                      {/* Vehicle */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">

                          <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#FFF4DF] text-[#B86B00]">
                            <i className="ri-car-2-line" />
                          </div>

                          <span className="rounded-lg bg-[#FFF9E8] px-2.5 py-1 text-xs font-bold text-[#B86B00]">
                            {d.vehicleType || 'N/A'}
                          </span>

                        </div>
                      </td>

                      {/* City */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
                          <i className="ri-map-pin-line text-[#9CA3AF]" />
                          {d.city || '—'}
                        </div>
                      </td>

                      {/* Approval */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                            approved
                              ? 'bg-[#EAFBF2] text-[#16A34A]'
                              : 'bg-[#FFF4DF] text-[#B86B00]'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              approved
                                ? 'bg-[#22C55E]'
                                : 'bg-[#F59E0B]'
                            }`}
                          />

                          {approved ? 'Approved' : 'Pending'}
                        </span>
                      </td>

                      {/* Account */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                            blocked
                              ? 'bg-red-50 text-[#DC2626]'
                              : 'bg-[#EAFBF2] text-[#16A34A]'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              blocked
                                ? 'bg-[#EF4444]'
                                : 'bg-[#22C55E]'
                            }`}
                          />

                          {blocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap items-center justify-end gap-2">

                          {!approved ? (
                            <button
                              type="button"
                              onClick={() => approveDriver(d._id)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#EAFBF2] px-3 py-2 text-xs font-semibold text-[#16A34A] transition hover:bg-[#DCFCE7]"
                              title="Approve driver"
                            >
                              <i className="ri-check-line" />
                              Approve
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => rejectDriver(d._id)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#FFF4DF] px-3 py-2 text-xs font-semibold text-[#B86B00] transition hover:bg-[#FFE9B8]"
                              title="Revoke approval"
                            >
                              <i className="ri-close-line" />
                              Revoke
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              toggleDriverBlock(d._id, !blocked)
                            }
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                              blocked
                                ? 'bg-[#EAFBF2] text-[#16A34A] hover:bg-[#DCFCE7]'
                                : 'bg-[#FFF4DF] text-[#B86B00] hover:bg-[#FFE9B8]'
                            }`}
                            title={
                              blocked
                                ? 'Unblock driver'
                                : 'Block driver'
                            }
                          >
                            <i
                              className={
                                blocked
                                  ? 'ri-lock-unlock-line'
                                  : 'ri-forbid-line'
                              }
                            />

                            {blocked ? 'Unblock' : 'Block'}
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteDriver(d._id)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-[#DC2626] transition hover:bg-red-100"
                            title="Delete driver"
                          >
                            <i className="ri-delete-bin-line" />
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
        )}

      </Card>
    </div>
  )
}
