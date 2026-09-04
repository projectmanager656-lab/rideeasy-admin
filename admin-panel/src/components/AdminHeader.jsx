import React from 'react'
import { useNavigate } from 'react-router-dom'

const AdminHeader = ({
  onRefresh,
  emergencyAlerts = [],
}) => {
  const navigate = useNavigate()

  const pendingAlerts = emergencyAlerts.filter(
    (alert) =>
      !['acknowledged', 'resolved'].includes(
        String(alert?.status).toLowerCase()
      )
  )

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
      <div className="flex min-h-[72px] items-center justify-between gap-4 px-3 sm:px-6 lg:px-8">

        {/* SEARCH - LEFT SIDE */}
        <div className="relative w-full max-w-[360px]">
          <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-base text-slate-400" />

          <input
            type="search"
            placeholder="Search..."
            className="
              w-full
              rounded-full
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

        {/* RIGHT SIDE CONTROLS */}
        <div className="flex shrink-0 items-center gap-3">

          {/* REFRESH */}
          <button
            type="button"
            onClick={onRefresh}
            aria-label="Refresh"
            title="Refresh"
            className="
              grid
              h-11
              w-11
              place-items-center
              rounded-full
              bg-[#FFB21C]
              text-[#0B1B2B]
              transition
              hover:bg-[#F5A900]
              hover:scale-105
            "
          >
            <i className="ri-refresh-line text-lg" />
          </button>

          {/* NOTIFICATION */}
          <button
            type="button"
            onClick={() => navigate('/admin/notifications')}
            aria-label="Notifications"
            title="Notifications"
            className="
              relative
              grid
              h-11
              w-11
              place-items-center
              rounded-full
              border
              border-slate-200
              bg-white
              text-[#111827]
              transition
              hover:border-[#FFB21C]
              hover:scale-105
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

          {/* SUPER ADMIN */}
          <button
            type="button"
            aria-label="Super Admin"
            title="Super Admin"
            className="
              grid
              h-11
              w-11
              place-items-center
              rounded-full
              bg-white
              text-[#0B1B2B]
              transition
              hover:bg-slate-100
              hover:scale-105
            "
          >
            <span className="text-xs font-bold">
              SA
            </span>
          </button>

        </div>
      </div>
    </header>
  )
}

export default AdminHeader
