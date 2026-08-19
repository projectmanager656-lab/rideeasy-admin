import React from 'react'
import { displayName, rowStableKey } from '../adminUtils'
import { Card } from '../../components/AdminUIComponents'

export default function UsersTab ({
  usersLoading,
  filteredUsers,
  users,
  tableSearch,
  setTableSearch,
  selectedIds,
  toggleSelect,
  selectAllVisible,
  clearSelection,
  tableHeaderSelectRef,
  toggleUserBlock,
  deleteUser,
  bulkDeleteUsers,
}) {
  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col gap-5 rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-6">

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B86B00]">
              Platform
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#111827]">
              Users
            </h2>

            <p className="mt-1 text-sm text-[#6B7280]">
              Manage registered RideEasy passengers.
            </p>
          </div>

          <div className="flex items-center gap-2">

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFF4DF] text-[#B86B00]">
              <i className="ri-user-3-line text-lg" />
            </div>

            <div>
              <p className="text-xs text-[#6B7280]">
                Total users
              </p>

              <p className="text-lg font-bold text-[#111827]">
                {users.length.toLocaleString('en-IN')}
              </p>
            </div>

          </div>
        </div>

        {/* Search + Bulk Actions */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

          <div className="relative flex-1">
            <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-base text-[#6B7280]" />

            <input
              type="search"
              placeholder="Search by name, email, phone or city…"
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
                onClick={bulkDeleteUsers}
                className="inline-flex items-center gap-2 rounded-xl bg-[#EF4444] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#DC2626]"
              >
                <i className="ri-delete-bin-line" />
                Delete ({selectedIds.length})
              </button>

            </div>
          )}
        </div>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-0 shadow-sm">

        {/* Table Header */}
        <div className="flex flex-col justify-between gap-2 border-b border-[#E5E7EB] px-5 py-4 sm:flex-row sm:items-center">

          <div>
            <h3 className="font-bold text-[#111827]">
              All Users
            </h3>

            <p className="mt-0.5 text-xs text-[#6B7280]">
              {filteredUsers.length} user
              {filteredUsers.length === 1 ? '' : 's'} shown
            </p>
          </div>

          {selectedIds.length === 0 && filteredUsers.length > 0 && (
            <span className="text-xs text-[#9CA3AF]">
              Select users to perform bulk actions
            </span>
          )}

        </div>

        {usersLoading ? (

          /* Loading */
          <div className="flex min-h-[360px] flex-col items-center justify-center p-12 text-center">

            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FFF4DF] text-[#FFB21C]">
              <i className="ri-loader-4-line animate-spin text-2xl" />
            </div>

            <p className="mt-4 text-sm font-medium text-[#6B7280]">
              Loading users…
            </p>

          </div>

        ) : filteredUsers.length === 0 ? (

          /* Empty */
          <div className="flex min-h-[360px] flex-col items-center justify-center p-12 text-center">

            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#F7F9FC] text-[#9CA3AF]">
              <i className="ri-user-search-line text-2xl" />
            </div>

            <h3 className="mt-4 font-bold text-[#111827]">
              No users found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-[#6B7280]">
              {tableSearch
                ? 'No users match your current search.'
                : 'There are currently no registered users.'}
            </p>

          </div>

        ) : (

          /* Table */
          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px] text-left text-sm">

              <thead className="border-b border-[#E5E7EB] bg-[#F7F9FC]">
                <tr>

                  <th className="w-12 px-5 py-3.5">
                    <input
                      ref={tableHeaderSelectRef}
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#FFB21C]"
                      checked={
                        filteredUsers.length > 0 &&
                        filteredUsers.every((u) =>
                          selectedIds.includes(String(u._id))
                        )
                      }
                      onChange={(e) =>
                        e.target.checked
                          ? selectAllVisible(filteredUsers)
                          : clearSelection()
                      }
                    />
                  </th>

                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    User
                  </th>

                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    Email
                  </th>

                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    Phone
                  </th>

                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    City
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

                {filteredUsers.map((u, idx) => {

                  const blocked = Boolean(u.blocked)

                  return (
                    <tr
                      key={rowStableKey(u, idx)}
                      className="transition-colors hover:bg-[#FFFCF5]"
                    >

                      {/* Checkbox */}
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#FFB21C]"
                          checked={selectedIds.includes(String(u._id))}
                          onChange={() => toggleSelect(u._id)}
                        />
                      </td>

                      {/* User */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">

                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#0B1B2B] text-xs font-bold text-white">
                            {String(displayName(u.name) || 'U')
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-[#111827]">
                              {displayName(u.name) || 'Unnamed User'}
                            </p>

                            <p className="text-xs text-[#9CA3AF]">
                              Passenger
                            </p>
                          </div>

                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-4">
                        <span className="text-sm text-[#6B7280]">
                          {u.email || '—'}
                        </span>
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-4">
                        <span className="text-sm text-[#6B7280]">
                          {u.phone || '—'}
                        </span>
                      </td>

                      {/* City */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
                          <i className="ri-map-pin-line text-[#9CA3AF]" />
                          {u.city || '—'}
                        </div>
                      </td>

                      {/* Status */}
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
                        <div className="flex items-center justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              toggleUserBlock(u._id, !blocked)
                            }
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                              blocked
                                ? 'bg-[#EAFBF2] text-[#16A34A] hover:bg-[#DCFCE7]'
                                : 'bg-[#FFF4DF] text-[#B86B00] hover:bg-[#FFE9B8]'
                            }`}
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
                            onClick={() => deleteUser(u._id)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-[#DC2626] transition hover:bg-red-100"
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
