import React from 'react'
import { useNavigate } from 'react-router-dom'
import rideEasyAdminLogo from '../assets/rideeasy-admin-logo-reference.png'

const TAB_CONFIG = [
  { id: 'analytics', label: 'Dashboard', icon: 'ri-dashboard-line' },
  { id: 'users', label: 'Users', icon: 'ri-user-3-line' },
  { id: 'drivers', label: 'Drivers', icon: 'ri-steering-2-line' },
  { id: 'vehicles', label: 'Vehicles', icon: 'ri-car-line' },
  { id: 'verification', label: 'Verification', icon: 'ri-checkbox-circle-line' },
  { id: 'rides', label: 'Rides', icon: 'ri-calendar-line' },
  { id: 'live-operations', label: 'Live Operations', icon: 'ri-radar-line' },
  { id: 'finance', label: 'Finance', icon: 'ri-money-rupee-circle-line' },
  { id: 'payments', label: 'Payments', icon: 'ri-bank-card-line' },
  { id: 'sos', label: 'SOS', icon: 'ri-alarm-warning-line' },
  { id: 'support', label: 'Support', icon: 'ri-customer-service-2-line' },
  { id: 'reports', label: 'Reports', icon: 'ri-bar-chart-line' },
  { id: 'notifications', label: 'Notifications', icon: 'ri-notification-3-line' },
  { id: 'roles', label: 'Roles & Permissions', icon: 'ri-shield-user-line' },
  { id: 'settings', label: 'Settings', icon: 'ri-settings-3-line' },
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
  notifications: '/notifications',
  roles: '/roles',
  settings: '/settings',
}

const AdminSidebar = ({ tab, setTab }) => {
  const navigate = useNavigate()

  const handleTabClick = (tabId) => {
    const route = ROUTES[tabId]

    if (route) {
      navigate(route)
      return
    }

    setTab(tabId)
  }

  const renderItems = () =>
    TAB_CONFIG.map((item) => {
      const active = tab === item.id

      return (
        <button
          key={item.id}
          type="button"
          onClick={() => handleTabClick(item.id)}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all ${
            active
              ? 'bg-[#FFB21C] text-[#0B1B2B] shadow-md shadow-[#FFB21C]/20'
              : 'text-slate-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          <i className={`${item.icon} text-base`} />
          <span>{item.label}</span>
        </button>
      )
    })

  const logout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin')
  }

  return (
    <aside className="hidden h-screen w-[260px] flex-col bg-[#0B1B2B] text-white shadow-2xl md:flex">
      {/* LOGO */}
      <div className="border-b border-white/10 px-5 py-6">
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

      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <div className="space-y-1.5">
          {renderItems()}
        </div>
      </nav>

      {/* LOGOUT */}
      <div className="border-t border-white/10 px-3 py-4">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-lg border border-red-400/30 bg-white/5 px-3 py-2.5 text-sm font-medium text-[#FCA5A5] transition-colors hover:bg-red-500/10 hover:text-[#FEE2E2]"
        >
          <i className="ri-logout-box-r-line text-base" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar
