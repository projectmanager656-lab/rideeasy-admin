import { useNavigate } from 'react-router-dom'
import rideEasyAdminLogo from '../assets/rideeasy-admin-logo-reference.png'

const AdminHeader = ({
  onRefresh,
  onLogout,
  tab,
  emergencyAlerts = [],
}) => {
  const navigate = useNavigate()

  const isSecondaryPage = [
    'safety',
    'settings',
    'services',
    'complaints',
    'reports',
    'vehicles',
  ].includes(tab)

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

  const goBackToDashboard = () => {
    navigate('/admin/dashboard', {
      state: { tab: 'analytics' },
    })
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0B1B2B] text-white shadow-sm">
      <div className="flex min-h-[64px] items-center gap-3 px-3 sm:px-6 lg:min-h-[72px] lg:px-8">

        {/* LEFT SIDE */}
        <div className="flex min-w-0 flex-1 items-center gap-3">

          {/* BACK BUTTON */}
          {isSecondaryPage && (
            <button
              type="button"
              onClick={goBackToDashboard}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/15 text-white transition-colors hover:bg-white/10"
              aria-label="Back to dashboard"
            >
              <i className="ri-arrow-left-line text-lg" />
            </button>
          )}

          {/* MOBILE LOGO + NAME */}
          <div className="flex min-w-0 items-center gap-2 md:hidden">
            <img
              src={rideEasyAdminLogo}
              alt="RideEasy Admin"
              className="h-10 w-10 shrink-0 rounded-xl object-contain bg-white/5"
            />

            <div className="min-w-0">
              <p className="truncate text-[9px] font-semibold uppercase tracking-[0.18em] text-[#FFB21C]">
                RideEasy
              </p>

              <p className="truncate text-base font-bold text-white">
                Admin
              </p>
            </div>
          </div>

          {/* DESKTOP LOGO + NAME */}
          <div className="hidden min-w-0 items-center gap-3 md:flex">
            <img
              src={rideEasyAdminLogo}
              alt="RideEasy Admin"
              className="h-10 w-10 shrink-0 rounded-xl object-contain bg-white/5"
            />

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FFB21C]">
                RideEasy
              </p>

              <p className="truncate text-lg font-bold text-white">
                Admin
              </p>
            </div>
          </div>

          {/* SEARCH */}
          <div className="relative ml-auto hidden w-full max-w-[340px] lg:block">
            <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-base text-slate-400" />

            <input
              type="search"
              placeholder="Search..."
              aria-label="Search"
              className="w-full rounded-xl border border-white/10 bg-white/95 py-2.5 pl-10 pr-4 text-sm text-[#111827] placeholder:text-[#6B7280] outline-none transition-all focus:border-[#FFB21C] focus:ring-2 focus:ring-[#FFB21C]/30"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">

          {/* REFRESH */}
          <button
            type="button"
            onClick={onRefresh}
            className="hidden rounded-xl bg-[#FFB21C] px-3 py-2.5 text-sm font-semibold text-[#0B1B2B] shadow-sm transition-colors hover:bg-[#F5A900] lg:inline-flex lg:items-center lg:justify-center lg:gap-2"
            title="Refresh data"
          >
            <i className="ri-refresh-line" />

            <span className="hidden xl:inline">
              Refresh
            </span>
          </button>

          {/* MOBILE PROFILE */}
          <button
            type="button"
            onClick={() => {}}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/10 sm:hidden"
            aria-label="Admin profile"
          >
            <i className="ri-user-3-line text-lg" />
          </button>

          {/* NOTIFICATIONS */}
          <button
            type="button"
            onClick={() => navigate('/admin/notifications')}
            className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white text-[#111827] transition-colors hover:border-[#FFB21C]"
            aria-label="Notifications"
          >
            <i className="ri-notification-3-line text-lg" />

            {pendingAlerts.length > 0 && (
              <span className="absolute -right-1 -top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-[#EF4444] px-1 text-[10px] font-bold text-white ring-2 ring-[#0B1B2B]">
                {pendingAlerts.length > 9
                  ? '9+'
                  : pendingAlerts.length}
              </span>
            )}
          </button>

          {/* ADMIN PROFILE */}
          <div className="hidden items-center gap-2 rounded-xl border border-white/15 bg-white px-3 py-2 shadow-sm sm:flex">
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

          {/* LOGOUT */}
          <button
            type="button"
            onClick={handleLogout}
            className="hidden items-center justify-center gap-2 rounded-xl border border-white/15 bg-white px-3 py-2.5 text-sm font-medium text-[#6B7280] transition-colors hover:border-[#EF4444]/30 hover:bg-red-50 hover:text-[#EF4444] sm:inline-flex"
            title="Sign out"
          >
            <i className="ri-logout-box-line" />

            <span className="hidden xl:inline">
              Logout
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
