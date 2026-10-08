import React from 'react'
import { rowStableKey, paymentStatusClass } from '../adminUtils'
import MobileRecordCard, { MobileField } from '../../components/MobileRecordCard'
import { useAdminLanguage } from '../../context/AdminLanguageContext'

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
  const { t } = useAdminLanguage()
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
      return 'bg-[var(--color-success-soft)] text-[var(--color-success)] border-[var(--color-success)]'
    }

    if (result === 'MISMATCH') {
      return 'bg-[var(--color-danger-soft)] text-[var(--color-danger)] border-[var(--color-danger)]'
    }

    return 'bg-[var(--color-warning-soft)] text-[var(--color-warning)] border-[var(--color-warning)]'
  }

  const settlementClass = (status) => {
    if (status === 'SETTLED') {
      return 'bg-[var(--color-success-soft)] text-[var(--color-success)] border border-[var(--color-success)]'
    }

    if (status === 'PENDING') {
      return 'bg-[var(--color-warning-soft)] text-[var(--color-warning)] border border-[var(--color-warning)]'
    }

    return 'bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
  }

  return (
    <div className="space-y-4">
      <div className="px-1">
        <p className="text-sm font-medium text-[#7183A0]">{t.finance}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
          {t.paymentReconciliation}
        </h1>
        <p className="mt-2 text-base text-[#7183A0]">
          {t.paymentReconciliationSubtitle}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl">
      {paymentsLoading ? (
        <div className="p-12 text-center text-[var(--color-text-secondary)]">
          Loading transactions…
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 border-b border-[var(--color-border)] px-3 py-3 sm:px-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <input
              type="search"
              placeholder={t.searchPayments}
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="w-full max-w-full sm:max-w-md rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text-primary)] px-3 py-2 text-sm placeholder:text-[var(--color-text-muted)] focus:border-[#F5A900] focus:outline-none focus:ring-1 focus:ring-[#F5A900]"
            />

            {selectedIds.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-[var(--color-text-secondary)]">
                  {selectedIds.length} selected
                </span>

                <button
                  type="button"
                  onClick={clearSelection}
                  className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  Clear
                </button>

                <button
                  type="button"
                  onClick={bulkDeletePayments}
                  className="rounded-lg border border-[#F5A900] bg-[#F5A900] px-2 py-1.5 sm:px-3 text-xs font-medium text-[#17243A] hover:bg-[#FFB91F]"
                >
                  Delete selected
                </button>
              </div>
            )}
          </div>

          {/* Mobile */}
          <div className="space-y-3 p-3 md:hidden">
            {filteredPayments.length === 0 && (
              <div className="py-8 text-center text-sm text-[var(--color-text-muted)]">
                {payments.length === 0
                  ? t.noPaymentTransactions
                  : t.noTransactionsMatch}
              </div>
            )}

            {filteredPayments.map((payment, index) => (
              <div
                key={rowStableKey(payment, index)}
                className={
                  payment.reconciliationResult === 'MISMATCH'
                    ? 'rounded-xl border-2 border-[var(--color-danger)] bg-[var(--color-danger-soft)]'
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
                        onClick={() => onViewPayment(payment)}
                        className="rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white"
                      >
                        View Details
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteRide(payment._id)}
                        className="rounded-lg border border-[var(--color-danger)] bg-[var(--color-danger-soft)] px-3 py-2 text-xs font-semibold text-[var(--color-danger)]"
                      >
                        Delete
                      </button>
                    </div>
                  }
                >
                  <MobileField
                    label={t.ride}
                    value={payment.rideId || payment.ride?._id || '—'}
                  />

                  <MobileField
                    label={t.rideRoute}
                    value={rideLabel(payment)}
                  />

                  <MobileField
                    label={t.customer}
                    value={payerLabel(payment)}
                  />

                  <MobileField
                    label={t.driver}
                    value={driverLabel(payment)}
                  />

                  <MobileField
                    label={t.expectedAmount}
                    value={formatAmount(payment.expectedAmount)}
                  />

                  <MobileField
                    label={t.paidAmount}
                    value={formatAmount(payment.paidAmount ?? payment.amount)}
                  />

                  <MobileField
                    label={t.paymentStatus}
                    value={payment.paymentStatus || '—'}
                  />

                  <MobileField
                    label={t.settlement}
                    value={payment.settlementStatus || '—'}
                  />

                  <MobileField
                    label={t.reconciliation}
                    value={payment.reconciliationResult || '—'}
                  />

                  <MobileField
                    label={t.driverEarning}
                    value={formatAmount(payment.driverEarning)}
                  />

                  <MobileField
                    label={t.platformFee}
                    value={formatAmount(payment.platformFee)}
                  />

                  <MobileField
                    label={t.method}
                    value={payment.paymentMode}
                  />

                  <MobileField
                    label={t.providerReference}
                    value={payment.providerReference}
                  />

                  <MobileField
                    label={t.createdAt}
                    value={formatDate(payment.createdAt)}
                  />
                </MobileRecordCard>
              </div>
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[2100px] text-left text-sm text-[var(--color-text-primary)]">
              <thead className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)] text-xs uppercase tracking-wide text-[var(--color-text-secondary)]">
                <tr>
                  <th className="w-10 px-2 py-3">
                    <input
                      ref={tableHeaderSelectRef}
                      type="checkbox"
                      className="h-4 w-4 rounded border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[#F5A900] focus:ring-[#F5A900]"
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

                  <th className="px-4 py-3">{t.transaction}</th>
                  <th className="px-4 py-3">{t.ride}</th>
                  <th className="px-4 py-3">{t.customer}</th>
                  <th className="px-4 py-3">{t.driver}</th>
                  <th className="px-4 py-3 text-right">{t.expectedAmount}</th>
                  <th className="px-4 py-3 text-right">{t.paidAmount}</th>
                  <th className="px-4 py-3">{t.paymentStatus}</th>
                  <th className="px-4 py-3">{t.settlement}</th>
                  <th className="px-4 py-3">{t.reconciliation}</th>
                  <th className="px-4 py-3 text-right">{t.driverEarning}</th>
                  <th className="px-4 py-3 text-right">{t.platformFee}</th>
                  <th className="px-4 py-3">{t.method}</th>
                  <th className="px-4 py-3">{t.providerReference}</th>
                  <th className="px-4 py-3">{t.createdAt}</th>
                  <th className="px-4 py-3">{t.action}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--color-border)]">
                {filteredPayments.length === 0 && (
                  <tr>
                    <td
                      colSpan={16}
                      className="px-4 py-8 text-center text-[var(--color-text-muted)]"
                    >
                      {payments.length === 0
                        ? t.noPaymentTransactions
                        : t.noTransactionsMatch}
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
                          ? 'bg-[var(--color-danger-soft)] text-[var(--color-text-primary)] hover:bg-[var(--color-danger-soft)]'
                          : 'bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)]'
                      }
                    >
                      <td className="px-2 py-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[#F5A900] focus:ring-[#F5A900]"
                          checked={selectedIds.includes(String(payment._id))}
                          onChange={() => toggleSelect(payment._id)}
                        />
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-medium">
                          {String(payment._id)}
                        </div>

                        <div className="mt-1 text-xs text-[var(--color-text-muted)]">
                          {payment.paymentType || 'ride_fare'}
                        </div>
                      </td>

                      <td className="max-w-[240px] px-4 py-3">
                        <div className="truncate text-xs">
                          {rideLabel(payment)}
                        </div>

                        <div className="mt-1 font-mono text-[10px] text-[var(--color-text-muted)]">
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
                          <div className="mt-1 text-xs text-[var(--color-text-muted)]">
                            {payment.payer.phone}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="text-sm">
                          {driverLabel(payment)}
                        </div>

                        {payment.driver?.phone && (
                          <div className="mt-1 text-xs text-[var(--color-text-muted)]">
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

                      <td className="px-4 py-3 text-sm font-medium">
                        <span
                          className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${paymentStatusClass(payment.paymentStatus)}`}
                        >
                          {payment.paymentStatus || '—'}
                        </span>
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
                          <div className="mt-1 text-[10px] font-semibold text-[var(--color-danger)]">
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

                      <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                        {payment.paymentMode || '—'}
                      </td>

                      <td className="max-w-[220px] px-4 py-3">
                        <span className="break-all font-mono text-xs text-[var(--color-text-secondary)]">
                          {payment.providerReference || '—'}
                        </span>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap text-xs text-[var(--color-text-muted)]">
                        {formatDate(payment.createdAt)}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            className="text-sm font-medium text-[var(--color-text-primary)] underline hover:text-[var(--color-text-secondary)]"
                            onClick={() => onViewPayment(payment)}
                          >
                            View Details
                          </button>

                          <button
                            type="button"
                            className="text-sm font-medium text-[var(--color-text-secondary)] underline hover:text-[var(--color-text-primary)]"
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
        <div
          id="payment-details"
          className="border-t border-[var(--color-border)] bg-[var(--color-background)] p-4 sm:p-6"
        >
          <div className="mx-auto max-w-6xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-4 sm:px-6">
              <div>
                <h3 className="text-base font-semibold text-[var(--color-text-primary)]">{t.reconciliationDetails}</h3>

                <p className="mt-1 text-xs text-[var(--color-text-muted)]">{t.paymentSettlementReconciliationInfo}</p>
              </div>

              <button
                type="button"
                onClick={onClosePayment}
                className="rounded-lg border border-[var(--color-border-strong)] px-3 py-2 text-xs font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)]"
              >{t.close}</button>
            </div>

            {paymentDetailLoading ? (
              <div className="p-8 text-center text-sm text-[var(--color-text-secondary)]">
                Loading transaction details…
              </div>
            ) : (
              <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 sm:p-6">
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">{t.transactionId}</p>
                  <p className="mt-1 break-all font-mono text-sm text-[var(--color-text-primary)]">
                    {selectedPayment._id || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">{t.ride}</p>
                  <p className="mt-1 break-all text-sm text-[var(--color-text-primary)]">
                    {selectedPayment.rideId?._id ||
                      selectedPayment.rideId ||
                      '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">{t.customer}</p>
                  <p className="mt-1 text-sm text-[var(--color-text-primary)]">
                    {selectedPayment.payer?.name ||
                      selectedPayment.payer?.phone ||
                      selectedPayment.payer?.email ||
                      '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">{t.driver}</p>
                  <p className="mt-1 text-sm text-[var(--color-text-primary)]">
                    {driverLabel(selectedPayment)}
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3">
                  <p className="text-xs text-[var(--color-text-muted)]">{t.expectedAmount}</p>
                  <p className="mt-1 text-lg font-semibold text-[var(--color-text-primary)]">
                    {formatAmount(selectedPayment.expectedAmount)}
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3">
                  <p className="text-xs text-[var(--color-text-muted)]">{t.paidAmount}</p>
                  <p className="mt-1 text-lg font-semibold text-[var(--color-text-primary)]">
                    {formatAmount(
                      selectedPayment.paidAmount ??
                        selectedPayment.amount
                    )}
                  </p>
                </div>

                <div
                  className={`rounded-xl border p-3 ${
                    selectedPayment.reconciliationResult === 'MISMATCH'
                      ? 'border-[var(--color-danger)] bg-[var(--color-danger-soft)]'
                      : 'border-[var(--color-border)] bg-[var(--color-surface-muted)]'
                  }`}
                >
                  <p className="text-xs text-[var(--color-text-muted)]">{t.reconciliation}</p>

                  <p
                    className={`mt-1 text-sm font-bold ${
                      selectedPayment.reconciliationResult === 'MISMATCH'
                        ? 'text-[var(--color-danger)]'
                        : selectedPayment.reconciliationResult === 'MATCHED'
                          ? 'text-[var(--color-success)]'
                          : 'text-[var(--color-warning)]'
                    }`}
                  >
                    {selectedPayment.reconciliationResult || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">{t.paymentStatus}</p>

                  <p
                    className={`mt-1 text-sm font-semibold ${paymentStatusClass(selectedPayment.paymentStatus)}`}
                  >
                    {selectedPayment.paymentStatus || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">{t.settlementStatus}</p>

                  <p
                    className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${settlementClass(selectedPayment.settlementStatus)}`}
                  >
                    {selectedPayment.settlementStatus || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">{t.driverEarning}</p>

                  <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
                    {formatAmount(selectedPayment.driverEarning)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">{t.platformFee}</p>

                  <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
                    {formatAmount(selectedPayment.platformFee)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">{t.paymentMethod}</p>

                  <p className="mt-1 text-sm text-[var(--color-text-primary)]">
                    {selectedPayment.paymentMode || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">{t.paymentType}</p>

                  <p className="mt-1 text-sm text-[var(--color-text-primary)]">
                    {selectedPayment.paymentType || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">{t.providerReference}</p>

                  <p className="mt-1 break-all font-mono text-xs text-[var(--color-text-primary)]">
                    {selectedPayment.providerReference || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">{t.webhookEventId}</p>

                  <p className="mt-1 break-all font-mono text-xs text-[var(--color-text-primary)]">
                    {selectedPayment.webhookEventId || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">{t.createdAt}</p>

                  <p className="mt-1 text-sm text-[var(--color-text-primary)]">
                    {formatDate(selectedPayment.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">{t.updatedAt}</p>

                  <p className="mt-1 text-sm text-[var(--color-text-primary)]">
                    {formatDate(selectedPayment.updatedAt)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
      </div>
    )
}
