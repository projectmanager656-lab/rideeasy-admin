import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

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
    label: 'Bookings',
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
    id: 'safety',
    label: 'Safety',
    description: 'Emergency controls',
    icon: 'ri-shield-check-line',
    path: '/admin/safety',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Admin preferences',
    icon: 'ri-settings-3-line',
    path: '/admin/settings',
  },
  {
    id: 'services',
    label: 'Services',
    description: 'Manage service offerings',
    icon: 'ri-tools-line',
    path: '/admin/services',
  },
  {
    id: 'complaints',
    label: 'Complaints',
    description: 'Review user and driver complaints',
    icon: 'ri-error-warning-line',
    path: null,
  },
  {
    id: 'reports',
    label: 'Reports',
    description: 'View platform reports',
    icon: 'ri-bar-chart-box-line',
    path: null,
  },
]

const BottomNav = ({ tab, setTab }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const [showMore, setShowMore] = useState(false)

  const moreTabs = new Set([
    'more',
    'settings',
    'safety',
    'services',
    'complaints',
    'reports',
  ])

  const handleMainClick = (item) => {
    if (item.id === 'more') {
      setShowMore(true)
      setTab('more')
      return
    }

    setShowMore(false)

    if (
      location.pathname !== '/admin/dashboard' &&
      location.pathname !== '/admin'
    ) {
      navigate('/admin/dashboard', {
        state: { tab: item.tab },
      })
    }

    setTab(item.tab)
  }

  const handleMoreClick = (item) => {
    if (!item.path) {
      // Complaints and Reports routes are not available yet.
      setTab(item.id)
      setShowMore(false)
      return
    }

    setShowMore(false)
    navigate(item.path)
  }

  return (
    <>
      {/* Dark overlay */}
      {showMore && (
        <button
          type="button"
          aria-label="Close More menu"
          className="admin-more-overlay md:hidden"
          onClick={() => setShowMore(false)}
        />
      )}

      {/* More Bottom Sheet */}
      {showMore && (
        <section
          className="admin-more-sheet md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="More options"
        >
          <div className="admin-more-sheet__handle" />

          <div className="admin-more-sheet__header">
            <div>
              <p className="admin-more-sheet__eyebrow">ADMIN</p>
              <h2>More</h2>
            </div>

            <button
              type="button"
              className="admin-more-sheet__close"
              onClick={() => setShowMore(false)}
              aria-label="Close"
            >
              <i className="ri-close-line" />
            </button>
          </div>

          <div className="admin-more-sheet__list">
            {moreItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`admin-more-sheet__item ${
                  !item.path ? 'admin-more-sheet__item--disabled' : ''
                }`}
                onClick={() => handleMoreClick(item)}
              >
                <span className="admin-more-sheet__item-icon">
                  <i className={item.icon} />
                </span>

                <span className="admin-more-sheet__item-content">
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </span>

                <i className="ri-arrow-right-s-line admin-more-sheet__arrow" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Floating Bottom Navigation */}
      <nav
        aria-label="Admin navigation"
        className="admin-mobile-nav md:hidden"
      >
        <div className="admin-mobile-nav__track">
          {items.map((item) => {
            const active =
              item.id === 'more'
                ? moreTabs.has(tab) || showMore
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
                  <i className={item.icon} />
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

export default BottomNav
