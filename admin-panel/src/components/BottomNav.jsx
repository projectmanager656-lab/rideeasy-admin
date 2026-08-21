import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const items = [
  {
    id: 'analytics',
    label: 'Dashboard',
    icon: 'ri-dashboard-3-line',
    tab: 'analytics',
  },
  {
    id: 'users',
    label: 'Users',
    icon: 'ri-user-3-line',
    tab: 'users',
  },
  {
    id: 'drivers',
    label: 'Drivers',
    icon: 'ri-taxi-line',
    tab: 'drivers',
  },
  {
    id: 'rides',
    label: 'Booking',
    icon: 'ri-calendar-check-line',
    tab: 'rides',
  },
  {
    id: 'more',
    label: 'More',
    icon: 'ri-more-2-fill',
    tab: 'more',
  },
]

const moreItems = [
  {
    id: 'vehicles',
    label: 'Vehicles',
    description: 'Manage vehicles',
    icon: 'ri-car-line',
    route: '/admin/vehicles',
  },
  {
    id: 'verification',
    label: 'Verification',
    description: 'Driver verification',
    icon: 'ri-checkbox-circle-line',
    tab: 'drivers',
  },
  {
    id: 'live-operations',
    label: 'Live Operations',
    description: 'Monitor active rides',
    icon: 'ri-radar-line',
    tab: 'live-operations',
  },
  {
    id: 'finance',
    label: 'Finance',
    description: 'Financial overview',
    icon: 'ri-money-rupee-circle-line',
    tab: 'finance',
  },
  {
    id: 'payments',
    label: 'Payments',
    description: 'Payment history',
    icon: 'ri-bank-card-line',
    tab: 'payments',
  },
  {
    id: 'sos',
    label: 'SOS',
    description: 'Emergency controls',
    icon: 'ri-alarm-warning-line',
    tab: 'safety',
  },
  {
    id: 'support',
    label: 'Support',
    description: 'Customer support',
    icon: 'ri-customer-service-2-line',
    tab: 'complaints',
  },
  {
    id: 'reports',
    label: 'Reports',
    description: 'View reports',
    icon: 'ri-bar-chart-line',
    tab: 'reports',
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
    tab: 'roles',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Admin preferences',
    icon: 'ri-settings-3-line',
    tab: 'settings',
  },
]

export default function BottomNav({ tab, setTab }) {
  const navigate = useNavigate()
  const [moreOpen, setMoreOpen] = useState(false)

  const openTab = (tabName) => {
    setMoreOpen(false)

    // Change the dashboard tab directly.
    setTab(tabName)
  }

  const openRoute = (route) => {
    setMoreOpen(false)
    navigate(route)
  }

  const handleMainClick = (item) => {
    if (item.tab === 'more') {
      setMoreOpen((current) => !current)
      return
    }

    openTab(item.tab)
  }

  const handleMoreItem = (item) => {
    if (item.route) {
      openRoute(item.route)
      return
    }

    if (item.tab) {
      openTab(item.tab)
    }
  }

  return (
    <>
      {/* Overlay */}
      {moreOpen && (
        <button
          type="button"
          aria-label="Close More menu"
          onClick={() => setMoreOpen(false)}
          className="fixed inset-0 z-[999] bg-black/30 md:hidden"
        />
      )}

      {/* More Menu */}
      {moreOpen && (
        <div className="fixed bottom-[92px] left-3 right-3 z-[1001] max-h-[70vh] overflow-y-auto rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-2xl md:hidden">
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
              aria-label="Close More"
            >
              <i className="ri-close-line text-lg" />
            </button>
          </div>

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
        </div>
      )}

      {/* Bottom Navigation */}
      <nav
        aria-label="Admin navigation"
        className="admin-mobile-nav md:hidden"
      >
        <div className="admin-mobile-nav__track">
          {items.map((item) => {
            const active =
              item.tab === 'more'
                ? moreOpen
                : tab === item.tab

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
                aria-current={active ? 'page' : undefined}
              >
                <span className="admin-mobile-nav__icon">
                  <i
                    className={
                      moreOpen && item.tab === 'more'
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
