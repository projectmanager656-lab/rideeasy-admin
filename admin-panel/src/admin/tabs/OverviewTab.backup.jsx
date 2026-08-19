import React, { useMemo } from 'react'
import { Card, CardHeader, StatCard, AlertCard } from '../../components/AdminUIComponents'
import { displayName } from '../../admin/adminUtils'

const money = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

const statusClass = (status) => {
  const s = String(status || '').toLowerCase()
  if (s === 'completed') return 'bg-[#EAFBF2] text-[#1FAA59]'
  if (s === 'pending') return 'bg-[#FFF3E0] text-[#B8860B]'
  if (s === 'cancelled' || s === 'blocked' || s === 'failed') return 'bg-[#FEECEC] text-[#E5484D]'
  return 'bg-slate-100 text-[#111827]'
}

function buildAreaPath(values, width, height, padding) {
  if (!values.length) return ''
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = max - min || 1
  const points = values.map((value, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(values.length - 1, 1)
    const y = height - padding - ((value - min) / range) * (height - padding * 2)
    return `${x},${y}`
  })
  return `M ${points.join(' L ')}`
}

export default function OverviewTab ({ analytics, analyticsLoading, analyticsError, users = [], drivers = [], rides = [], payments = [], emergencyAlerts = [] }) {
  if (analyticsLoading) {
    return (
      <Card className="py-12 text-center">
        <div className="inline-flex items-center gap-2 text-[#6B7280]">
          <i className="ri-loader-4-line animate-spin text-xl text-[#FFA726]"></i>
          <span>Loading dashboard…</span>
        </div>
      </Card>
    )
  }

  if (analyticsError) {
    return <AlertCard type="error" title="Error Loading Overview" message={analyticsError} />
  }

  if (!analytics) {
    return <AlertCard type="info" title="No Data" message='No overview data yet. Use "Refresh" button or check the API connection.' />
  }

  const recentRides = useMemo(() => (rides || []).slice(0, 6), [rides])
  const recentDrivers = useMemo(() => (drivers || []).slice(0, 4), [drivers])
  const recentUsers = useMemo(() => (users || []).slice(0, 4), [users])
  const recentPayments = useMemo(() => (payments || []).slice(0, 4), [payments])

  const bookingSeries = useMemo(() => {
    if (rides && rides.length) {
      const buckets = [0, 0, 0, 0, 0, 0, 0]
      rides.forEach((ride) => {
        const date = new Date(ride.createdAt || ride.updatedAt || Date.now())
        const idx = date.getDay() === 0 ? 6 : date.getDay() - 1
        buckets[idx] += 1
      })
      return buckets
    }
    return [0, 0, 0, 0, 0, 0, 0]
  }, [rides])

  const serviceSeries = useMemo(() => {
    const vehicleCounts = {
      BIKE: 0,
      AUTO: 0,
      CAR: 0,
    }
    if (drivers && drivers.length) {
      drivers.forEach((driver) => {
        const type = String(driver.vehicleType || '').toUpperCase()
        if (vehicleCounts[type] !== undefined) vehicleCounts[type] += 1
      })
    }
    const populated = Object.values(vehicleCounts).some((count) => count > 0)
    if (populated) {
      return [
        { label: 'Bike', value: vehicleCounts.BIKE, color: '#FFA726' },
        { label: 'Auto', value: vehicleCounts.AUTO, color: '#111827' },
        { label: 'Car', value: vehicleCounts.CAR, color: '#1FAA59' },
      ].filter((item) => item.value > 0)
    }
    return []
  }, [drivers])

  const revenueSeries = useMemo(() => {
    if (payments && payments.length) {
      const values = [0, 0, 0, 0, 0, 0, 0]
      payments.forEach((payment) => {
        const date = new Date(payment.completedAt || payment.createdAt || Date.now())
        const idx = date.getDay() === 0 ? 6 : date.getDay() - 1
        values[idx] += Number(payment.amount || 0)
      })
      return values
    }
    return [0, 0, 0, 0, 0, 0, 0]
  }, [payments])

  const bookingPath = buildAreaPath(bookingSeries, 640, 220, 18)
  const bookingAreaPath = bookingPath ? `${bookingPath} L 622,202 L 18,202 Z` : ''
  const revenueBars = revenueSeries.map((value, index) => {
    const height = value > 0 ? Math.max((value / Math.max(...revenueSeries, 1)) * 100, 14) : 0
    return { value, height, index }
  })
  const activeRideCount = rides.filter((ride) => ['accepted', 'arrived', 'started'].includes(String(ride?.status).toLowerCase())).length
  const completedRideCount = rides.filter((ride) => String(ride?.status).toLowerCase() === 'completed').length
  const cancelledRideCount = rides.filter((ride) => String(ride?.status).toLowerCase() === 'cancelled').length
  const activeEmergencyCount = emergencyAlerts.filter((alert) => String(alert?.status).toLowerCase() !== 'resolved').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(17,24,39,0.03)] sm:p-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B7280]">Overview</p>
          <h1 className="mt-2 text-2xl font-bold text-[#111827] sm:text-3xl">Dashboard</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-[#FAFAFA] px-3 py-2 text-sm text-[#111827]">
            <i className="ri-calendar-2-line text-[#6B7280]"></i>
            <span>This month</span>
            <i className="ri-arrow-down-s-line text-[#6B7280]"></i>
          </div>
          <button type="button" className="rounded-xl bg-[#FFA726] px-4 py-2.5 text-sm font-semibold text-[#111827] hover:bg-[#ffb74d]">
            Export report
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Users" value={analytics.totalUsers || users.length || 0} icon="ri-user-line" accent="slate" trend={12} trendLabel="12% vs last month" />
        <StatCard label="Total Drivers" value={analytics.totalDrivers || drivers.length || 0} icon="ri-car-line" accent="green" trend={8} trendLabel="8% growth" />
        <StatCard label="Total Bookings" value={analytics.totalRides || rides.length || 0} icon="ri-calendar-check-line" accent="amber" trend={15} trendLabel="15% improved" />
        <StatCard label="Total Revenue" value={money(analytics.totalRevenue || 0)} icon="ri-money-dollar-circle-line" accent="amber" trend={10} trendLabel="10% this month" />
        <StatCard label="Active Rides" value={activeRideCount} icon="ri-roadster-line" accent="slate" />
        <StatCard label="Completed Rides" value={completedRideCount} icon="ri-checkbox-circle-line" accent="green" />
        <StatCard label="Cancelled Rides" value={cancelledRideCount} icon="ri-close-circle-line" accent="red" />
        <StatCard label="Active Emergency Alerts" value={activeEmergencyCount} icon="ri-alarm-warning-line" accent="amber" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-lg font-bold text-[#111827]">Recent Bookings</h2>
              <p className="text-sm text-[#6B7280]">Latest ride activity</p>
            </div>
            <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-[#111827] hover:border-[#FFA726]">
              View all
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#F9FAFB] text-[#111827]">
                <tr>
                  <th className="px-5 py-3 font-semibold">ID</th>
                  <th className="px-5 py-3 font-semibold">User</th>
                  <th className="px-5 py-3 font-semibold">Service</th>
                  <th className="px-5 py-3 font-semibold">Driver</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recentRides.length ? (
                  recentRides.map((ride, index) => (
                    <tr key={ride?._id || index} className="hover:bg-[#FFF8F0]">
                      <td className="px-5 py-3 font-medium text-[#111827]">#{String(ride?._id || '').slice(-6)}</td>
                      <td className="px-5 py-3 text-[#111827]">{displayName(ride?.user?.name) || 'Guest'}</td>
                      <td className="px-5 py-3 text-[#6B7280]">{ride?.city || 'Ride'} </td>
                      <td className="px-5 py-3 text-[#6B7280]">{displayName(ride?.captain?.name) || 'Unassigned'}</td>
                      <td className="px-5 py-3 text-[#6B7280]">{ride?.createdAt ? new Date(ride.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(ride?.status)}`}>
                          {ride?.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-[#6B7280]">No recent bookings available yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-4">
            <CardHeader title="Bookings Overview" subtitle="Last 7 days" />
          </div>
          <div className="p-5">
            <svg viewBox="0 0 640 220" className="h-[220px] w-full" role="img" aria-label="Bookings overview trend chart">
              <defs>
                <linearGradient id="bookingsFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#FFA726" stopOpacity="0.30" />
                  <stop offset="100%" stopColor="#FFA726" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {[0, 1, 2, 3].map((line) => (
                <line key={line} x1="18" x2="622" y1={40 + line * 40} y2={40 + line * 40} stroke="#E5E7EB" strokeDasharray="4 6" />
              ))}

              {bookingAreaPath && <path d={bookingAreaPath} fill="url(#bookingsFill)" />}
              {bookingPath && <path d={bookingPath} fill="none" stroke="#FFA726" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />}

              {bookingSeries.map((value, index) => {
                const x = 18 + (index * (640 - 36)) / Math.max(bookingSeries.length - 1, 1)
                const max = Math.max(...bookingSeries, 1)
                const min = Math.min(...bookingSeries, 0)
                const y = 202 - ((value - min) / (max - min || 1)) * (202 - 18)
                return <circle key={index} cx={x} cy={y} r="5" fill="#FFA726" stroke="#fff" strokeWidth="2" />
              })}
            </svg>
            <div className="mt-3 flex justify-between text-xs text-[#6B7280]">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-0 overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-4">
            <CardHeader title="Top Services" subtitle="Ride mix" />
          </div>
          <div className="flex flex-col items-center justify-center gap-6 p-5 sm:flex-row">
            {serviceSeries.length ? <><div className="relative h-40 w-40">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" role="img" aria-label="Service mix chart">
                {serviceSeries.reduce((acc, item, index) => {
                  const total = serviceSeries.reduce((sum, entry) => sum + entry.value, 0) || 1
                  const prior = acc
                  const start = prior
                  const length = (item.value / total) * 100
                  const end = start + length
                  const path = `M 60 60 L ${50 + Math.cos((start / 100) * Math.PI * 2 - Math.PI / 2) * 35} ${50 + Math.sin((start / 100) * Math.PI * 2 - Math.PI / 2) * 35} A 35 35 0 0 1 ${50 + Math.cos((end / 100) * Math.PI * 2 - Math.PI / 2) * 35} ${50 + Math.sin((end / 100) * Math.PI * 2 - Math.PI / 2) * 35} Z`
                  const dash = `M 60 60 L ${50 + Math.cos((start / 100) * Math.PI * 2 - Math.PI / 2) * 35} ${50 + Math.sin((start / 100) * Math.PI * 2 - Math.PI / 2) * 35} A 35 35 0 0 1 ${50 + Math.cos((end / 100) * Math.PI * 2 - Math.PI / 2) * 35} ${50 + Math.sin((end / 100) * Math.PI * 2 - Math.PI / 2) * 35}`
                  acc.push(
                    <path key={item.label} d={path} fill="none" stroke={item.color} strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${(length * 2.2).toFixed(2)} 220`} />
                  )
                  return acc
                }, [])}
                <circle cx="60" cy="60" r="22" fill="#fff" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-[#111827]">{serviceSeries.reduce((sum, item) => sum + item.value, 0)}</span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-[#6B7280]">rides</span>
              </div>
            </div>

            <div className="w-full space-y-3">
              {serviceSeries.map((item) => {
                const total = serviceSeries.reduce((sum, entry) => sum + entry.value, 0) || 1
                const ratio = Math.round((item.value / total) * 100)
                return (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between text-sm text-[#111827]">
                      <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>{item.label}</span>
                      <span className="font-semibold">{ratio}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full" style={{ width: `${ratio}%`, backgroundColor: item.color }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
            </> : <div className="py-12 text-sm text-[#6B7280]">No driver vehicle data available yet.</div>}
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-4">
            <CardHeader title="Revenue Overview" subtitle="Weekly trend" />
          </div>
          <div className="flex h-[260px] items-end gap-2 p-5">
            {payments.length ? revenueBars.map((bar) => (
              <div key={bar.index} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full items-end justify-center rounded-t-2xl bg-[#FFA726]" style={{ height: `${bar.height}%`, minHeight: '24px' }}></div>
                <span className="text-[10px] font-medium uppercase text-[#6B7280]">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][bar.index]}</span>
              </div>
            )) : <div className="flex h-full w-full items-center justify-center text-sm text-[#6B7280]">No completed payment data available yet.</div>}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="p-0 overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-4">
            <CardHeader title="Recent Drivers" subtitle="Latest activity" />
          </div>
          <div className="divide-y divide-slate-200">
            {recentDrivers.length ? recentDrivers.map((driver) => (
              <div key={driver?._id || driver?.email} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[#111827]">{displayName(driver?.name) || 'Driver'}</p>
                  <p className="truncate text-sm text-[#6B7280]">{driver?.city || 'City not set'}</p>
                </div>
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${driver?.approved ? 'bg-[#EAFBF2] text-[#1FAA59]' : 'bg-[#FFF3E0] text-[#B8860B]'}`}>
                  {driver?.approved ? 'Approved' : 'Pending'}
                </span>
              </div>
            )) : <div className="px-5 py-8 text-sm text-[#6B7280]">No recent drivers.</div>}
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-4">
            <CardHeader title="Recent Users" subtitle="Newest signups" />
          </div>
          <div className="divide-y divide-slate-200">
            {recentUsers.length ? recentUsers.map((user) => (
              <div key={user?._id || user?.email} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[#111827]">{displayName(user?.name) || 'User'}</p>
                  <p className="truncate text-sm text-[#6B7280]">{user?.email || 'No email'}</p>
                </div>
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${user?.blocked ? 'bg-[#FEECEC] text-[#E5484D]' : 'bg-[#EAFBF2] text-[#1FAA59]'}`}>
                  {user?.blocked ? 'Blocked' : 'Active'}
                </span>
              </div>
            )) : <div className="px-5 py-8 text-sm text-[#6B7280]">No recent users.</div>}
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-4">
            <CardHeader title="Recent Payments" subtitle="Settlements" />
          </div>
          <div className="divide-y divide-slate-200">
            {recentPayments.length ? recentPayments.map((payment) => (
              <div key={payment?._id || payment?.summary} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[#111827]">{payment?.summary || 'Payment'}</p>
                  <p className="truncate text-sm text-[#6B7280]">{payment?.paymentMode || 'Card'}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#111827]">{money(payment?.amount || 0)}</p>
                  <span className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${statusClass(payment?.paymentStatus || 'success')}`}>
                    {payment?.paymentStatus || 'Success'}
                  </span>
                </div>
              </div>
            )) : <div className="px-5 py-8 text-sm text-[#6B7280]">No recent payments.</div>}
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-4">
            <CardHeader title="Emergency Alerts" subtitle="Safety operations" />
          </div>
          <div className="divide-y divide-slate-200">
            {emergencyAlerts.length ? emergencyAlerts.slice(0, 4).map((alert) => (
              <div key={alert?._id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[#111827]">{displayName(alert?.riderName) || 'Unknown rider'}</p>
                  <p className="truncate text-sm text-[#6B7280]">{alert?.type || 'Emergency'} · {alert?.city || 'Location unavailable'}</p>
                </div>
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusClass(alert?.status)}`}>
                  {alert?.status || 'Pending'}
                </span>
              </div>
            )) : <div className="px-5 py-8 text-sm text-[#6B7280]">No emergency alerts.</div>}
          </div>
        </Card>
      </div>
    </div>
  )
}
