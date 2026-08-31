import React from 'react'
import { useNavigate } from 'react-router-dom'

const AdminHeader = ({
  onRefresh,
  onLogout,
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
    console.log('HEADER LOGOUT CLICKED')

    if (typeof onLogout === 'function') {
      onLogout()
    }
  }

  return (
    <header
      className="
        sticky
        top-0
        z-30
        border-b
        border-white/10
        bg-[#0B1B2B]
        text-white
        shadow-sm
      "
    >
      <div className="flex min-h-[72px] items-center gap-3 px-3 sm:px-6 lg:px-8">

        {/* LEFT */}
        <div className="flex min-w-0 flex-1 items-center gap-3">

          {/* BRAND */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#FFB21C]/30 bg-[#111F2D]">
              <span className="text-lg font-black text-[#FFB21C]">
                E
              </span>
            </div>

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
          <div className="relative ml-auto hidden w-full max-w-[360px] lg:block">
            <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-base text-slate-400" />

            <input
              type="search"
              placeholder="Search..."
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                py-2.5
                pl-10
                pr-4
                text-sm
                text-[#111827]
                outline-none
                placeholder:text-[#6B7280]
                focus:border-[#FFB21C]
                focus:ring-2
                focus:ring-[#FFB21C]/20
              "
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex shrink-0 items-center gap-2">

          {/* REFRESH */}
          <button
            type="button"
            onClick={onRefresh}
            className="
              hidden
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#FFB21C]
              px-4
              py-2.5
              text-sm
              font-semibold
              text-[#0B1B2B]
              transition
              hover:bg-[#F5A900]
              lg:inline-flex
            "
          >
            <i className="ri-refresh-line" />
            <span>Refresh</span>
          </button>

          {/* NOTIFICATION */}
          <button
            type="button"
            onClick={() => navigate('/admin/notifications')}
            className="
              relative
              grid
              h-10
              w-10
              place-items-center
              rounded-xl
              border
              border-slate-200
              bg-white
              text-[#111827]
              transition
              hover:border-[#FFB21C]
            "
          >
            <i className="ri-notification-3-line text-lg" />

            {pendingAlerts.length > 0 && (
              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  grid
                  min-h-4
                  min-w-4
                  place-items-center
                  rounded-full
                  bg-red-500
                  px-1
                  text-[10px]
                  font-bold
                  text-white
                "
              >
                {pendingAlerts.length > 9
                  ? '9+'
                  : pendingAlerts.length}
              </span>
            )}
          </button>

          {/* SUPER ADMIN — NOT CLICKABLE */}
          <div
            className="
              hidden
              items-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3
              py-2
              sm:flex
            "
          >
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[#0B1B2B] text-xs font-bold text-white">
              SA
            </div>

            <div>
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
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3
              py-2.5
              text-sm
              font-medium
              text-[#6B7280]
              transition
              hover:border-red-300
              hover:bg-red-50
              hover:text-red-500
            "
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