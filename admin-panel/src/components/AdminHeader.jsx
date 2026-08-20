import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import rideEasyAdminLogo from '../assets/rideeasy-admin-logo-reference.png'

const AdminHeader = ({
  onRefresh,
  onLogout,
  tab,
  emergencyAlerts = [],
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  const routeTitleMap = {
    '/admin': 'Dashboard',
    '/admin/dashboard': 'Dashboard',
    '/admin/users': 'Users',
    '/admin/drivers': 'Drivers',
    '/admin/rides': 'Bookings',
    '/admin/payments': 'Payments',
    '/admin/services': 'Services',
    '/services': 'Services',
    '/admin/pricing': 'Pricing',
    '/admin/notifications': 'Notifications',
    '/admin/safety': 'Safety',
    '/admin/settings': 'Settings',
    '/admin/vehicles': 'Vehicles',
  }

  const pageTitle = routeTitleMap[location.pathname] || {
    analytics: 'Dashboard',
    users: 'Users',
    drivers: 'Drivers',
    rides: 'Bookings',
    payments: 'Payments',
    more: 'More',
    safety: 'Safety',
    settings: 'Settings',
    vehicles: 'Vehicles',
    pricing: 'Pricing',
    services: 'Services',
    notifications: 'Notifications',
  }[tab] || 'Dashboard'
  const isSecondaryPage = ['safety', 'settings', 'services', 'complaints', 'reports', 'vehicles'].includes(tab)
  const hideMobilePageTitle = ['analytics', 'users', 'drivers', 'rides', 'more'].includes(tab)

  const pendingAlerts = emergencyAlerts.filter(
    (alert) =>
      !['acknowledged', 'resolved'].includes(
        String(alert?.status).toLowerCase()
      )
  )

  const handleLogout = () => {
    onLogout()
    navigate('/admin')
  }

  return (
    <>
      <header className={`sticky top-0 z-20 border-b border-[#E5E7EB] bg-[#0B1B2B] text-white shadow-sm ${isSecondaryPage ? '' : 'md:bg-white md:text-[#152238]'}`}>
        <div className="flex min-h-[58px] items-center justify-between gap-3 px-4 sm:px-6 lg:min-h-[72px] lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {isSecondaryPage && (
              <button type="button" onClick={() => navigate('/admin/dashboard', { state: { tab: 'analytics' } })} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/15 text-white hover:bg-white/10" aria-label="Back to dashboard">
                <i className="ri-arrow-left-line text-lg" />
              </button>
            )}
            <div className="flex min-w-0 items-center gap-2 md:hidden">
              <img src={rideEasyAdminLogo} alt="RideEasy Admin" className="h-7 w-7 rounded-lg object-contain bg-white/5" />
              <span className="truncate text-sm font-semibold text-white">RideEasy Admin</span>
            </div>
            {tab !== 'more' && <h1 className="min-w-0 truncate text-base font-bold text-white md:hidden">{pageTitle}</h1>}

            <div className="hidden min-w-0 md:flex md:items-center md:gap-3">
              <div className={`grid h-10 w-10 place-items-center rounded-xl ${isSecondaryPage ? 'bg-white/10 text-white ring-1 ring-white/15' : 'bg-[#F7F9FC] text-[#152238] ring-1 ring-[#E5E7EB]'}`}>
                <i className="ri-menu-line text-lg" />
              </div>

              <div className="min-w-0">
                <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${isSecondaryPage ? 'text-[#FFB21C]' : 'text-[#6B7280]'}`}>
                  RideEasy Admin
                </p>
                <h1 className={`mt-0.5 truncate text-lg font-bold ${isSecondaryPage ? 'text-white' : 'text-[#111827]'}`}>
                  {pageTitle}
                </h1>
              </div>
            </div>

            <div className="relative ml-auto hidden w-full max-w-[340px] lg:block">
              <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-base text-[#6B7280]" />
              <input
                type="search"
                placeholder="Search..."
                aria-label="Search"
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] py-2.5 pl-10 pr-4 text-sm text-[#111827] placeholder:text-[#6B7280] outline-none transition-all focus:border-[#FFB21C] focus:ring-2 focus:ring-[#FFB21C]/20"
              />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={onRefresh}
              className="hidden rounded-xl bg-[#FFB21C] px-3 py-2 text-sm font-semibold text-[#0B1B2B] shadow-sm transition-colors hover:bg-[#F5A900] lg:inline-flex lg:items-center lg:justify-center lg:gap-2"
              title="Refresh data"
            >
              <i className="ri-refresh-line" />
              <span className="hidden xl:inline">Refresh</span>
            </button>

            <button type="button" onClick={() => {}} className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/5 text-white sm:hidden" aria-label="Admin profile">
              <i className="ri-user-3-line text-lg" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin/notifications')}
              className="relative grid h-10 w-10 place-items-center rounded-xl border border-[#E5E7EB] bg-white text-[#111827] transition-colors hover:border-[#FFB21C]"
              aria-label="Notifications"
            >
              <i className="ri-notification-3-line text-lg" />
              {pendingAlerts.length > 0 && (
                <span className="absolute -right-1 -top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-[#EF4444] px-1 text-[10px] font-bold text-white ring-2 ring-white">
                  {pendingAlerts.length > 9 ? '9+' : pendingAlerts.length}
                </span>
              )}
            </button>

            <div className="hidden items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 shadow-sm sm:flex">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-[#0B1B2B] text-xs font-bold text-white">
                SA
              </div>

              <div className="text-left">
                <p className="text-sm font-semibold text-[#111827]">Super Admin</p>
                <p className="text-xs text-[#6B7280]">Operations</p>
              </div>

              <i className="ri-arrow-down-s-line text-[#6B7280]" />
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="hidden items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-medium text-[#6B7280] transition-colors hover:border-[#EF4444]/30 hover:bg-red-50 hover:text-[#EF4444] sm:inline-flex"
              title="Sign out"
            >
              <i className="ri-logout-box-line" />
              <span className="hidden xl:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {!hideMobilePageTitle && !isSecondaryPage && <div className="border-b border-[#E5E7EB] bg-white px-4 py-3 md:hidden"><h2 className="text-lg font-bold text-[#111827]">{pageTitle}</h2></div>}
    </>
  )
}

export default AdminHeader
