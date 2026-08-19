import React from 'react'
import { rowStableKey, paymentStatusClass } from '../adminUtils'
import { Card, AlertCard } from '../../components/AdminUIComponents'

export default function PaymentsTab ({
  paymentsLoading,
  filteredPayments,
  payments,
  tableSearch,
  setTableSearch,
  selectedIds,
  toggleSelect,
  selectAllVisible,
  clearSelection,
  tableHeaderSelectRef,
}) {
  return (
    <div className="space-y-4">
      {/* Info Alert */}
      <AlertCard
        type="info"
        title="Payment Records"
        message="Completed ride settlements and payment history from ride records."
      />

      {/* Search and Actions Bar */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0">
            <input
              type="search"
              placeholder="🔍 Search ride id, summary, amount, status…"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 bg-white text-neutral-900 px-4 py-2 text-sm placeholder:text-neutral-500 focus:border-[#FFA726] focus:outline-none focus:ring-1 focus:ring-[#FFA726]"
            />
          </div>
          {selectedIds.length > 0 && <button type="button" onClick={clearSelection} className="text-sm font-medium text-neutral-600 hover:text-neutral-900">Clear selection</button>}
        </div>
      </Card>

      {/* Payments Table */}
      <Card className="p-0 overflow-hidden">
        {paymentsLoading ? (
          <div className="p-12 text-center text-neutral-600">
            <i className="ri-loader-4-line animate-spin text-2xl text-[#FFA726] block mb-2"></i>
            Loading payments…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-100 border-b border-neutral-200 sticky top-0">
                <tr>
                  <th className="w-10 px-4 py-3">
                    <input
                      ref={tableHeaderSelectRef}
                      type="checkbox"
                      className="h-4 w-4 rounded border-neutral-400 cursor-pointer"
                      checked={filteredPayments.length > 0 && filteredPayments.every((p) => selectedIds.includes(String(p._id)))}
                      onChange={(e) => (e.target.checked ? selectAllVisible(filteredPayments) : clearSelection())}
                    />
                  </th>
                  <th className="px-4 py-3 font-semibold text-neutral-900">Completed</th>
                  <th className="px-4 py-3 font-semibold text-neutral-900">Ride Summary</th>
                  <th className="px-4 py-3 font-semibold text-neutral-900 text-right">Charged ₹</th>
                  <th className="px-4 py-3 font-semibold text-neutral-900 text-right">Driver ₹</th>
                  <th className="px-4 py-3 font-semibold text-neutral-900 text-right">Platform ₹</th>
                  <th className="px-4 py-3 font-semibold text-neutral-900">Method</th>
                  <th className="px-4 py-3 font-semibold text-neutral-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredPayments.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-neutral-500">
                      {payments.length === 0 ? '📭 No completed payments yet.' : '🔍 No rows match your search.'}
                    </td>
                  </tr>
                )}
                {filteredPayments.map((p, idx) => (
                  <tr key={rowStableKey(p, idx)} className="hover:bg-[#FFF3E0] transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-neutral-400 cursor-pointer"
                        checked={selectedIds.includes(String(p._id))}
                        onChange={() => toggleSelect(p._id)}
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-neutral-600 text-xs sm:text-sm">
                      {p.completedAt ? new Date(p.completedAt).toLocaleString() : (p.createdAt ? new Date(p.createdAt).toLocaleString() : '—')}
                    </td>
                    <td className="max-w-xs px-4 py-3 text-xs sm:text-sm text-neutral-600">
                      <div className="line-clamp-2">{p.summary || p.city || '—'}</div>
                      <div className="mt-1 font-mono text-[10px] text-neutral-500">{String(p._id)}</div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium text-neutral-900 text-xs sm:text-sm">₹{p.amount ?? '—'}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-neutral-600 text-xs sm:text-sm">{p.captainNetEarning != null ? `₹${p.captainNetEarning}` : '—'}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-neutral-600 text-xs sm:text-sm">{p.platformFee != null ? `₹${p.platformFee}` : '—'}</td>
                    <td className="px-4 py-3 text-neutral-600 text-xs sm:text-sm">{p.paymentMode || '—'}</td>
                    <td className={`px-4 py-3 text-xs sm:text-sm font-medium ${paymentStatusClass(p.paymentStatus)}`}>
                      {p.paymentStatus || '—'}
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
