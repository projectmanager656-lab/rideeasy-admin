import React from 'react'
import { useNavigate } from 'react-router-dom'

const AdminHeader = ({
  onRefresh,
  onLogout,
  onToggleSidebar,
  emergencyAlerts = [],
}) => {
  const navigate = useNavigate()

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
    <header className="sticky top-0 z-20 border-b border-[#E5E7EB] bg-white shadow-sm">
      <div className="flex min-h-[72px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">

        {/* LEFT SECTION */}
        <div className="flex min-w-0 flex-1 items-center gap-3">

          {/* Mobile menu */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#0B1B2B] text-white transition-colors hover:bg-[#071522] lg:hidden"
            aria-label="Toggle navigation"
          >
            <i className="ri-menu-line text-lg" />
          </button>

          {/* Branding */}
          <div className="hidden min-w-0 md:block">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6B7280]">
              RideEasy Admin
            </p>

            <h1 className="mt-0.5 truncate text-base font-bold text-[#111827]">
              Operations Dashboard
            </h1>
          </div>

          {/* Search */}
          <div className="relative w-full max-w-sm">
            <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-base text-[#6B7280]" />

            <input
              type="search"
              placeholder="Search…"
              className="w-full rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] py-2.5 pl-10 pr-4 text-sm text-[#111827] placeholder:text-[#6B7280] outline-none transition-all focus:border-[#FFB21C] focus:ring-2 focus:ring-[#FFB21C]/20"
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">

          {/* Refresh */}
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFB21C] px-3 py-2 text-sm font-semibold text-[#0B1B2B] shadow-sm transition-colors hover:bg-[#F5A900]"
            title="Refresh data"
          >
            <i className="ri-refresh-line" />
            <span className="hidden sm:inline">
              Refresh
            </span>
          </button>

          {/* Notifications */}
          <button
            type="button"
            onClick={() => navigate('/admin/notifications')}
            className="relative grid h-10 w-10 place-items-center rounded-xl border border-[#E5E7EB] bg-white text-[#111827] transition-colors hover:border-[#FFB21C]"
            aria-label="Notifications"
          >
            <i className="ri-notification-3-line text-lg" />

            {pendingAlerts.length > 0 && (
              <span className="absolute -right-1 -top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-[#EF4444] px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {pendingAlerts.length > 9
                  ? '9+'
                  : pendingAlerts.length}
              </span>
            )}
          </button>

          {/* Admin profile */}
          <div className="hidden items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 shadow-sm sm:flex">

            <div className="grid h-9 w-9 place-items-center rounded-full bg-[#0B1B2B] text-xs font-bold text-white">
              SA
            </div>

            <div className="text-left">
              <p className="text-sm font-semibold text-[#111827]">
                Super Admin
              </p>

              <p className="text-xs text-[#6B7280]">
                Operations
              </p>
            </div>

            <i className="ri-arrow-down-s-line text-[#6B7280]" />
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-medium text-[#6B7280] transition-colors hover:border-[#EF4444]/30 hover:bg-red-50 hover:text-[#EF4444]"
            title="Sign out"
          >
            <i className="ri-logout-box-line" />

            <span className="hidden sm:inline">
              Logout
            </span>
          </button>

        </div>
      </div>
    </header>
  )
}

export default AdminHeader
