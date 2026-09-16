import React from 'react'
import { rowStableKey, paymentStatusClass } from '../adminUtils'
import MobileRecordCard, { MobileField } from '../../components/MobileRecordCard'

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
  deleteRide,
  bulkDeletePayments,
  onViewPayment,
  selectedPayment,
  paymentDetailLoading,
  onClosePayment,
}) {
  const formatDate = (value) => {
    if (!value) return '—'
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString()
  }

  const formatAmount = (value) => {
    if (value == null || value === '') return '—'

    const number = Number(value)

    if (Number.isNaN(number)) return '—'

    return `₹${number.toFixed(2)}`
  }

  const rideLabel = (payment) => {
    const ride = payment.ride
    if (!ride) return payment.rideId ? String(payment.rideId) : '—'

    const pickup = ride.pickupLocation || ''
    const drop = ride.dropLocation || ''

    if (pickup || drop) {
      return `${pickup || '—'} → ${drop || '—'}`
    }

    return ride._id ? String(ride._id) : '—'
  }

  const payerLabel = (payment) => {
    const payer = payment.payer
    if (!payer) return '—'

    return payer.name || payer.phone || payer.email || String(payer._id || '—')
  }

  const driverLabel = (payment) => {
    const driver = payment.driver
    if (!driver) return '—'

    return driver.name || driver.phone || driver.email || String(driver._id || '—')
  }

  const reconciliationClass = (result) => {
    if (result === 'MATCHED') {
      return 'bg-green-100 text-green-800 border-green-200'
    }

    if (result === 'MISMATCH') {
      return 'bg-red-100 text-red-800 border-red-300'
    }

    return 'bg-yellow-100 text-yellow-800 border-yellow-200'
  }

  const settlementClass = (status) => {
    if (status === 'SETTLED') {
      return 'bg-green-100 text-green-800'
    }

    if (status === 'PENDING') {
      return 'bg-yellow-100 text-yellow-800'
    }

    return 'bg-neutral-100 text-neutral-700'
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl">
      <div className="border-b border-neutral-200 px-4 py-3">
        <p className="text-sm font-semibold text-neutral-900">
          Payment Reconciliation
        </p>

        <p className="mt-1 text-xs text-neutral-500">
          Compare expected and paid amounts, driver settlement status and reconciliation results.
        </p>
      </div>

      {paymentsLoading ? (
        <div className="p-12 text-center text-neutral-600">
          Loading transactions…
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 border-b border-neutral-200 px-3 py-3 sm:px-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <input
              type="search"
              placeholder="Search ride, driver, customer, amount, status…"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="w-full max-w-full sm:max-w-md rounded-lg border border-neutral-300 bg-white text-black px-3 py-2 text-sm placeholder:text-neutral-500 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />

            {selectedIds.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-neutral-600">
                  {selectedIds.length} selected
                </span>

                <button
                  type="button"
                  onClick={clearSelection}
                  className="text-xs text-neutral-600 hover:text-black"
                >
                  Clear
                </button>

                <button
                  type="button"
                  onClick={bulkDeletePayments}
                  className="rounded-lg border border-black bg-black px-2 py-1.5 sm:px-3 text-xs font-medium text-white hover:bg-neutral-800"
                >
                  Delete selected
                </button>
              </div>
            )}
          </div>

          {/* Mobile */}
          <div className="space-y-3 p-3 md:hidden">
            {filteredPayments.length === 0 && (
              <div className="py-8 text-center text-sm text-neutral-500">
                {payments.length === 0
                  ? 'No payment transactions yet.'
                  : 'No transactions match your search.'}
              </div>
            )}

            {filteredPayments.map((payment, index) => (
              <div
                key={rowStableKey(payment, index)}
                className={
                  payment.reconciliationResult === 'MISMATCH'
                    ? 'rounded-xl border-2 border-red-300 bg-red-50'
                    : ''
                }
              >
                <MobileRecordCard
                  title={formatAmount(payment.paidAmount ?? payment.amount)}
                  subtitle={formatDate(payment.createdAt)}
                  badge={
                    <div className="flex flex-wrap gap-1">
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-semibold ${paymentStatusClass(payment.paymentStatus)}`}
                      >
                        {payment.paymentStatus || '—'}
                      </span>

                      <span
                        className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${reconciliationClass(payment.reconciliationResult)}`}
                      >
                        {payment.reconciliationResult || '—'}
                      </span>
                    </div>
                  }
                  checked={selectedIds.includes(String(payment._id))}
                  onCheck={() => toggleSelect(payment._id)}
                  actions={
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onViewPayment(payment._id)}
                        className="rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white"
                      >
                        View Details
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteRide(payment._id)}
                        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-[#DC2626]"
                      >
                        Delete
                      </button>
                    </div>
                  }
                >
                  <MobileField
                    label="Ride"
                    value={payment.rideId || payment.ride?._id || '—'}
                  />

                  <MobileField
                    label="Ride Route"
                    value={rideLabel(payment)}
                  />

                  <MobileField
                    label="Customer"
                    value={payerLabel(payment)}
                  />

                  <MobileField
                    label="Driver"
                    value={driverLabel(payment)}
                  />

                  <MobileField
                    label="Expected Amount"
                    value={formatAmount(payment.expectedAmount)}
                  />

                  <MobileField
                    label="Paid Amount"
                    value={formatAmount(payment.paidAmount ?? payment.amount)}
                  />

                  <MobileField
                    label="Payment Status"
                    value={payment.paymentStatus || '—'}
                  />

                  <MobileField
                    label="Settlement"
                    value={payment.settlementStatus || '—'}
                  />

                  <MobileField
                    label="Reconciliation"
                    value={payment.reconciliationResult || '—'}
                  />

                  <MobileField
                    label="Driver Earning"
                    value={formatAmount(payment.driverEarning)}
                  />

                  <MobileField
                    label="Platform Fee"
                    value={formatAmount(payment.platformFee)}
                  />

                  <MobileField
                    label="Method"
                    value={payment.paymentMode}
                  />

                  <MobileField
                    label="Provider Ref"
                    value={payment.providerReference}
                  />

                  <MobileField
                    label="Created"
                    value={formatDate(payment.createdAt)}
                  />
                </MobileRecordCard>
              </div>
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[2100px] text-left text-sm text-neutral-900">
              <thead className="border-b border-neutral-200 bg-neutral-100 text-xs uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="w-10 px-2 py-3">
                    <input
                      ref={tableHeaderSelectRef}
                      type="checkbox"
                      className="h-4 w-4 rounded border-neutral-400 bg-white text-black focus:ring-black"
                      checked={
                        filteredPayments.length > 0 &&
                        filteredPayments.every((p) =>
                          selectedIds.includes(String(p._id))
                        )
                      }
                      onChange={(e) =>
                        e.target.checked
                          ? selectAllVisible(filteredPayments)
                          : clearSelection()
                      }
                    />
                  </th>

                  <th className="px-4 py-3">Transaction</th>
                  <th className="px-4 py-3">Ride</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Driver</th>
                  <th className="px-4 py-3 text-right">Expected</th>
                  <th className="px-4 py-3 text-right">Paid</th>
                  <th className="px-4 py-3">Payment Status</th>
                  <th className="px-4 py-3">Settlement</th>
                  <th className="px-4 py-3">Reconciliation</th>
                  <th className="px-4 py-3 text-right">Driver Earning</th>
                  <th className="px-4 py-3 text-right">Platform Fee</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Provider Reference</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-200">
                {filteredPayments.length === 0 && (
                  <tr>
                    <td
                      colSpan={16}
                      className="px-4 py-8 text-center text-neutral-500"
                    >
                      {payments.length === 0
                        ? 'No payment transactions yet.'
                        : 'No transactions match your search.'}
                    </td>
                  </tr>
                )}

                {filteredPayments.map((payment, index) => {
                  const isMismatch =
                    payment.reconciliationResult === 'MISMATCH'

                  return (
                    <tr
                      key={rowStableKey(payment, index)}
                      className={
                        isMismatch
                          ? 'bg-red-50 hover:bg-red-100'
                          : 'hover:bg-neutral-100'
                      }
                    >
                      <td className="px-2 py-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-neutral-400 bg-white text-black focus:ring-black"
                          checked={selectedIds.includes(String(payment._id))}
                          onChange={() => toggleSelect(payment._id)}
                        />
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-medium">
                          {String(payment._id)}
                        </div>

                        <div className="mt-1 text-xs text-neutral-500">
                          {payment.paymentType || 'ride_fare'}
                        </div>
                      </td>

                      <td className="max-w-[240px] px-4 py-3">
                        <div className="truncate text-xs">
                          {rideLabel(payment)}
                        </div>

                        <div className="mt-1 font-mono text-[10px] text-neutral-500">
                          {payment.rideId
                            ? String(payment.rideId)
                            : payment.ride?._id
                              ? String(payment.ride._id)
                              : 'No ride'}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="text-sm">
                          {payerLabel(payment)}
                        </div>

                        {payment.payer?.phone && (
                          <div className="mt-1 text-xs text-neutral-500">
                            {payment.payer.phone}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="text-sm">
                          {driverLabel(payment)}
                        </div>

                        {payment.driver?.phone && (
                          <div className="mt-1 text-xs text-neutral-500">
                            {payment.driver.phone}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right font-semibold tabular-nums">
                        {formatAmount(payment.expectedAmount)}
                      </td>

                      <td className="px-4 py-3 text-right font-semibold tabular-nums">
                        {formatAmount(payment.paidAmount ?? payment.amount)}
                      </td>

                      <td
                        className={`px-4 py-3 text-sm font-medium ${paymentStatusClass(payment.paymentStatus)}`}
                      >
                        {payment.paymentStatus || '—'}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${settlementClass(payment.settlementStatus)}`}
                        >
                          {payment.settlementStatus || '—'}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${reconciliationClass(payment.reconciliationResult)}`}
                        >
                          {payment.reconciliationResult || '—'}
                        </span>

                        {isMismatch && (
                          <div className="mt-1 text-[10px] font-semibold text-red-700">
                            Amount mismatch
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right tabular-nums">
                        {formatAmount(payment.driverEarning)}
                      </td>

                      <td className="px-4 py-3 text-right tabular-nums">
                        {formatAmount(payment.platformFee)}
                      </td>

                      <td className="px-4 py-3 text-neutral-600">
                        {payment.paymentMode || '—'}
                      </td>

                      <td className="max-w-[220px] px-4 py-3">
                        <span className="break-all font-mono text-xs text-neutral-600">
                          {payment.providerReference || '—'}
                        </span>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap text-xs text-neutral-500">
                        {formatDate(payment.createdAt)}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            className="text-sm font-medium text-black underline hover:text-neutral-600"
                            onClick={() => onViewPayment(payment._id)}
                          >
                            View Details
                          </button>

                          <button
                            type="button"
                            className="text-sm font-medium text-neutral-600 underline hover:text-black"
                            onClick={() => deleteRide(payment._id)}
                          >
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

      {/* Payment Details */}
      {selectedPayment && (
        <div className="border-t border-neutral-200 bg-neutral-50 p-4 sm:p-6">
          <div className="mx-auto max-w-6xl rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4 sm:px-6">
              <div>
                <h3 className="text-base font-semibold text-neutral-900">
                  Reconciliation Details
                </h3>

                <p className="mt-1 text-xs text-neutral-500">
                  Payment, settlement and reconciliation information
                </p>
              </div>

              <button
                type="button"
                onClick={onClosePayment}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
              >
                Close
              </button>
            </div>

            {paymentDetailLoading ? (
              <div className="p-8 text-center text-sm text-neutral-600">
                Loading transaction details…
              </div>
            ) : (
              <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 sm:p-6">
                <div>
                  <p className="text-xs text-neutral-500">Transaction ID</p>
                  <p className="mt-1 break-all font-mono text-sm text-neutral-900">
                    {selectedPayment._id || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-neutral-500">Ride</p>
                  <p className="mt-1 break-all text-sm text-neutral-900">
                    {selectedPayment.rideId?._id ||
                      selectedPayment.rideId ||
                      '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-neutral-500">Customer</p>
                  <p className="mt-1 text-sm text-neutral-900">
                    {selectedPayment.payer?.name ||
                      selectedPayment.payer?.phone ||
                      selectedPayment.payer?.email ||
                      '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-neutral-500">Driver</p>
                  <p className="mt-1 text-sm text-neutral-900">
                    {driverLabel(selectedPayment)}
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                  <p className="text-xs text-neutral-500">
                    Expected Amount
                  </p>
                  <p className="mt-1 text-lg font-semibold text-neutral-900">
                    {formatAmount(selectedPayment.expectedAmount)}
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                  <p className="text-xs text-neutral-500">
                    Paid Amount
                  </p>
                  <p className="mt-1 text-lg font-semibold text-neutral-900">
                    {formatAmount(
                      selectedPayment.paidAmount ??
                        selectedPayment.amount
                    )}
                  </p>
                </div>

                <div
                  className={`rounded-xl border p-3 ${
                    selectedPayment.reconciliationResult === 'MISMATCH'
                      ? 'border-red-300 bg-red-50'
                      : 'border-neutral-200 bg-neutral-50'
                  }`}
                >
                  <p className="text-xs text-neutral-500">
                    Reconciliation Result
                  </p>

                  <p
                    className={`mt-1 text-sm font-bold ${
                      selectedPayment.reconciliationResult === 'MISMATCH'
                        ? 'text-red-700'
                        : selectedPayment.reconciliationResult === 'MATCHED'
                          ? 'text-green-700'
                          : 'text-yellow-700'
                    }`}
                  >
                    {selectedPayment.reconciliationResult || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-neutral-500">
                    Payment Status
                  </p>

                  <p
                    className={`mt-1 text-sm font-semibold ${paymentStatusClass(selectedPayment.paymentStatus)}`}
                  >
                    {selectedPayment.paymentStatus || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-neutral-500">
                    Settlement Status
                  </p>

                  <p
                    className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${settlementClass(selectedPayment.settlementStatus)}`}
                  >
                    {selectedPayment.settlementStatus || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-neutral-500">
                    Driver Earning
                  </p>

                  <p className="mt-1 text-sm font-semibold text-neutral-900">
                    {formatAmount(selectedPayment.driverEarning)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-neutral-500">
                    Platform Fee
                  </p>

                  <p className="mt-1 text-sm font-semibold text-neutral-900">
                    {formatAmount(selectedPayment.platformFee)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-neutral-500">
                    Payment Method
                  </p>

                  <p className="mt-1 text-sm text-neutral-900">
                    {selectedPayment.paymentMode || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-neutral-500">
                    Payment Type
                  </p>

                  <p className="mt-1 text-sm text-neutral-900">
                    {selectedPayment.paymentType || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-neutral-500">
                    Provider Reference
                  </p>

                  <p className="mt-1 break-all font-mono text-xs text-neutral-900">
                    {selectedPayment.providerReference || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-neutral-500">
                    Webhook Event ID
                  </p>

                  <p className="mt-1 break-all font-mono text-xs text-neutral-900">
                    {selectedPayment.webhookEventId || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-neutral-500">
                    Created At
                  </p>

                  <p className="mt-1 text-sm text-neutral-900">
                    {formatDate(selectedPayment.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-neutral-500">
                    Updated At
                  </p>

                  <p className="mt-1 text-sm text-neutral-900">
                    {formatDate(selectedPayment.updatedAt)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
