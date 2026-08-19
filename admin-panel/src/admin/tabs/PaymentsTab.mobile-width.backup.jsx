import React from 'react'
import { rowStableKey, paymentStatusClass } from '../adminUtils'
import { Card } from '../../components/AdminUIComponents'

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
  const totalAmount = payments.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0
  )

  const totalDriverEarnings = payments.reduce(
    (sum, payment) => sum + Number(payment.captainNetEarning || 0),
    0
  )

  const totalPlatformFee = payments.reduce(
    (sum, payment) => sum + Number(payment.platformFee || 0),
    0
  )

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-6">

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B86B00]">
              Finance
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#111827]">
              Payments
            </h2>

            <p className="mt-1 text-sm text-[#6B7280]">
              Review completed ride settlements and payment history.
            </p>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">

            <div className="rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] px-4 py-3">
              <p className="text-[11px] text-[#6B7280]">
                Total Charged
              </p>

              <p className="mt-0.5 font-bold text-[#111827]">
                ₹{totalAmount.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] px-4 py-3">
              <p className="text-[11px] text-[#6B7280]">
                Driver Earnings
              </p>

              <p className="mt-0.5 font-bold text-[#16A34A]">
                ₹{totalDriverEarnings.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] px-4 py-3">
              <p className="text-[11px] text-[#6B7280]">
                Platform Fees
              </p>

              <p className="mt-0.5 font-bold text-[#B86B00]">
                ₹{totalPlatformFee.toLocaleString('en-IN')}
              </p>
            </div>

          </div>
        </div>

        {/* Search */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">

          <div className="relative flex-1">

            <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-base text-[#6B7280]" />

            <input
              type="search"
              placeholder="Search ride ID, summary, amount, method or status…"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="w-full rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] py-2.5 pl-11 pr-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all focus:border-[#FFB21C] focus:ring-2 focus:ring-[#FFB21C]/20"
            />

          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">

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

            </div>
          )}

        </div>
      </div>

      {/* Payments Table */}
      <Card className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-0 shadow-sm">

        {/* Table heading */}
        <div className="flex flex-col justify-between gap-2 border-b border-[#E5E7EB] px-5 py-4 sm:flex-row sm:items-center">

          <div>
            <h3 className="font-bold text-[#111827]">
              Payment History
            </h3>

            <p className="mt-0.5 text-xs text-[#6B7280]">
              {filteredPayments.length} payment
              {filteredPayments.length === 1 ? '' : 's'} shown
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
            <i className="ri-shield-check-line" />
            Completed ride settlements
          </div>

        </div>

        {paymentsLoading ? (

          /* Loading */
          <div className="flex min-h-[360px] flex-col items-center justify-center p-12 text-center">

            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FFF4DF] text-[#FFB21C]">
              <i className="ri-loader-4-line animate-spin text-2xl" />
            </div>

            <p className="mt-4 text-sm font-medium text-[#6B7280]">
              Loading payments…
            </p>

          </div>

        ) : filteredPayments.length === 0 ? (

          /* Empty */
          <div className="flex min-h-[360px] flex-col items-center justify-center p-12 text-center">

            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#F7F9FC] text-[#9CA3AF]">
              <i className="ri-wallet-3-line text-2xl" />
            </div>

            <h3 className="mt-4 font-bold text-[#111827]">
              No payments found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-[#6B7280]">
              {payments.length === 0
                ? 'No completed payments are available yet.'
                : 'No payment records match your current search.'}
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1050px] text-left text-sm">

              <thead className="border-b border-[#E5E7EB] bg-[#F7F9FC]">

                <tr>

                  <th className="w-12 px-5 py-3.5">
                    <input
                      ref={tableHeaderSelectRef}
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#FFB21C]"
                      checked={
                        filteredPayments.length > 0 &&
                        filteredPayments.every((payment) =>
                          selectedIds.includes(String(payment._id))
                        )
                      }
                      onChange={(e) =>
                        e.target.checked
                          ? selectAllVisible(filteredPayments)
                          : clearSelection()
                      }
                    />
                  </th>

                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    Completed
                  </th>

                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    Ride
                  </th>

                  <th className="px-4 py-3.5 text-right text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    Charged
                  </th>

                  <th className="px-4 py-3.5 text-right text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    Driver
                  </th>

                  <th className="px-4 py-3.5 text-right text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    Platform
                  </th>

                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    Method
                  </th>

                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-[#E5E7EB]">

                {filteredPayments.map((payment, idx) => (

                  <tr
                    key={rowStableKey(payment, idx)}
                    className="transition-colors hover:bg-[#FFFCF5]"
                  >

                    {/* Checkbox */}
                    <td className="px-5 py-4">

                      <input
                        type="checkbox"
                        className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#FFB21C]"
                        checked={selectedIds.includes(String(payment._id))}
                        onChange={() => toggleSelect(payment._id)}
                      />

                    </td>

                    {/* Completed */}
                    <td className="whitespace-nowrap px-4 py-4">

                      <div className="flex items-center gap-2">

                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#EAFBF2] text-[#16A34A]">
                          <i className="ri-check-line" />
                        </div>

                        <div>

                          <p className="text-sm font-medium text-[#111827]">
                            {payment.completedAt
                              ? new Date(
                                  payment.completedAt
                                ).toLocaleDateString('en-IN')
                              : payment.createdAt
                                ? new Date(
                                    payment.createdAt
                                  ).toLocaleDateString('en-IN')
                                : '—'}
                          </p>

                          <p className="text-xs text-[#9CA3AF]">
                            {payment.completedAt
                              ? new Date(
                                  payment.completedAt
                                ).toLocaleTimeString('en-IN', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : ''}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Ride */}
                    <td className="max-w-xs px-4 py-4">

                      <div className="flex items-start gap-2.5">

                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#FFF4DF] text-[#B86B00]">
                          <i className="ri-road-map-line" />
                        </div>

                        <div className="min-w-0">

                          <p className="line-clamp-2 text-sm font-semibold text-[#111827]">
                            {payment.summary ||
                              payment.city ||
                              'Ride payment'}
                          </p>

                          <p className="mt-1 truncate font-mono text-[10px] text-[#9CA3AF]">
                            {String(payment._id)}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Charged */}
                    <td className="px-4 py-4 text-right">

                      <p className="font-bold tabular-nums text-[#111827]">
                        ₹{payment.amount ?? '—'}
                      </p>

                    </td>

                    {/* Driver */}
                    <td className="px-4 py-4 text-right">

                      <p className="font-semibold tabular-nums text-[#16A34A]">
                        {payment.captainNetEarning != null
                          ? `₹${payment.captainNetEarning}`
                          : '—'}
                      </p>

                    </td>

                    {/* Platform */}
                    <td className="px-4 py-4 text-right">

                      <p className="font-semibold tabular-nums text-[#B86B00]">
                        {payment.platformFee != null
                          ? `₹${payment.platformFee}`
                          : '—'}
                      </p>

                    </td>

                    {/* Method */}
                    <td className="px-4 py-4">

                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F7F9FC] px-2.5 py-1.5 text-xs font-semibold text-[#6B7280]">
                        <i className="ri-bank-card-line" />
                        {payment.paymentMode || '—'}
                      </span>

                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${paymentStatusClass(
                          payment.paymentStatus
                        )}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {payment.paymentStatus || 'Unknown'}
                      </span>

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
