import React, { useMemo } from 'react'
import { displayName } from '../adminUtils'

const tones = {
  blue: 'bg-[#EAF4FF] text-[#2563EB]',
  green: 'bg-[#EAFBF2] text-[#16A34A]',
  orange: 'bg-[#FFF4DF] text-[#F59E0B]',
  purple: 'bg-[#F3EEFF] text-[#7C3AED]',
}

const OverviewTab = ({
  analytics,
  analyticsLoading,
  analyticsError,
  onRefresh,
  onNavigate,
  drivers = [],
  rides = [],
  payments = [],
}) => {
  const totalUsers = Number(analytics?.totalUsers || 0)
  const totalDrivers = Number(analytics?.totalDrivers || 0)
  const totalRides = Number(analytics?.totalRides || 0)
  const totalRevenue = Number(analytics?.totalRevenue || 0)
  const completedRides = Number(analytics?.completedRideCount || 0)

  const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`
  const relativeTime = (value) => {
    if (!value) return 'Recently'
    const timestamp = new Date(value).getTime()
    if (Number.isNaN(timestamp)) return 'Recently'
    const minutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000))
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes} min ago`
    if (minutes < 1440) return `${Math.round(minutes / 60)} hr ago`
    return `${Math.round(minutes / 1440)} d ago`
  }

  const topDriver = useMemo(
    () => [...drivers].sort((a, b) => Number(b.completedRides || 0) - Number(a.completedRides || 0))[0],
    [drivers]
  )
  const pendingDocuments = drivers.filter((driver) => (
    driver.documentsSubmitted === false ||
    driver.documentsStatus === 'pending' ||
    driver.documentStatus === 'pending'
  )).length
  const completedRide = rides.find((ride) => ride.status === 'completed')

  const pendingActions = [
    { label: 'Driver Verification', count: drivers.filter((driver) => !driver.approved).length, icon: 'ri-steering-2-line', tone: 'orange', tab: 'drivers' },
    { label: 'Documents Pending', count: pendingDocuments, icon: 'ri-file-list-3-line', tone: 'purple', tab: 'drivers' },
    { label: 'Complaints to Review', count: 0, icon: 'ri-chat-1-line', tone: 'blue', tab: 'safety' },
    { label: 'Failed Payments', count: payments.filter((payment) => String(payment.paymentStatus).toLowerCase() === 'failed').length, icon: 'ri-bank-card-line', tone: 'green', tab: 'payments' },
  ]

  const recentActivity = [
    { label: 'New Driver Registered', detail: displayName(drivers[0]?.name) || drivers[0]?.email || 'Driver', time: drivers[0]?.createdAt, icon: 'ri-user-add-line', tone: 'green' },
    { label: 'Document Submitted', detail: displayName(drivers[0]?.name) || 'Driver documents', time: drivers[0]?.documentsSubmittedAt || drivers[0]?.documentSubmittedAt, icon: 'ri-file-check-line', tone: 'purple' },
    { label: 'Ride Completed', detail: completedRide?.city || 'Completed ride', time: completedRide?.completedAt, icon: 'ri-road-map-line', tone: 'blue' },
    { label: 'Payment Received', detail: payments[0]?.summary || 'Ride payment', time: payments[0]?.completedAt || payments[0]?.createdAt, icon: 'ri-money-rupee-circle-line', tone: 'orange' },
  ]

  if (analyticsLoading) {
    return <div className="flex min-h-[400px] items-center justify-center"><div className="rounded-2xl border border-[#E5E7EB] bg-white px-8 py-7 text-center shadow-sm"><i className="ri-loader-4-line mb-3 inline-block animate-spin text-3xl text-[#FFB21C]" /><p className="text-sm font-medium text-[#6B7280]">Loading dashboard...</p></div></div>
  }

  if (analyticsError) {
    return <div className="rounded-2xl border border-red-200 bg-white p-8 shadow-sm"><div className="flex items-start gap-4"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-red-50 text-red-500"><i className="ri-error-warning-line text-xl" /></div><div><h2 className="font-bold text-[#111827]">Unable to load dashboard</h2><p className="mt-1 text-sm text-[#6B7280]">{analyticsError}</p><button type="button" onClick={onRefresh} className="mt-4 rounded-xl bg-[#FFB21C] px-4 py-2 text-sm font-semibold text-[#0B1B2B] hover:bg-[#F5A900]">Try again</button></div></div></div>
  }

  const stats = [
    ['Total Users', totalUsers.toLocaleString('en-IN'), 'ri-user-3-line', 'blue'],
    ['Total Drivers', totalDrivers.toLocaleString('en-IN'), 'ri-steering-2-line', 'green'],
    ['Total Bookings', totalRides.toLocaleString('en-IN'), 'ri-road-map-line', 'orange'],
    ['Total Revenue', money(totalRevenue), 'ri-money-rupee-circle-line', 'purple'],
  ]

  return (
    <div className="space-y-5 pb-4 sm:space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div><h1 className="text-[28px] font-bold tracking-[-0.04em] text-[#152238] sm:text-[32px]">Dashboard</h1><p className="mt-1 text-sm text-[#718096]">Overview of your platform</p></div>
        <button type="button" onClick={onRefresh} aria-label="Refresh dashboard" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#E6EBF2] bg-white text-[#152238] shadow-sm hover:bg-[#F8FAFC]"><i className="ri-refresh-line text-lg" /></button>
      </div>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map(([label, value, icon, tone]) => <div key={label} className="rounded-2xl border border-[#E6EBF2] bg-white p-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.05)]"><div className={`grid h-10 w-10 place-items-center rounded-xl ${tones[tone]}`}><i className={`${icon} text-lg`} /></div><p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#718096]">{label}</p><p className="mt-1 text-[22px] font-bold tracking-[-0.04em] text-[#152238]">{value}</p></div>)}
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#E6EBF2] bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.05)]"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718096]">Quick stat</p><div className="mt-4 flex items-center justify-between gap-4"><div><h2 className="text-lg font-bold text-[#152238]">Completed Rides</h2><p className="mt-1 text-sm text-[#718096]">Successfully finished trips</p></div><strong className="text-4xl font-bold text-[#16A34A]">{completedRides.toLocaleString('en-IN')}</strong></div></section>
        <section className="rounded-2xl border border-[#E6EBF2] bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.05)]"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718096]">Quick stat</p><div className="mt-4 flex items-center gap-3"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#0B1B2B] text-lg font-bold text-white">{String(displayName(topDriver?.name) || 'D').charAt(0).toUpperCase()}</div><div className="min-w-0"><h2 className="truncate text-lg font-bold text-[#152238]">{displayName(topDriver?.name) || 'No driver data'}</h2><p className="mt-1 text-sm text-[#718096]">Rating {topDriver?.rating ?? topDriver?.averageRating ?? '—'} · {Number(topDriver?.completedRides || 0).toLocaleString('en-IN')} completed rides</p></div></div></section>
      </div>

      <section className="rounded-2xl border border-[#E6EBF2] bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.05)]"><div className="flex items-center justify-between gap-3"><h2 className="text-lg font-bold text-[#152238]">Pending Actions</h2><i className="ri-arrow-right-up-line text-[#718096]" /></div><div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">{pendingActions.map((action) => <button key={action.label} type="button" onClick={() => onNavigate?.(action.tab)} className="flex items-center gap-3 rounded-xl border border-[#EEF1F5] p-3 text-left transition hover:border-[#D7DEE8] hover:bg-[#FAFBFC]"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${tones[action.tone]}`}><i className={action.icon} /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-[#152238]">{action.label}</span><span className="mt-0.5 block text-xs text-[#718096]">Review now</span></span><strong className="text-xl text-[#152238]">{action.count}</strong></button>)}</div></section>

      <section className="rounded-2xl border border-[#E6EBF2] bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.05)]"><div className="flex items-center justify-between gap-3"><h2 className="text-lg font-bold text-[#152238]">Recent Activity</h2><span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#718096]">Live</span></div><div className="mt-3 divide-y divide-[#E6EBF2]">{recentActivity.map((activity) => <div key={activity.label} className="flex items-center gap-3 py-3 first:pt-1"><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm ${tones[activity.tone]}`}><i className={activity.icon} /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#152238]">{activity.label}</p><p className="truncate text-xs text-[#718096]">{activity.detail}</p></div><time className="shrink-0 text-xs text-[#718096]">{relativeTime(activity.time)}</time></div>)}</div></section>
    </div>
  )
}

export default OverviewTab
