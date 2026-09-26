import React, { useMemo, useState } from 'react'

const money = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN')}`

const getRideFare = (ride) => {
  if (ride?.chargedAmount != null) return Number(ride.chargedAmount || 0)
  if (ride?.price != null) return Number(ride.price || 0)
  return 0
}

const getDriverId = (driver) =>
  String(driver?._id || driver?.id || '')

const getDriverName = (driver) =>
  driver?.name ||
  driver?.fullName ||
  driver?.username ||
  'Unnamed Driver'

const getDriverPhone = (driver) =>
  driver?.phone || driver?.mobile || '—'

const getDriverStatus = (driver) => {
  if (driver?.isOnline === true) return 'Online'
  if (driver?.status) {
    const status = String(driver.status).toLowerCase()
    if (['online', 'active', 'busy'].includes(status)) {
      return status === 'busy' ? 'Busy' : 'Online'
    }
  }
  return 'Offline'
}

const isApproved = (driver) => {
  const value = driver?.isApproved ?? driver?.approved ?? driver?.approvalStatus
  if (typeof value === 'boolean') return value
  return String(value || '').toLowerCase() === 'approved'
}

export default function DriversReport ({
  drivers = [],
  rides = [],
  driversLoading = false,
  ridesLoading = false,
  onBack,
}) {
  const [dateRange, setDateRange] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filteredRides = useMemo(() => {
    const now = Date.now()

    return rides.filter((ride) => {
      if (!ride) return false

      if (dateRange !== 'all') {
        const created = new Date(ride.createdAt || ride.updatedAt || 0).getTime()
        const days = Number(dateRange)
        if (!created || now - created > days * 24 * 60 * 60 * 1000) {
          return false
        }
      }

      return true
    })
  }, [rides, dateRange])

  const driverRows = useMemo(() => {
    const rows = drivers.map((driver) => {
      const id = getDriverId(driver)

      const driverRides = filteredRides.filter(
        (ride) =>
          String(
            ride?.captain?._id ||
            ride?.captain?.id ||
            ride?.captainId ||
            ride?.driverId ||
            ''
          ) === id
      )

      const completedRides = driverRides.filter(
        (ride) => String(ride?.status || '').toLowerCase() === 'completed'
      )

      const cancelledRides = driverRides.filter(
        (ride) => String(ride?.status || '').toLowerCase() === 'cancelled'
      )

      const earnings = completedRides.reduce(
        (sum, ride) => {
          if (
            ride?.captainNetEarning !== undefined &&
            ride?.captainNetEarning !== null
          ) {
            return sum + Number(ride.captainNetEarning || 0)
          }

          return sum
        },
        0
      )

      return {
        driver,
        name: getDriverName(driver),
        phone: getDriverPhone(driver),
        vehicle: driver?.vehicleType || '—',
        city: driver?.city || '—',
        status: getDriverStatus(driver),
        approved: isApproved(driver),
        completed: completedRides.length,
        cancelled: cancelledRides.length,
        earnings,
      }
    })

    let result = rows

    if (statusFilter !== 'all') {
      result = result.filter(
        (row) => row.status.toLowerCase() === statusFilter
      )
    }

    const query = search.trim().toLowerCase()

    if (query) {
      result = result.filter((row) =>
        [
          row.name,
          row.phone,
          row.vehicle,
          row.city,
        ]
          .join(' ')
          .toLowerCase()
          .includes(query)
      )
    }

    return result
  }, [drivers, filteredRides, statusFilter, search])

  const onlineDrivers = drivers.filter(
    (driver) => getDriverStatus(driver) === 'Online'
  ).length

  const offlineDrivers = drivers.length - onlineDrivers

  const approvedDrivers = drivers.filter(isApproved).length

  const completedRides = filteredRides.filter(
    (ride) => String(ride?.status || '').toLowerCase() === 'completed'
  ).length

  const totalDriverEarnings = driverRows.reduce(
    (sum, row) => sum + row.earnings,
    0
  )

  return (
    <div className="p-6">
      {(driversLoading || ridesLoading) ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">
            Loading drivers report…
          </p>
        </div>
      ) : (
        <>
          <button
        type="button"
        onClick={onBack}
        className="mb-6 text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        ← Back to Reports
      </button>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Drivers Report
          </h1>
          <p className="mt-1 text-slate-500">
            Driver activity and performance overview
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none"
          >
            <option value="all">All time</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none"
          >
            <option value="all">All statuses</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="busy">Busy</option>
          </select>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ['Total Drivers', drivers.length],
          ['Online Drivers', onlineDrivers],
          ['Offline Drivers', offlineDrivers],
          ['Approved Drivers', approvedDrivers],
          ['Completed Rides', completedRides],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.05)]"
          >
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.05)]">
        <p className="text-sm text-slate-500">Driver Earnings</p>
        <p className="mt-2 text-2xl font-bold text-slate-900">
          {money(totalDriverEarnings)}
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Driver Performance
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Driver activity, completed rides and earnings
              </p>
            </div>

            <div className="relative w-full lg:w-80">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search driver, phone, vehicle or city..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 outline-none focus:border-blue-400"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1050px] w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                  Driver
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                  Phone
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                  Vehicle
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                  City
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                  Approval
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                  Completed
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                  Cancelled
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                  Earnings
                </th>
              </tr>
            </thead>

            <tbody>
              {driverRows.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-10 text-center text-sm text-slate-500"
                  >
                    No driver records found.
                  </td>
                </tr>
              ) : (
                driverRows.map((row) => (
                  <tr
                    key={getDriverId(row.driver) || row.name}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    <td className="px-6 py-5">
                      <div className="font-medium text-slate-900">
                        {row.name}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {row.phone}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-700">
                      {row.vehicle}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {row.city}
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {row.status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span className="text-sm text-slate-700">
                        {row.approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-700">
                      {row.completed}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-700">
                      {row.cancelled}
                    </td>

                    <td className="px-6 py-5 text-sm font-semibold text-slate-900">
                      {money(row.earnings)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}
    </div>
  )
}
