import React, { useMemo } from 'react'

const OverviewTab = ({
  analytics,
  analyticsLoading,
  analyticsError,
  onRefresh,
}) => {
  const totalUsers = Number(analytics?.totalUsers || 0)
  const totalDrivers = Number(analytics?.totalDrivers || 0)
  const totalRides = Number(analytics?.totalRides || 0)
  const totalRevenue = Number(analytics?.totalRevenue || 0)
  const activeDriversOnline = Number(analytics?.activeDriversOnline || 0)
  const completedRideCount = Number(analytics?.completedRideCount || 0)

  const cityAnalytics = analytics?.cityAnalytics || {}

  const money = (value) =>
    `₹${Number(value || 0).toLocaleString('en-IN')}`

  const vehicleCounts = useMemo(() => {
    const rides = Array.isArray(analytics?.rides) ? analytics.rides : []

    return rides.reduce(
      (result, ride) => {
        const type = String(
          ride?.vehicleType ||
          ride?.vehicle?.type ||
          ride?.serviceType ||
          ''
        ).toUpperCase()

        if (type.includes('BIKE')) result.BIKE += 1
        else if (type.includes('AUTO')) result.AUTO += 1

        return result
      },
      { BIKE: 0, AUTO: 0 }
    )
  }, [analytics])

  const cityRows = Object.entries(cityAnalytics)

  if (analyticsLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-8 py-7 text-center shadow-sm">
          <i className="ri-loader-4-line mb-3 inline-block animate-spin text-3xl text-[#FFB21C]" />
          <p className="text-sm font-medium text-[#6B7280]">
            Loading dashboard…
          </p>
        </div>
      </div>
    )
  }

  if (analyticsError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-red-50 text-red-500">
            <i className="ri-error-warning-line text-xl" />
          </div>

          <div>
            <h2 className="font-bold text-[#111827]">
              Unable to load dashboard
            </h2>

            <p className="mt-1 text-sm text-[#6B7280]">
              {analyticsError}
            </p>

            <button
              type="button"
              onClick={onRefresh}
              className="mt-4 rounded-xl bg-[#FFB21C] px-4 py-2 text-sm font-semibold text-[#0B1B2B] hover:bg-[#F5A900]"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers.toLocaleString('en-IN'),
      icon: 'ri-user-3-line',
      description: 'Registered passengers',
      iconBg: 'bg-[#FFF4DF]',
      iconColor: 'text-[#B86B00]',
    },
    {
      title: 'Total Drivers',
      value: totalDrivers.toLocaleString('en-IN'),
      icon: 'ri-steering-2-line',
      description: 'Registered drivers',
      iconBg: 'bg-[#EAF4FF]',
      iconColor: 'text-[#2563EB]',
    },
    {
      title: 'Total Bookings',
      value: totalRides.toLocaleString('en-IN'),
      icon: 'ri-road-map-line',
      description: 'All ride bookings',
      iconBg: 'bg-[#EAFBF2]',
      iconColor: 'text-[#16A34A]',
    },
    {
      title: 'Total Revenue',
      value: money(totalRevenue),
      icon: 'ri-money-rupee-circle-line',
      description: 'Total platform revenue',
      iconBg: 'bg-[#F3EEFF]',
      iconColor: 'text-[#7C3AED]',
    },
  ]

  const secondaryStats = [
    {
      title: 'Active Drivers',
      value: activeDriversOnline,
      icon: 'ri-user-location-line',
      color: 'text-[#16A34A]',
      bg: 'bg-[#EAFBF2]',
    },
    {
      title: 'Completed Rides',
      value: completedRideCount,
      icon: 'ri-checkbox-circle-line',
      color: 'text-[#2563EB]',
      bg: 'bg-[#EAF4FF]',
    },
    {
      title: 'Platform Income',
      value: money(analytics?.platformIncomeTotal || 0),
      icon: 'ri-wallet-3-line',
      color: 'text-[#B86B00]',
      bg: 'bg-[#FFF4DF]',
    },
    {
      title: 'Emergency Alerts',
      value: Number(analytics?.emergencyAlertCount || 0),
      icon: 'ri-alarm-warning-line',
      color: 'text-[#EF4444]',
      bg: 'bg-red-50',
    },
  ]

  const maxCityRides = Math.max(
    1,
    ...cityRows.map(([, data]) => Number(data?.rides || 0))
  )

  return (
    <div className="space-y-6">

      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B86B00]">
            Overview
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-[#6B7280]">
            Overview of your RideEasy platform performance.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#FFB21C] px-4 py-2.5 text-sm font-semibold text-[#0B1B2B] shadow-sm transition hover:bg-[#F5A900]"
        >
          <i className="ri-refresh-line" />
          Refresh data
        </button>
      </div>

      {/* Main statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#6B7280]">
                  {stat.title}
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-[#111827]">
                  {stat.value}
                </p>
              </div>

              <div
                className={`grid h-11 w-11 place-items-center rounded-xl ${stat.iconBg} ${stat.iconColor}`}
              >
                <i className={`${stat.icon} text-xl`} />
              </div>
            </div>

            <p className="mt-4 text-xs text-[#9CA3AF]">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Secondary statistics */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {secondaryStats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div
                className={`grid h-10 w-10 place-items-center rounded-xl ${stat.bg} ${stat.color}`}
              >
                <i className={`${stat.icon} text-lg`} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-[#6B7280]">
                  {stat.title}
                </p>

                <p className="mt-1 text-lg font-bold text-[#111827]">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance + City Analytics */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">

        {/* Platform performance */}
        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#111827]">
                Platform Performance
              </h2>

              <p className="mt-1 text-sm text-[#6B7280]">
                Current ride activity across the platform.
              </p>
            </div>

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFF4DF] text-[#B86B00]">
              <i className="ri-bar-chart-2-line text-lg" />
            </div>
          </div>

          <div className="mt-6 space-y-5">

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-[#111827]">
                  Total Bookings
                </span>

                <span className="text-sm font-bold text-[#111827]">
                  {totalRides}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[#F1F3F5]">
                <div
                  className="h-full rounded-full bg-[#FFB21C]"
                  style={{
                    width: `${totalRides > 0 ? 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-[#111827]">
                  Completed Rides
                </span>

                <span className="text-sm font-bold text-[#111827]">
                  {completedRideCount}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[#F1F3F5]">
                <div
                  className="h-full rounded-full bg-[#22C55E]"
                  style={{
                    width: `${
                      totalRides
                        ? Math.min(
                            100,
                            (completedRideCount / totalRides) * 100
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-[#111827]">
                  Active Drivers
                </span>

                <span className="text-sm font-bold text-[#111827]">
                  {activeDriversOnline}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[#F1F3F5]">
                <div
                  className="h-full rounded-full bg-[#2563EB]"
                  style={{
                    width: `${
                      totalDrivers
                        ? Math.min(
                            100,
                            (activeDriversOnline / totalDrivers) * 100
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* City analytics */}
        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#111827]">
                City Performance
              </h2>

              <p className="mt-1 text-sm text-[#6B7280]">
                Ride activity by city.
              </p>
            </div>

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFF4DF] text-[#B86B00]">
              <i className="ri-map-pin-line text-lg" />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {cityRows.length === 0 ? (
              <div className="py-8 text-center text-sm text-[#9CA3AF]">
                No city data available.
              </div>
            ) : (
              cityRows.map(([city, data]) => {
                const rides = Number(data?.rides || 0)
                const drivers = Number(data?.drivers || 0)
                const revenue = Number(data?.revenue || 0)

                return (
                  <div key={city}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#F7F9FC] text-[#0B1B2B]">
                          <i className="ri-map-pin-2-line" />
                        </div>

                        <span className="truncate text-sm font-semibold text-[#111827]">
                          {city}
                        </span>
                      </div>

                      <span className="text-xs font-semibold text-[#6B7280]">
                        {rides} rides
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[#F1F3F5]">
                      <div
                        className="h-full rounded-full bg-[#FFB21C]"
                        style={{
                          width: `${(rides / maxCityRides) * 100}%`,
                        }}
                      />
                    </div>

                    <div className="mt-2 flex justify-between text-[11px] text-[#9CA3AF]">
                      <span>{drivers} drivers</span>
                      <span>{money(revenue)}</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </section>
      </div>

      {/* Vehicle distribution */}
      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#111827]">
              Service Distribution
            </h2>

            <p className="mt-1 text-sm text-[#6B7280]">
              Current ride distribution by vehicle type.
            </p>
          </div>

          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#EAF4FF] text-[#2563EB]">
            <i className="ri-route-line text-lg" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

          <div className="rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFF4DF] text-[#B86B00]">
                  <i className="ri-motorbike-line text-lg" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#111827]">
                    Bike
                  </p>

                  <p className="text-xs text-[#6B7280]">
                    Bike rides
                  </p>
                </div>
              </div>

              <span className="text-xl font-bold text-[#111827]">
                {vehicleCounts.BIKE}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#EAF4FF] text-[#0B1B2B]">
                  <i className="ri-car-line text-lg" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#111827]">
                    Auto
                  </p>

                  <p className="text-xs text-[#6B7280]">
                    Auto rides
                  </p>
                </div>
              </div>

              <span className="text-xl font-bold text-[#111827]">
                {vehicleCounts.AUTO}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Admin information */}
      <section className="rounded-2xl border border-[#E5E7EB] bg-[#0B1B2B] p-5 text-white shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FFB21C]">
              RideEasy Operations
            </p>

            <h2 className="mt-2 text-xl font-bold">
              Admin control center
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-300">
              Monitor users, drivers, bookings, payments, services,
              notifications, and emergency activity from one place.
            </p>
          </div>

          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#FFB21C] text-2xl text-[#0B1B2B]">
            <i className="ri-dashboard-3-line" />
          </div>
        </div>
      </section>

    </div>
  )
}

export default OverviewTab
