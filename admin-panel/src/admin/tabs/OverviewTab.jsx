import React, { useMemo } from 'react'
import { useAdminLanguage } from '../../context/AdminLanguageContext'
import { displayName } from '../adminUtils'
import {
  Button,
  Card,
  Badge,
  Loader,
  ErrorState,
} from '../../components/ui'

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
  const { t } = useAdminLanguage()

  const totalUsers = Number(analytics?.totalUsers || 0)
  const totalDrivers = Number(analytics?.totalDrivers || 0)
  const totalRides = Number(analytics?.totalRides || 0)
  const totalRevenue = Number(analytics?.totalRevenue || 0)
  const completedRides = Number(analytics?.completedRideCount || 0)

  const money = (value) =>
    `₹${Number(value || 0).toLocaleString('en-IN')}`

  const relativeTime = (value) => {
    if (!value) return t.recently

    const timestamp = new Date(value).getTime()

    if (Number.isNaN(timestamp)) {
      return t.recently
    }

    const minutes = Math.max(
      0,
      Math.round((Date.now() - timestamp) / 60000)
    )

    if (minutes < 1) return t.justNow
    if (minutes < 60) return `${minutes} ${t.minAgo}`
    if (minutes < 1440) return `${Math.round(minutes / 60)} ${t.hrAgo}`

    return `${Math.round(minutes / 1440)} ${t.dAgo}`
  }

  const topDriver = useMemo(
    () =>
      [...drivers].sort(
        (a, b) =>
          Number(b.completedRides || 0) -
          Number(a.completedRides || 0)
      )[0],
    [drivers]
  )

  const pendingDocuments = drivers.filter(
    (driver) =>
      driver.documentsSubmitted === false ||
      driver.documentsStatus === 'pending' ||
      driver.documentStatus === 'pending'
  ).length

  const completedRide = rides.find(
    (ride) => ride.status === 'completed'
  )

  const pendingActions = [
    {
      label: t.driverVerification,
      count: drivers.filter((driver) => !driver.approved).length,
      icon: 'ri-steering-2-line',
      tone: 'orange',
      tab: 'drivers',
    },
    {
      label: t.documentsPending,
      count: pendingDocuments,
      icon: 'ri-file-list-3-line',
      tone: 'purple',
      tab: 'drivers',
    },
    {
      label: t.complaintsToReview,
      count: 0,
      icon: 'ri-chat-1-line',
      tone: 'blue',
      tab: 'safety',
    },
    {
      label: t.failedPayments,
      count: payments.filter(
        (payment) =>
          String(payment.paymentStatus).toLowerCase() === 'failed'
      ).length,
      icon: 'ri-bank-card-line',
      tone: 'green',
      tab: 'payments',
    },
  ]

  const recentActivity = [
    {
      label: t.newDriverRegistered,
      detail:
        displayName(drivers[0]?.name) ||
        drivers[0]?.email ||
        'Driver',
      time: drivers[0]?.createdAt,
      icon: 'ri-user-add-line',
      tone: 'green',
    },
    {
      label: t.documentSubmitted,
      detail:
        displayName(drivers[0]?.name) ||
        'Driver documents',
      time:
        drivers[0]?.documentsSubmittedAt ||
        drivers[0]?.documentSubmittedAt,
      icon: 'ri-file-check-line',
      tone: 'purple',
    },
    {
      label: t.rideCompleted,
      detail: completedRide?.city || t.completedRideFallback,
      time: completedRide?.completedAt,
      icon: 'ri-road-map-line',
      tone: 'blue',
    },
    {
      label: t.paymentReceived,
      detail:
        payments[0]?.summary || t.ridePayment,
      time:
        payments[0]?.completedAt ||
        payments[0]?.createdAt,
      icon: 'ri-money-rupee-circle-line',
      tone: 'orange',
    },
  ]

  /*
   * Loading state
   */
  if (analyticsLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader
          text={t.loadingDashboard}
          size="lg"
        />
      </div>
    )
  }

  /*
   * Error state
   */
  if (analyticsError) {
    return (
      <ErrorState
        title={t.unableToLoadDashboard}
        message={analyticsError}
        onRetry={onRefresh}
        retryLabel={t.tryAgain}
      />
    )
  }

  const stats = [
    {
      label: t.totalUsers,
      value: totalUsers.toLocaleString('en-IN'),
      icon: 'ri-user-3-line',
      tone: 'blue',
    },
    {
      label: t.totalDrivers,
      value: totalDrivers.toLocaleString('en-IN'),
      icon: 'ri-steering-2-line',
      tone: 'green',
    },
    {
      label: t.totalBookings,
      value: totalRides.toLocaleString('en-IN'),
      icon: 'ri-road-map-line',
      tone: 'orange',
    },
    {
      label: t.totalRevenue,
      value: money(totalRevenue),
      icon: 'ri-money-rupee-circle-line',
      tone: 'purple',
    },
  ]

  return (
    <div className="w-full space-y-5 pb-6 sm:space-y-6">

      {/* =====================================================
          PAGE HEADER
          ===================================================== */}
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight text-[#152238] sm:text-[28px]">
            {t.dashboard}
          </h1>

          <p className="mt-1 text-sm text-[#718096]">
            {t.overviewPlatform}
          </p>
        </div>

      </div>

      {/* =====================================================
          STAT CARDS
          ===================================================== */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={`stat-${stat.label}-${index}`}
            padding="sm"
            className="min-w-0"
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className={[
                  'grid h-10 w-10 shrink-0 place-items-center',
                  'rounded-xl',
                  tones[stat.tone],
                ].join(' ')}
              >
                <i className={`${stat.icon} text-lg`} />
              </div>
            </div>

            <p className="mt-3 truncate text-[10px] font-semibold uppercase tracking-[0.1em] text-[#718096]">
              {stat.label}
            </p>

            <p className="mt-1 truncate text-xl font-bold tracking-tight text-[#152238] sm:text-[22px]">
              {stat.value}
            </p>
          </Card>
        ))}
      </section>

      {/* =====================================================
          QUICK STATS
          ===================================================== */}
      <div className="grid gap-5 lg:grid-cols-2">

        {/* Completed rides */}
        <Card
          title={t.completedRides}
          subtitle={t.successfullyFinishedTrips}
          icon="ri-road-map-line"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[#718096]">
                {t.totalCompleted}
              </p>
            </div>

            <strong className="shrink-0 text-3xl font-bold text-[#16A34A] sm:text-4xl">
              {completedRides.toLocaleString('en-IN')}
            </strong>
          </div>
        </Card>

        {/* Top driver */}
        <Card
          title={t.topDriver}
          subtitle={t.topDriverSubtitle}
          icon="ri-steering-2-line"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--color-sidebar)] text-lg font-bold text-[var(--color-text-inverse)]">
              {String(
                displayName(topDriver?.name) || 'D'
              )
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-bold text-[#152238]">
                {displayName(topDriver?.name) ||
                  'No driver data'}
              </h3>

              <p className="mt-1 truncate text-sm text-[#718096]">
                {t.rating}{' '}
                {topDriver?.rating ??
                  topDriver?.averageRating ??
                  '—'}{' '}
                ·{' '}
                {Number(
                  topDriver?.completedRides || 0
                ).toLocaleString('en-IN')}{' '}
                {t.completedRides}
              </p>
            </div>

            <Badge
              variant="success"
              size="sm"
              icon="ri-star-fill"
            >
              {topDriver?.rating ??
                topDriver?.averageRating ??
                '—'}
            </Badge>
          </div>
        </Card>
      </div>

      {/* =====================================================
          PENDING ACTIONS
          ===================================================== */}
      <Card
        title={t.pendingActions}
        subtitle={t.pendingActionsSubtitle}
        action={
          <i className="ri-arrow-right-up-line text-lg text-[#718096]" />
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {pendingActions.map((action, index) => (
            <button
              key={`action-${action.label}-${index}`}
              type="button"
              onClick={() =>
                onNavigate?.(action.tab)
              }
              className={[
                'flex min-w-0 items-center gap-3',
                'rounded-xl border border-[#EEF1F5]',
                'bg-[var(--color-surface)] p-3 text-left',
                'transition-all duration-200',
                'hover:border-[#D7DEE8]',
                'hover:bg-[#FAFBFC]',
                'hover:shadow-sm',
              ].join(' ')}
            >
              <span
                className={[
                  'grid h-9 w-9 shrink-0 place-items-center',
                  'rounded-lg',
                  tones[action.tone],
                ].join(' ')}
              >
                <i className={action.icon} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-[#152238]">
                  {action.label}
                </span>

                <span className="mt-0.5 block text-xs text-[#718096]">
                  {t.reviewNow}
                </span>
              </span>

              <strong className="shrink-0 text-xl font-bold text-[#152238]">
                {action.count}
              </strong>
            </button>
          ))}
        </div>
      </Card>

      {/* =====================================================
          RECENT ACTIVITY
          ===================================================== */}
      <Card
        title={t.recentActivity}
        action={
          <Badge
            variant="success"
            size="sm"
            icon="ri-live-line"
          >
            Live
          </Badge>
        }
      >
        <div className="divide-y divide-[#E6EBF2]">
          {recentActivity.map((activity, index) => (
            <div
              key={`${activity.label}-${index}`}
              className="flex min-w-0 items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <span
                className={[
                  'grid h-9 w-9 shrink-0 place-items-center',
                  'rounded-full text-sm',
                  tones[activity.tone],
                ].join(' ')}
              >
                <i className={activity.icon} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#152238]">
                  {activity.label}
                </p>

                <p className="truncate text-xs text-[#718096]">
                  {activity.detail}
                </p>
              </div>

              <time className="shrink-0 text-[11px] text-[#718096] sm:text-xs">
                {relativeTime(activity.time)}
              </time>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default OverviewTab
