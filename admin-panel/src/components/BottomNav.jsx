import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal } from './AdminUIComponents'

const items = [
  {
    id: 'analytics',
    label: 'Dashboard',
    icon: 'ri-dashboard-3-line',
    route: '/dashboard',
  },
  {
    id: 'users',
    label: 'Users',
    icon: 'ri-user-3-line',
    route: '/users',
  },
  {
    id: 'drivers',
    label: 'Drivers',
    icon: 'ri-taxi-line',
    route: '/drivers',
  },
  {
    id: 'rides',
    label: 'Rides',
    icon: 'ri-calendar-check-line',
    route: '/rides',
  },
  {
    id: 'more',
    label: 'More',
    icon: 'ri-more-2-fill',
  },
]

const moreItems = [
  {
    id: 'vehicles',
    label: 'Vehicles',
    description: 'Manage vehicles',
    icon: 'ri-car-line',
    route: '/vehicles',
  },
  {
    id: 'verification',
    label: 'Verification',
    description: 'Driver verification',
    icon: 'ri-checkbox-circle-line',
    route: '/verification',
  },
  {
    id: 'live-operations',
    label: 'Live Operations',
    description: 'Monitor active rides',
    icon: 'ri-radar-line',
    route: '/live-operations',
  },
  {
    id: 'finance',
    label: 'Finance',
    description: 'Financial overview',
    icon: 'ri-money-rupee-circle-line',
    route: '/finance',
  },
  {
    id: 'payments',
    label: 'Payments',
    description: 'Payment history',
    icon: 'ri-bank-card-line',
    route: '/payments',
  },
  {
    id: 'sos',
    label: 'SOS',
    description: 'Emergency controls',
    icon: 'ri-alarm-warning-line',
    route: '/sos',
  },
  {
    id: 'support',
    label: 'Support',
    description: 'Customer support',
    icon: 'ri-customer-service-2-line',
    route: '/support',
  },
  {
    id: 'reports',
    label: 'Reports',
    description: 'View reports',
    icon: 'ri-bar-chart-line',
    route: '/reports',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'View notifications',
    icon: 'ri-notification-3-line',
    route: '/admin/notifications',
  },
  {
    id: 'roles',
    label: 'Roles & Permissions',
    description: 'Admin access control',
    icon: 'ri-shield-user-line',
    route: '/roles',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Admin preferences',
    icon: 'ri-settings-3-line',
    route: '/settings',
  },
]

export default function BottomNav({ onLogout }) {
  const navigate = useNavigate()

  const [moreOpen, setMoreOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleMainClick = (item) => {
    if (item.id === 'more') {
      setMoreOpen((value) => !value)
      return
    }

    setMoreOpen(false)
    navigate(item.route)
  }

  const handleMoreItem = (item) => {
    setMoreOpen(false)

    if (item.action === 'logout') {
      setShowLogoutConfirm(true)
      return
    }

    navigate(item.route)
  }

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false)

    if (onLogout) {
      onLogout()
    } else {
      localStorage.removeItem('adminToken')
      navigate('/admin')
    }
  }

  return (
    <>
      {/* BACKDROP */}
      {moreOpen && (
        <button
          type="button"
          aria-label="Close More menu"
          onClick={() => setMoreOpen(false)}
          className="fixed inset-0 z-[999] bg-black/30 md:hidden"
        />
      )}

      {/* MORE MENU */}
      {moreOpen && (
        <div className="fixed bottom-[92px] left-3 right-3 z-[1001] max-h-[70vh] overflow-y-auto rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-2xl md:hidden">
          {/* MORE HEADER */}
          <div className="mb-3 flex items-center justify-between px-2">
            <div>
              <h2 className="text-base font-bold text-[#152238]">
                More
              </h2>

              <p className="text-xs text-[#718096]">
                Admin modules
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMoreOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-xl bg-[#F7F9FC] text-[#718096]"
              aria-label="Close More menu"
            >
              <i className="ri-close-line text-lg" />
            </button>
          </div>

          {/* MODULES */}
          <div className="grid grid-cols-2 gap-2">
            {moreItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleMoreItem(item)}
                className="flex min-h-[82px] flex-col items-start justify-center rounded-xl border border-[#E5E7EB] bg-white p-3 text-left transition-colors hover:bg-[#F7F9FC]"
              >
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#F7F9FC] text-[#152238]">
                  <i className={`${item.icon} text-lg`} />
                </span>

                <span className="mt-2 text-xs font-semibold text-[#152238]">
                  {item.label}
                </span>

                <span className="mt-0.5 text-[10px] text-[#718096]">
                  {item.description}
                </span>
              </button>
            ))}
          </div>

          {/* LOGOUT */}
          <div className="mt-3 border-t border-[#E5E7EB] pt-3">
            <button
              type="button"
              onClick={() =>
                handleMoreItem({
                  id: 'logout',
                  action: 'logout',
                })
              }
              className="flex min-h-[56px] w-full items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 text-left transition-colors hover:bg-red-100"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-red-100 text-red-600">
                <i className="ri-logout-box-line text-lg" />
              </span>

              <span>
                <span className="block text-sm font-semibold text-red-600">
                  Logout
                </span>

                <span className="block text-[10px] text-red-500">
                  Sign out of admin
                </span>
              </span>
            </button>
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION MODAL */}
      <Modal
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        title="Confirm Logout"
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(false)}
              className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#152238] transition-colors hover:bg-[#F7F9FC]"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleLogoutConfirm}
              className="rounded-lg bg-[#EF4444] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#DC2626]"
            >
              Logout
            </button>
          </div>
        }
      >
        <div className="py-2">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red-50 text-red-500">
            <i className="ri-logout-box-r-line text-2xl" />
          </div>

          <h3 className="mt-4 text-center text-base font-semibold text-[#152238]">
            Are you sure you want to logout?
          </h3>

          <p className="mt-2 text-center text-sm text-[#718096]">
            You will need to login again to access the admin panel.
          </p>
        </div>
      </Modal>

      {/* BOTTOM NAVIGATION */}
      <nav
        aria-label="Admin navigation"
        className="admin-mobile-nav md:hidden"
      >
        <div className="admin-mobile-nav__track">
          {items.map((item) => {
            const active =
              item.id === 'more'
                ? moreOpen
                : false

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleMainClick(item)}
                className={`admin-mobile-nav__item ${
                  active
                    ? 'admin-mobile-nav__item--active'
                    : ''
                }`}
              >
                <span className="admin-mobile-nav__icon">
                  <i
                    className={
                      moreOpen && item.id === 'more'
                        ? 'ri-close-line'
                        : item.icon
                    }
                  />
                </span>

                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
