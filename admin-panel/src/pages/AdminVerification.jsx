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

    documents: {
      drivingLicense: {
        title: 'Driving License',
        icon: 'ri-id-card-line',
        status: 'Pending review',

        fields: [
          ['Driver Name', 'Not available'],
          ['License Number', 'Not available'],
          ['Date of Birth', 'Not available'],
          ['Issue Date', 'Not available'],
          ['Expiry Date', 'Not available'],
          ['License Type', 'Not available'],
        ],

        documentUrl: null,
      },

      vehicleRegistration: {
        title: 'Vehicle Registration',
        icon: 'ri-car-line',
        status: 'Pending review',

        fields: [
          ['Owner Name', 'Not available'],
          ['Registration Number', 'Not available'],
          ['Vehicle Make', 'Not available'],
          ['Vehicle Model', 'Not available'],
          ['Vehicle Type', 'Not available'],
          ['Fuel Type', 'Not available'],
          ['Registration Date', 'Not available'],
        ],

        documentUrl: null,
      },

      identityProof: {
        title: 'Identity Proof',
        icon: 'ri-shield-user-line',
        status: 'Pending review',

        fields: [
          ['Full Name', 'Not available'],
          ['ID Type', 'Not available'],
          ['ID Number', 'Not available'],
          ['Date of Birth', 'Not available'],
          ['Address', 'Not available'],
        ],

        documentUrl: null,
      },
    },
  },
]

