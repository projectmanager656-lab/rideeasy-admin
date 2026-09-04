import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import rideEasyAdminLogo from '../assets/rideeasy-admin-logo-reference.png'
import {
  ADMIN_ROLES,
  ADMIN_PERMISSIONS,
  getAllowedAdminNavigation,
} from '../utils/adminPermissions'

const TAB_CONFIG = [
  {
    id: 'analytics',
    label: 'Dashboard',
    icon: 'ri-dashboard-line',
    permission: ADMIN_PERMISSIONS.DASHBOARD,
  },
  {
    id: 'users',
    label: 'Users',
    icon: 'ri-user-3-line',
    permission: ADMIN_PERMISSIONS.USERS,
  },
  {
    id: 'drivers',
    label: 'Drivers',
    icon: 'ri-steering-2-line',
    permission: ADMIN_PERMISSIONS.DRIVERS,
  },
  {
    id: 'vehicles',
    label: 'Vehicles',
    icon: 'ri-car-line',
    permission: ADMIN_PERMISSIONS.VEHICLES,
  },
  {
    id: 'verification',
    label: 'Verification',
    icon: 'ri-checkbox-circle-line',
    permission: ADMIN_PERMISSIONS.VERIFICATION,
  },
  {
    id: 'rides',
    label: 'Rides',
    icon: 'ri-calendar-line',
    permission: ADMIN_PERMISSIONS.RIDES,
  },
  {
    id: 'live-operations',
    label: 'Live Operations',
    icon: 'ri-radar-line',
    permission: ADMIN_PERMISSIONS.LIVE_OPERATIONS,
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: 'ri-money-rupee-circle-line',
    permission: ADMIN_PERMISSIONS.FINANCE,
  },
  {
    id: 'payments',
    label: 'Payments',
    icon: 'ri-bank-card-line',
    permission: ADMIN_PERMISSIONS.PAYMENTS,
  },
  {
    id: 'sos',
    label: 'SOS',
    icon: 'ri-alarm-warning-line',
    permission: ADMIN_PERMISSIONS.SOS,
  },
  {
    id: 'support',
    label: 'Support',
    icon: 'ri-customer-service-2-line',
    permission: ADMIN_PERMISSIONS.SUPPORT,
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'ri-bar-chart-line',
    permission: ADMIN_PERMISSIONS.REPORTS,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: 'ri-notification-3-line',
    permission: ADMIN_PERMISSIONS.NOTIFICATIONS,
  },
  {
    id: 'roles',
    label: 'Roles & Permissions',
    icon: 'ri-shield-user-line',
    permission: ADMIN_PERMISSIONS.ROLES,
  },
     {
    id: 'pricing',
    label: 'Pricing',
    icon: 'ri-money-rupee-circle-line',
    permission: ADMIN_PERMISSIONS.FARE_CONFIGURATION,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'ri-settings-3-line',
    permission: ADMIN_PERMISSIONS.SETTINGS,
  },
]

const ROUTES = {
  analytics: '/dashboard',
  users: '/users',
  drivers: '/drivers',
  vehicles: '/vehicles',
  verification: '/verification',
  rides: '/rides',
  'live-operations': '/live-operations',
  finance: '/finance',
  payments: '/payments',
  sos: '/sos',
  support: '/support',
  reports: '/reports',
  notifications: '/admin/notifications',
  roles: '/roles',
  pricing: '/pricing',
  settings: '/settings',
}

const getFrontendAdminRole = () => {
  const role = localStorage.getItem('adminRole')

  if (
    role === ADMIN_ROLES.SUPER_ADMIN ||
    role === ADMIN_ROLES.OPERATIONS ||
    role === ADMIN_ROLES.SUPPORT
  ) {
    return role
  }

  return ADMIN_ROLES.SUPER_ADMIN
}

const AdminSidebar = ({ tab, setTab, onLogout }) => {
  const navigate = useNavigate()

  const adminRole = getFrontendAdminRole()

  const allowedItems = useMemo(
    () => getAllowedAdminNavigation(adminRole, TAB_CONFIG),
    [adminRole]
  )

  const handleTabClick = (tabId) => {
    const route = ROUTES[tabId]

    if (route) {
      navigate(route)
      return
    }

    setTab(tabId)
  }

  const handleLogout = () => {
    console.log('SIDEBAR LOGOUT CLICKED')

    if (typeof onLogout === 'function') {
      onLogout()
      return
    }

    // Safety fallback
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminRole')

    navigate('/admin', {
      replace: true,
      state: {
        logoutSuccess: true,
      },
    })
  }

  return (
    <aside
      className="
        fixed
        inset-y-0
        left-0
        z-40
        hidden
        h-screen
        w-[260px]
        flex-col
        overflow-hidden
        bg-[#0B1B2B]
        text-white
        shadow-2xl
        md:flex
      "
    >
      {/* LOGO */}
      <div className="shrink-0 border-b border-white/10 px-5 py-6">
        <div className="flex items-center gap-3">
          <img
            src={rideEasyAdminLogo}
            alt="RideEasy Admin"
            className="h-11 w-11 rounded-2xl bg-white/5 object-contain"
          />

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              RideEasy
            </p>

            <h2 className="mt-1 text-xl font-bold text-white">
              Admin
            </h2>
          </div>
        </div>
      </div>

      {/* ONLY THIS AREA SCROLLS */}
      <nav
        className="
          min-h-0
          flex-1
          overflow-y-auto
          overflow-x-hidden
          px-3
          py-5
          overscroll-contain
          scrollbar-thin
          scrollbar-track-transparent
          scrollbar-thumb-slate-600
        "
      >
        <div className="space-y-1.5">
          {allowedItems.map((item) => {
            const active = tab === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabClick(item.id)}
                className={`
                  flex
                  min-h-[42px]
                  w-full
                  items-center
                  gap-3
                  rounded-lg
                  px-3
                  py-2.5
                  text-left
                  text-sm
                  font-medium
                  transition-all
                  ${
                    active
                      ? 'bg-[#FFB21C] text-[#0B1B2B] shadow-md shadow-[#FFB21C]/20'
                      : 'text-slate-400 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <i className={`${item.icon} shrink-0 text-base`} />

                <span className="truncate">
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* LOGOUT NEVER SCROLLS */}
      <div
        className="
          relative
          z-10
          shrink-0
          border-t
          border-white/10
          bg-[#0B1B2B]
          px-3
          py-4
        "
      >
        <button
          type="button"
          onClick={handleLogout}
          className="
            flex
            min-h-[50px]
            w-full
            cursor-pointer
            items-center
            gap-2
            rounded-lg
            border
            border-red-400/30
            bg-white/5
            px-3
            py-2.5
            text-left
            text-sm
            font-medium
            text-[#FCA5A5]
            transition-all
            hover:border-red-400/50
            hover:bg-red-500/10
            hover:text-[#FEE2E2]
            active:scale-[0.99]
          "
        >
          <i className="ri-logout-box-r-line shrink-0 text-base" />

          <span>
            Log out
          </span>
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar
