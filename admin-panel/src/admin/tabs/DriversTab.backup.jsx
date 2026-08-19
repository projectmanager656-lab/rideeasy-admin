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
  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#111827] sm:text-xl">Drivers Management</h2>
            <p className="text-sm text-[#6B7280]">Total: {drivers.length} drivers</p>
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
              placeholder="Search by driver name, email, vehicle, city…"
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
                onClick={bulkDeleteDrivers} 
                className="rounded-lg bg-[#E5484D] px-3 py-2 text-sm font-medium text-white hover:bg-[#D73A43] transition-colors"
              >
                Delete ({selectedIds.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Drivers Table */}
      <Card className="p-0 overflow-hidden">
        {driversLoading ? (
          <div className="p-12 text-center">
            <i className="ri-loader-4-line animate-spin text-2xl text-[#FFA726] mb-2 block"></i>
            <p className="text-sm text-[#6B7280]">Loading drivers…</p>
          </div>
        ) : filteredDrivers.length === 0 ? (
          <div className="p-12 text-center">
            <i className="ri-car-line text-4xl text-[#6B7280]/30 mb-2 block"></i>
            <p className="text-sm text-[#6B7280]">{tableSearch ? 'No drivers match your search.' : 'No drivers found.'}</p>
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
                      checked={filteredDrivers.length > 0 && filteredDrivers.every((d) => selectedIds.includes(String(d._id)))}
                      onChange={(e) => (e.target.checked ? selectAllVisible(filteredDrivers) : clearSelection())}
                    />
                  </th>
                  <th className="px-4 py-3 font-semibold text-[#111827]">Driver</th>
                  <th className="px-4 py-3 font-semibold text-[#111827]">Email</th>
                  <th className="px-4 py-3 font-semibold text-[#111827]">Vehicle</th>
                  <th className="px-4 py-3 font-semibold text-[#111827]">City</th>
                  <th className="px-4 py-3 font-semibold text-[#111827]">Status</th>
                  <th className="px-4 py-3 font-semibold text-[#111827]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredDrivers.map((d, idx) => (
                  <tr key={rowStableKey(d, idx)} className="hover:bg-[#FFF8F0] transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 cursor-pointer"
                        checked={selectedIds.includes(String(d._id))}
                        onChange={() => toggleSelect(d._id)}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-[#111827]">{displayName(d.name) || '—'}</td>
                    <td className="px-4 py-3 text-[#6B7280] text-xs sm:text-sm">{d.email}</td>
                    <td className="px-4 py-3 text-[#6B7280] text-xs sm:text-sm">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF3E0] px-2 py-0.5 text-xs font-semibold text-[#FFA726]">
                        <i className="ri-car-2-line"></i>
                        {d.vehicleType || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#6B7280] text-xs sm:text-sm">{d.city || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        d.approved
                          ? 'bg-[#EAFBF2] text-[#1FAA59]'
                          : 'bg-[#FFF3E0] text-[#B8860B]'
                      }`}>
                        {d.approved ? '✅ Approved' : '⏳ Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 flex-wrap">
                        {!d.approved ? (
                          <button 
                            type="button" 
                            onClick={() => approveDriver(d._id)} 
                            className="text-xs font-medium px-2 py-1 rounded text-[#1FAA59] hover:bg-[#EAFBF2] transition-colors"
                            title="Approve driver"
                          >
                            Approve
                          </button>
                        ) : (
                          <button 
                            type="button" 
                            onClick={() => rejectDriver(d._id)} 
                            className="text-xs font-medium px-2 py-1 rounded text-[#FFA726] hover:bg-[#FFF3E0] transition-colors"
                            title="Revoke approval"
                          >
                            Revoke
                          </button>
                        )}
                        <button 
                          type="button" 
                          onClick={() => toggleDriverBlock(d._id, !d.blocked)} 
                          className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
                            d.blocked 
                              ? 'text-[#1FAA59] hover:bg-[#EAFBF2]' 
                              : 'text-[#FFA726] hover:bg-[#FFF3E0]'
                          }`}
                          title={d.blocked ? 'Unblock driver' : 'Block driver'}
                        >
                          {d.blocked ? 'Unblock' : 'Block'}
                        </button>
                        <button 
                          type="button" 
                          onClick={() => deleteDriver(d._id)} 
                          className="text-xs font-medium px-2 py-1 rounded text-[#E5484D] hover:bg-[#FEECEC] transition-colors"
                          title="Delete driver"
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