const AdminVerification = () => {
  const navigate = useNavigate()

  const [drivers, setDrivers] = useState(pendingDrivers)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [selectedDocument, setSelectedDocument] = useState(null)

  const handleApprove = (id) => {
    setDrivers((current) =>
      current.filter((driver) => driver.id !== id)
    )

    setSelectedDocument(null)
    setSelectedDriver(null)
  }

  const handleReject = (id) => {
    setDrivers((current) =>
      current.filter((driver) => driver.id !== id)
    )

    setSelectedDocument(null)
    setSelectedDriver(null)
  }

  const handleRefresh = () => {
    setDrivers(pendingDrivers)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminRole')

    navigate('/admin', {
      replace: true,
    })
  }

  const openDocument = (document) => {
    setSelectedDocument(document)
  }

  const closeDocument = () => {
    setSelectedDocument(null)
  }

  const handleTabChange = (nextTab) => {
    const routes = {
      analytics: '/admin/dashboard',
      users: '/admin/users',
      drivers: '/admin/drivers',
      vehicles: '/admin/vehicles',
      verification: '/admin/verification',
      rides: '/admin/rides',
      'live-operations': '/admin/live-operations',
      finance: '/admin/finance',
      payments: '/admin/payments',
      sos: '/admin/sos',
      support: '/admin/support',
      reports: '/admin/reports',
      notifications: '/admin/notifications',
      roles: '/admin/roles',
      settings: '/admin/settings',
    }

    const route = routes[nextTab]

    if (route) {
      navigate(route)
    }
  }

  return (
    <AdminLayout
      tab="verification"
      setTab={handleTabChange}
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

        {/* PENDING VERIFICATION */}
        <section className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">

          <div className="flex flex-col gap-1 border-b border-[#E5E7EB] px-5 py-5 sm:px-6">
            <h2 className="text-lg font-bold text-[#152238]">
              Pending Verification
            </h2>

            <p className="text-sm text-[#718096]">
              Drivers waiting for admin verification.
            </p>
          </div>

          {drivers.length === 0 ? (
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

      {/* =========================================================
          DOCUMENT LIST MODAL
      ========================================================= */}
      {selectedDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3 py-4 sm:px-4 sm:py-6">

          <div className="flex w-full max-w-[520px] max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}
            <div className="flex shrink-0 items-center justify-between border-b border-[#E5E7EB] px-4 py-3.5 sm:px-5 sm:py-4">
              <div className="min-w-0">
                <h2 className="truncate font-bold text-[#152238]">
                  Verification Documents
                </h2>

                <p className="mt-1 truncate text-xs text-[#718096]">
                  {selectedDriver.name}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDriver(null)}
                className="ml-3 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#F7F9FC] text-[#718096] transition hover:bg-[#E5E7EB]"
                aria-label="Close"
              >
                <i className="ri-close-line text-lg" />
              </button>
            </div>

            {/* DOCUMENT LIST */}
            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">

              <div className="space-y-2.5">

                {/* DRIVING LICENSE */}
                <button
                  type="button"
                  onClick={() =>
                    openDocument(
                      selectedDriver.documents.drivingLicense
                    )
                  }
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] px-3.5 py-3.5 text-left transition hover:border-[#FFB21C] hover:bg-[#FFF9ED]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                      <i className="ri-id-card-line text-lg" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#152238]">
                        Driving License
                      </p>

                      <p className="mt-0.5 text-xs text-[#718096]">
                        Click to view details
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="hidden text-xs font-semibold text-[#B77900] sm:inline">
                      Pending review
                    </span>

                    <i className="ri-arrow-right-s-line text-lg text-[#718096]" />
                  </div>
                </button>

                {/* VEHICLE REGISTRATION */}
                <button
                  type="button"
                  onClick={() =>
                    openDocument(
                      selectedDriver.documents.vehicleRegistration
                    )
                  }
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] px-3.5 py-3.5 text-left transition hover:border-[#FFB21C] hover:bg-[#FFF9ED]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#F0FDF4] text-[#16A34A]">
                      <i className="ri-car-line text-lg" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#152238]">
                        Vehicle Registration
                      </p>

                      <p className="mt-0.5 text-xs text-[#718096]">
                        Click to view details
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="hidden text-xs font-semibold text-[#B77900] sm:inline">
                      Pending review
                    </span>

                    <i className="ri-arrow-right-s-line text-lg text-[#718096]" />
                  </div>
                </button>

                {/* IDENTITY PROOF */}
                <button
                  type="button"
                  onClick={() =>
                    openDocument(
                      selectedDriver.documents.identityProof
                    )
                  }
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] px-3.5 py-3.5 text-left transition hover:border-[#FFB21C] hover:bg-[#FFF9ED]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#FFF7ED] text-[#EA580C]">
                      <i className="ri-shield-user-line text-lg" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#152238]">
                        Identity Proof
                      </p>

                      <p className="mt-0.5 text-xs text-[#718096]">
                        Click to view details
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="hidden text-xs font-semibold text-[#B77900] sm:inline">
                      Pending review
                    </span>

                    <i className="ri-arrow-right-s-line text-lg text-[#718096]" />
                  </div>
                </button>

              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex shrink-0 items-center justify-end gap-2 border-t border-[#E5E7EB] bg-[#F7F9FC] p-3 sm:p-4">

              <button
                type="button"
                onClick={() => handleReject(selectedDriver.id)}
                className="rounded-xl border border-[#FCA5A5] bg-white px-3.5 py-2 text-sm font-semibold text-[#DC2626] transition hover:bg-red-50"
              >
                Reject
              </button>

              <button
                type="button"
                onClick={() => handleApprove(selectedDriver.id)}
                className="rounded-xl bg-[#16A34A] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[#15803D]"
              >
                Approve
              </button>

            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          DOCUMENT DETAILS MODAL
      ========================================================= */}
      {selectedDocument && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-3 py-4 sm:px-4 sm:py-6">

          <div className="flex w-full max-w-[520px] max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}
            <div className="flex shrink-0 items-center justify-between border-b border-[#E5E7EB] px-4 py-3.5 sm:px-5 sm:py-4">

              <div className="flex min-w-0 items-center gap-3">

                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#FFF7E6] text-[#B77900]">
                  <i className={`${selectedDocument.icon} text-lg`} />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-base font-bold text-[#152238] sm:text-lg">
                    {selectedDocument.title}
                  </h2>

                  <p className="mt-0.5 text-xs text-[#718096]">
                    Document review
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={closeDocument}
                className="ml-3 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#F7F9FC] text-[#718096] transition hover:bg-[#E5E7EB]"
                aria-label="Close document details"
              >
                <i className="ri-close-line text-lg" />
              </button>

            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">

              {/* STATUS */}
              <div className="rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] px-3.5 py-3">

                <div className="flex items-center justify-between gap-3">

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#718096]">
                      Status
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-[#B77900]">
                      {selectedDocument.status}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-[#FFF7E6] px-2.5 py-1 text-[11px] font-semibold text-[#B77900]">
                    Pending
                  </span>

                </div>

              </div>

              {/* DOCUMENT INFORMATION */}
              <div>

                <h3 className="mb-2.5 text-sm font-bold text-[#152238]">
                  Document Information
                </h3>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">

                  {selectedDocument.fields.map(
                    ([label, value]) => (
                      <div
                        key={label}
                        className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5"
                      >
                        <p className="text-[11px] text-[#718096]">
                          {label}
                        </p>

                        <p className="mt-0.5 text-sm font-semibold text-[#152238]">
                          {value}
                        </p>
                      </div>
                    )
                  )}

                </div>

              </div>

              {/* DOCUMENT PREVIEW */}
              <div>

                <h3 className="mb-2.5 text-sm font-bold text-[#152238]">
                  Document Preview
                </h3>

                {selectedDocument.documentUrl ? (
                  <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#F7F9FC]">
                    <img
                      src={selectedDocument.documentUrl}
                      alt={`${selectedDocument.title} document`}
                      className="max-h-[260px] w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex min-h-[110px] flex-col items-center justify-center rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-5 text-center">

                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-lg text-[#94A3B8] shadow-sm">
                      <i className="ri-file-search-line" />
                    </div>

                    <p className="mt-2.5 text-sm font-semibold text-[#475569]">
                      Preview unavailable
                    </p>

                    <p className="mt-0.5 max-w-xs text-[11px] leading-4 text-[#94A3B8]">
                      No document file or URL is currently available in the frontend data.
                    </p>

                  </div>
                )}

              </div>

            </div>

            {/* FOOTER */}
            <div className="flex shrink-0 items-center justify-between gap-2 border-t border-[#E5E7EB] bg-[#F7F9FC] p-3 sm:p-4">

              <button
                type="button"
                onClick={closeDocument}
                className="rounded-xl border border-[#D1D5DB] bg-white px-3.5 py-2 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FAFC]"
              >
                Back
              </button>

              <div className="flex items-center gap-2">

                <button
                  type="button"
                  onClick={() => {
                    if (selectedDriver) {
                      handleReject(selectedDriver.id)
                    }
                  }}
                  className="rounded-xl border border-[#FCA5A5] bg-white px-3.5 py-2 text-sm font-semibold text-[#DC2626] transition hover:bg-red-50"
                >
                  Reject
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (selectedDriver) {
                      handleApprove(selectedDriver.id)
                    }
                  }}
                  className="rounded-xl bg-[#16A34A] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[#15803D]"
                >
                  Approve
                </button>

              </div>

            </div>

          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminVerification
