import React, { useMemo, useState } from 'react'

const money = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN')}`

const getRideFare = (ride) => {
  if (ride?.chargedAmount != null) {
    return Number(ride.chargedAmount || 0)
  }

  if (ride?.price != null) {
    return Number(ride.price || 0)
  }

  return 0
}

const getRideUserId = (ride) =>
  String(
    ride?.user?._id ||
      ride?.user?.id ||
      ride?.userId ||
      ''
  )

const getRideStatus = (ride) =>
  String(ride?.status || '').toLowerCase()

export default function UsersReport ({
  users = [],
  rides = [],
  onBack,
}) {
  const [dateFilter, setDateFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filteredRides = useMemo(() => {
    const now = Date.now()

    return rides.filter((ride) => {
      if (!ride?.createdAt) return dateFilter === 'all'

      if (dateFilter === 'all') return true

      const days = Number(dateFilter)
      const created = new Date(ride.createdAt).getTime()

      return now - created <= days * 24 * 60 * 60 * 1000
    })
  }, [rides, dateFilter])

  const userRows = useMemo(() => {
    return users.map((user) => {
      const userId = String(user?._id || user?.id || '')

      const userRides = filteredRides.filter(
        (ride) => getRideUserId(ride) === userId
      )

      const completedRides = userRides.filter(
        (ride) => getRideStatus(ride) === 'completed'
      )

      const cancelledRides = userRides.filter(
        (ride) => getRideStatus(ride) === 'cancelled'
      )

      const spending = completedRides.reduce(
        (sum, ride) => sum + getRideFare(ride),
        0
      )

      return {
        id: userId,
        name: user?.name || 'Unnamed User',
        email: user?.email || '—',
        phone: user?.phone || '—',
        city: user?.city || '—',
        status: user?.blocked ? 'Blocked' : 'Active',
        totalRides: userRides.length,
        completed: completedRides.length,
        cancelled: cancelledRides.length,
        spending,
        registered: user?.createdAt,
      }
    })
  }, [users, filteredRides])

  const visibleUsers = useMemo(() => {
    let result = userRows

    if (statusFilter !== 'all') {
      result = result.filter(
        (user) =>
          user.status.toLowerCase() === statusFilter
      )
    }

    const query = search.trim().toLowerCase()

    if (query) {
      result = result.filter((user) =>
        [
          user.name,
          user.email,
          user.phone,
          user.city,
        ]
          .join(' ')
          .toLowerCase()
          .includes(query)
      )
    }

    return result
  }, [userRows, statusFilter, search])

  const activeUsers = users.filter(
    (user) => !user?.blocked
  ).length

  const blockedUsers = users.filter(
    (user) => Boolean(user?.blocked)
  ).length

  const totalRides = filteredRides.length

  const completedRides = filteredRides.filter(
    (ride) => getRideStatus(ride) === 'completed'
  ).length

  const cancelledRides = filteredRides.filter(
    (ride) => getRideStatus(ride) === 'cancelled'
  ).length

  const totalSpending = filteredRides
    .filter((ride) => getRideStatus(ride) === 'completed')
    .reduce((sum, ride) => sum + getRideFare(ride), 0)

  const formatDate = (value) => {
    if (!value) return '—'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) return '—'

    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6 p-6">
      <button
        type="button"
        onClick={onBack}
        className="text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        ← Back to Reports
      </button>

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Users Report
        </h1>

        <p className="mt-1 text-slate-500">
          User activity and platform usage overview
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:w-80">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search user, email, phone or city..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 outline-none focus:border-blue-400"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none"
          >
            <option value="all">All time</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none"
          >
            <option value="all">All users</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {[
          ['Total Users', users.length, 'ri-user-3-line'],
          ['Active Users', activeUsers, 'ri-user-follow-line'],
          ['Blocked Users', blockedUsers, 'ri-user-forbid-line'],
          ['Total Rides', totalRides, 'ri-route-line'],
          ['Completed Rides', completedRides, 'ri-checkbox-circle-line'],
          ['User Spending', money(totalSpending), 'ri-wallet-3-line'],
        ].map(([label, value, icon]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                {label}
              </p>

              <i className={`${icon} text-lg text-slate-400`} />
            </div>

            <p className="mt-3 text-2xl font-bold text-slate-900">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            User Activity
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Ride activity and spending by user
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1050px] w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left">
                {[
                  'User',
                  'Phone',
                  'City',
                  'Status',
                  'Rides',
                  'Completed',
                  'Cancelled',
                  'Spending',
                  'Registered',
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {visibleUsers.length > 0 ? (
                visibleUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#0B1B2B] text-xs font-bold text-white">
                          {String(user.name)
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800">
                            {user.name}
                          </p>

                          <p className="text-xs text-slate-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {user.phone}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {user.city}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          user.status === 'Blocked'
                            ? 'bg-red-50 text-red-600'
                            : 'bg-green-50 text-green-600'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-slate-700">
                      {user.totalRides}
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-slate-700">
                      {user.completed}
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-slate-700">
                      {user.cancelled}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                      {money(user.spending)}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(user.registered)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    No users match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-sm text-slate-500">
        Cancelled rides in selected period: {cancelledRides}
      </div>
    </div>
  )
}
