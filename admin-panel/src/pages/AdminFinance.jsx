import React, { useMemo, useState } from 'react'

export default function AdminFinance ({
  payments = [],
  paymentsLoading = false,
}) {
  const [search, setSearch] = useState('')
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  const formatDate = (value) => {
    if (!value) return '—'

    const date = new Date(value)

    return Number.isNaN(date.getTime())
      ? '—'
      : date.toLocaleString()
  }

  const formatAmount = (value) => {
    if (value == null || value === '') return '—'

    const number = Number(value)

    if (Number.isNaN(number)) return '—'

    return `₹${number.toFixed(2)}`
  }

  const getRideId = (payment) => {
    if (payment.rideId?._id) return String(payment.rideId._id)
    if (payment.rideId) return String(payment.rideId)
    if (payment.ride?._id) return String(payment.ride._id)

    return '—'
  }

  const getCustomer = (payment) => {
    const payer = payment.payer

    if (!payer) return '—'

    return (
      payer.name ||
      payer.phone ||
      payer.email ||
      String(payer._id || '—')
    )
  }

  const getInvoiceTotal = (payment) => {
    /*
     * The backend reconciliation contract treats chargedAmount
     * as the authoritative expected amount when available.
     *
     * The Admin payments API exposes that value as expectedAmount.
     */
    if (payment.expectedAmount != null) {
      return Number(payment.expectedAmount)
    }

    if (payment.ride?.chargedAmount != null) {
      return Number(payment.ride.chargedAmount)
    }

    if (payment.chargedAmount != null) {
      return Number(payment.chargedAmount)
    }

    return null
  }

  const invoices = useMemo(() => {
    return payments
      .filter((payment) => {
        /*
         * Invoices are generated from ride-fare payment records.
         * Subscription/referral/other payment records are not ride invoices.
         */
        return (payment.paymentType || 'ride_fare') === 'ride_fare'
      })
      .map((payment, index) => ({
        ...payment,
        invoiceNumber: `INV-${String(index + 1).padStart(6, '0')}`,
        rideIdLabel: getRideId(payment),
        customerLabel: getCustomer(payment),
        invoiceTotal: getInvoiceTotal(payment),
      }))
  }, [payments])

  const filteredInvoices = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) return invoices

    return invoices.filter((invoice) => {
      const values = [
        invoice.invoiceNumber,
        invoice.rideIdLabel,
        invoice.customerLabel,
        invoice.paymentMode,
        invoice.paymentStatus,
        invoice.paymentType,
        invoice.providerReference,
        invoice.invoiceTotal,
      ]

      return values.some((value) =>
        String(value ?? '').toLowerCase().includes(query)
      )
    })
  }, [invoices, search])

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#718096]">
          Admin
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#152238] sm:text-3xl">
          Invoices
        </h1>

        <p className="mt-1 text-sm text-[#718096]">
          View ride invoices, fare totals and linked payment information.
        </p>
      </div>

      {selectedInvoice && (
        <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-4">
            <div>
              <h2 className="font-semibold text-[#152238]">
                Invoice Detail
              </h2>
              <p className="mt-1 text-xs text-[#718096]">
                {selectedInvoice.invoiceNumber}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedInvoice(null)}
              className="rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm font-medium text-[#152238] hover:bg-[#F8FAFC]"
            >
              Close
            </button>
          </div>

          <div className="grid gap-6 p-5 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-[#152238]">
                Invoice Information
              </h3>

              <div className="mt-3 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-[#718096]">Invoice</span>
                  <span className="font-medium">
                    {selectedInvoice.invoiceNumber}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[#718096]">Ride ID</span>
                  <span className="break-all text-right font-medium">
                    {selectedInvoice.rideIdLabel}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[#718096]">Customer</span>
                  <span className="text-right font-medium">
                    {selectedInvoice.customerLabel}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[#718096]">Created</span>
                  <span className="text-right font-medium">
                    {formatDate(selectedInvoice.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#152238]">
                Payment Linkage
              </h3>

              <div className="mt-3 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-[#718096]">Payment ID</span>
                  <span className="break-all text-right font-medium">
                    {selectedInvoice._id || '—'}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[#718096]">Payment Method</span>
                  <span className="text-right font-medium">
                    {selectedInvoice.paymentMode || '—'}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[#718096]">Payment Status</span>
                  <span className="text-right font-medium">
                    {selectedInvoice.paymentStatus || 'pending'}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[#718096]">Provider Reference</span>
                  <span className="break-all text-right font-medium">
                    {selectedInvoice.providerReference || '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#E5E7EB] bg-[#F8FAFC] p-5">
            <h3 className="text-sm font-semibold text-[#152238]">
              Fare & Total
            </h3>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-[#718096]">Base Fare</span>
                <span className="font-medium">
                  {formatAmount(selectedInvoice.ride?.price)}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-[#718096]">Discount</span>
                <span className="font-medium">
                  {formatAmount(selectedInvoice.ride?.discountAmount)}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-t border-[#E5E7EB] pt-3">
                <span className="font-semibold text-[#152238]">
                  Authoritative Invoice Total
                </span>
                <span className="text-lg font-bold text-[#152238]">
                  {formatAmount(selectedInvoice.invoiceTotal)}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-[#718096]">Payment Amount</span>
                <span className="font-medium">
                  {formatAmount(selectedInvoice.amount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-[#E5E7EB] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-[#152238]">
              Invoice List
            </h2>

            <p className="mt-1 text-xs text-[#718096]">
              Invoice total is sourced from the authoritative ride amount.
            </p>
          </div>

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search invoice, ride, customer, amount…"
            className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#152238] outline-none focus:border-[#152238] sm:max-w-sm"
          />
        </div>

        {paymentsLoading ? (
          <div className="p-12 text-center text-sm text-[#718096]">
            Loading invoices…
          </div>
        ) : (
          <>
            {/* Mobile */}
            <div className="space-y-3 p-3 md:hidden">
              {filteredInvoices.length === 0 && (
                <div className="py-10 text-center text-sm text-[#718096]">
                  {invoices.length === 0
                    ? 'No ride invoices available.'
                    : 'No invoices match your search.'}
                </div>
              )}

              {filteredInvoices.map((invoice) => (
                <div
                  key={String(invoice._id)}
                  className="rounded-xl border border-[#E5E7EB] bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#152238]">
                        {invoice.invoiceNumber}
                      </p>

                      <p className="mt-1 break-all text-xs text-[#718096]">
                        Ride: {invoice.rideIdLabel}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                        invoice.paymentStatus === 'success'
                          ? 'bg-green-100 text-green-800'
                          : invoice.paymentStatus === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {invoice.paymentStatus || 'pending'}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-[#718096]">Customer</p>
                      <p className="mt-1 text-[#152238]">
                        {invoice.customerLabel}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#718096]">Date</p>
                      <p className="mt-1 text-[#152238]">
                        {formatDate(invoice.createdAt)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#718096]">Payment</p>
                      <p className="mt-1 text-[#152238]">
                        {invoice.paymentMode || '—'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#718096]">Total</p>
                      <p className="mt-1 font-semibold text-[#152238]">
                        {formatAmount(invoice.invoiceTotal)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[1050px] text-left text-sm text-[#152238]">
                <thead className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#718096]">
                  <tr>
                    <th className="px-4 py-3">Invoice</th>
                    <th className="px-4 py-3">Ride</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E5E7EB]">
                  {filteredInvoices.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-10 text-center text-[#718096]"
                      >
                        {invoices.length === 0
                          ? 'No ride invoices available.'
                          : 'No invoices match your search.'}
                      </td>
                    </tr>
                  )}

                  {filteredInvoices.map((invoice) => (
                    <tr
                      key={String(invoice._id)}
                      className="hover:bg-[#F8FAFC]"
                    >
                      <td className="px-4 py-4">
                        <div className="font-semibold">
                          {invoice.invoiceNumber}
                        </div>

                        <div className="mt-1 break-all font-mono text-[10px] text-[#718096]">
                          Payment: {String(invoice._id)}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="max-w-[220px] truncate">
                          {invoice.rideIdLabel}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        {invoice.customerLabel}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-xs text-[#718096]">
                        {formatDate(invoice.createdAt)}
                      </td>

                      <td className="px-4 py-4 text-right font-semibold tabular-nums">
                        {formatAmount(invoice.invoiceTotal)}
                      </td>

                      <td className="px-4 py-4">
                        {invoice.paymentMode || '—'}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            invoice.paymentStatus === 'success'
                              ? 'bg-green-100 text-green-800'
                              : invoice.paymentStatus === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {invoice.paymentStatus || 'pending'}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          className="text-sm font-medium text-black underline hover:text-neutral-600"
                          onClick={() => setSelectedInvoice(invoice)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
