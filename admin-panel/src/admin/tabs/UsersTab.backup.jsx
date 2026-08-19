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
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#111827] sm:text-xl">Users Management</h2>
            <p className="text-sm text-[#6B7280]">Total: {users.length} users</p>
          </div>
          {selectedIds.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FFA726]/10 px-3 py-1 text-sm font-semibold text-[#FFA726]">
              <i className="ri-checkbox-circle-line"></i>
              {selectedIds.length} selected
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"></i>
            <input
              type="search"
              placeholder="Search by name, email, phone, city…"
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
                onClick={bulkDeleteUsers} 
                className="rounded-lg bg-[#E5484D] px-3 py-2 text-sm font-medium text-white hover:bg-[#D73A43] transition-colors"
              >
                Delete ({selectedIds.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Users Table */}
      <Card className="p-0 overflow-hidden">
        {usersLoading ? (
          <div className="p-12 text-center">
            <i className="ri-loader-4-line animate-spin text-2xl text-[#FFA726] mb-2 block"></i>
            <p className="text-sm text-[#6B7280]">Loading users…</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <i className="ri-user-line text-4xl text-[#6B7280]/30 mb-2 block"></i>
            <p className="text-sm text-[#6B7280]">{tableSearch ? 'No users match your search.' : 'No users found.'}</p>
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
                      checked={filteredUsers.length > 0 && filteredUsers.every((u) => selectedIds.includes(String(u._id)))}
                      onChange={(e) => (e.target.checked ? selectAllVisible(filteredUsers) : clearSelection())}
                    />
                  </th>
                  <th className="px-4 py-3 font-semibold text-[#111827]">Name</th>
                  <th className="px-4 py-3 font-semibold text-[#111827]">Email</th>
                  <th className="px-4 py-3 font-semibold text-[#111827]">Phone</th>
                  <th className="px-4 py-3 font-semibold text-[#111827]">City</th>
                  <th className="px-4 py-3 font-semibold text-[#111827]">Status</th>
                  <th className="px-4 py-3 font-semibold text-[#111827]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.map((u, idx) => (
                  <tr key={rowStableKey(u, idx)} className="hover:bg-[#FFF8F0] transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 cursor-pointer"
                        checked={selectedIds.includes(String(u._id))}
                        onChange={() => toggleSelect(u._id)}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-[#111827]">{displayName(u.name) || '—'}</td>
                    <td className="px-4 py-3 text-[#6B7280] text-xs sm:text-sm">{u.email}</td>
                    <td className="px-4 py-3 text-[#6B7280] text-xs sm:text-sm">{u.phone}</td>
                    <td className="px-4 py-3 text-[#6B7280] text-xs sm:text-sm">{u.city || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        u.blocked 
                          ? 'bg-[#FEECEC] text-[#E5484D]' 
                          : 'bg-[#EAFBF2] text-[#1FAA59]'
                      }`}>
                        {u.blocked ? '🚫 Blocked' : '✅ Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          className="text-xs sm:text-sm font-medium px-2 py-1 rounded text-[#FFA726] hover:bg-[#FFF3E0] transition-colors"
                          onClick={() => toggleUserBlock(u._id, !u.blocked)}
                        >
                          {u.blocked ? 'Unblock' : 'Block'}
                        </button>
                        <button
                          type="button"
                          className="text-xs sm:text-sm font-medium px-2 py-1 rounded text-[#E5484D] hover:bg-[#FEE2E2] transition-colors"
                          onClick={() => deleteUser(u._id)}
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
        )}
      </Card>
    </div>
  )
}
