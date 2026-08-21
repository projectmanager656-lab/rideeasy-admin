import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'

const pendingDrivers = [
  {
    id: 1,
    name: 'Pending Driver',
    phone: '+91 98765 43210',
    vehicle: 'Sedan',
    submitted: 'Today',
    status: 'Pending',
  },
]

const AdminVerification = () => {
  const navigate = useNavigate()
  const [drivers, setDrivers] = useState(pendingDrivers)
  const [selectedDriver, setSelectedDriver] = useState(null)

  const handleApprove = (id) => {
    setDrivers((current) =>
      current.filter((driver) => driver.id !== id)
    )
    setSelectedDriver(null)
  }

  const handleReject = (id) => {
    setDrivers((current) =>
      current.filter((driver) => driver.id !== id)
    )
    setSelectedDriver(null)
  }

  const handleRefresh = () => {
    setDrivers(pendingDrivers)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin')
  }

  return (
    <AdminLayout
      tab="verification"
      setTab={(nextTab) => {
        if (nextTab === 'verification') return

        if (nextTab === 'vehicles') {
          navigate('/admin/vehicles')
          return
        }

        if (nextTab === 'settings') {
          navigate('/admin/settings')
          return
        }

        if (nextTab === 'safety') {
          navigate('/admin/safety')
          return
        }

        if (nextTab === 'reports') {
          navigate('/admin/dashboard', {
            state: { tab: 'reports' },
          })
          return
        }

        if (nextTab === 'complaints') {
          navigate('/admin/dashboard', {
            state: { tab: 'complaints' },
          })
          return
        }

        if (nextTab === 'payments') {
          navigate('/admin/dashboard', {
            state: { tab: 'payments' },
          })
          return
        }

        if (nextTab === 'finance') {
          navigate('/admin/dashboard', {
            state: { tab: 'finance' },
          })
          return
        }

        if (nextTab === 'rides') {
          navigate('/admin/dashboard', {
            state: { tab: 'rides' },
          })
          return
        }

        if (nextTab === 'live-operations') {
          navigate('/admin/dashboard', {
            state: { tab: 'live-operations' },
          })
          return
        }

        if (nextTab === 'roles') {
          navigate('/admin/dashboard', {
            state: { tab: 'roles' },
          })
          return
        }

        navigate('/admin/dashboard', {
          state: { tab: nextTab },
        })
      }}
      onRefresh={handleRefresh}
      onLogout={handleLogout}
      emergencyAlerts={[]}
    >
      <div className="space-y-6">
        {/* PAGE HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#718096]">
              Admin / Verification
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#152238] sm:text-3xl">
              Driver Verification
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-[#718096]">
              Review driver documents and approve or reject verification requests.
            </p>
          </div>

          <div className="inline-flex w-fit items-center rounded-full bg-[#FFF7E6] px-3 py-1.5 text-xs font-semibold text-[#B77900]">
            {drivers.length} Pending
          </div>
        </div>

        {/* MAIN CARD */}
        <section className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
          {/* CARD HEADER */}
          <div className="flex flex-col gap-1 border-b border-[#E5E7EB] px-5 py-5 sm:px-6">
            <h2 className="text-lg font-bold text-[#152238]">
              Pending Verification
            </h2>

            <p className="text-sm text-[#718096]">
              Drivers waiting for admin verification.
            </p>
          </div>

          {drivers.length === 0 ? (
            /* EMPTY STATE */
            <div className="flex min-h-[260px] flex-col items-center justify-center px-6 py-12 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#EAFBF2] text-2xl text-[#16A34A]">
                <i className="ri-checkbox-circle-line" />
              </div>

              <h3 className="mt-4 text-base font-bold text-[#152238]">
                No pending verifications
              </h3>

              <p className="mt-1 max-w-sm text-sm text-[#718096]">
                All submitted driver verification requests have been reviewed.
              </p>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full">
                  <thead className="bg-[#F7F9FC]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#718096]">
                        Driver
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#718096]">
                        Phone
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#718096]">
                        Vehicle
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#718096]">
                        Submitted
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#718096]">
                        Status
                      </th>

                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[#718096]">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {drivers.map((driver) => (
                      <tr
                        key={driver.id}
                        className="border-t border-[#E5E7EB]"
                      >
                        <td className="px-6 py-4">
                          <p className="font-semibold text-[#152238]">
                            {driver.name}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-sm text-[#718096]">
                          {driver.phone}
                        </td>

                        <td className="px-6 py-4 text-sm text-[#718096]">
                          {driver.vehicle}
                        </td>

                        <td className="px-6 py-4 text-sm text-[#718096]">
                          {driver.submitted}
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-[#FFF7E6] px-2.5 py-1 text-xs font-semibold text-[#B77900]">
                            {driver.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedDriver(driver)}
                            className="rounded-xl bg-[#FFB21C] px-4 py-2.5 text-sm font-semibold text-[#0B1B2B] shadow-sm transition hover:bg-[#F5A900]"
                          >
                            View Documents
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}
              <div className="space-y-3 p-4 md:hidden">
                {drivers.map((driver) => (
                  <div
                    key={driver.id}
                    className="rounded-2xl border border-[#E5E7EB] bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-bold text-[#152238]">
                          {driver.name}
                        </h3>

                        <p className="mt-1 text-xs text-[#718096]">
                          {driver.phone}
                        </p>

                        <p className="mt-1 text-xs text-[#718096]">
                          {driver.vehicle} · Submitted {driver.submitted}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-[#FFF7E6] px-2.5 py-1 text-xs font-semibold text-[#B77900]">
                        Pending
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedDriver(driver)}
                      className="mt-4 w-full rounded-xl bg-[#FFB21C] px-4 py-2.5 text-sm font-semibold text-[#0B1B2B]"
                    >
                      View Documents
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      {/* DOCUMENT MODAL */}
      {selectedDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
              <div>
                <h2 className="font-bold text-[#152238]">
                  Verification Documents
                </h2>

                <p className="mt-1 text-xs text-[#718096]">
                  {selectedDriver.name}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDriver(null)}
                className="grid h-9 w-9 place-items-center rounded-xl bg-[#F7F9FC] text-[#718096]"
                aria-label="Close"
              >
                <i className="ri-close-line text-lg" />
              </button>
            </div>

            <div className="space-y-3 p-5">
              {[
                ['Driving License', 'Pending review'],
                ['Vehicle Registration', 'Pending review'],
                ['Identity Proof', 'Pending review'],
              ].map(([document, status]) => (
                <div
                  key={document}
                  className="flex items-center justify-between rounded-xl border border-[#E5E7EB] px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#152238]">
                      {document}
                    </p>

                    <p className="mt-0.5 text-xs text-[#718096]">
                      Document submitted
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-[#B77900]">
                    {status}
                  </span>
                </div>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col-reverse gap-2 border-t border-[#E5E7EB] bg-[#F7F9FC] p-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => handleReject(selectedDriver.id)}
                className="rounded-xl border border-[#FCA5A5] bg-white px-4 py-2.5 text-sm font-semibold text-[#DC2626] hover:bg-red-50"
              >
                Reject
              </button>

              <button
                type="button"
                onClick={() => handleApprove(selectedDriver.id)}
                className="rounded-xl bg-[#16A34A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#15803D]"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminVerification
