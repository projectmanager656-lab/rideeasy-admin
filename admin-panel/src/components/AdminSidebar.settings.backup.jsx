import React from 'react'
import { useNavigate } from 'react-router-dom'

const TAB_CONFIG = [
  { id: 'analytics', label: 'Dashboard', icon: 'ri-dashboard-line', section: 'MAIN' },
  { id: 'notifications', label: 'Notifications', icon: 'ri-notification-3-line', section: 'MAIN' },
  { id: 'users', label: 'Users', icon: 'ri-user-3-line', section: 'PLATFORM' },
  { id: 'drivers', label: 'Drivers', icon: 'ri-car-2-line', section: 'PLATFORM' },
  { id: 'rides', label: 'Bookings', icon: 'ri-calendar-line', section: 'PLATFORM' },
  { id: 'payments', label: 'Payments', icon: 'ri-bank-card-line', section: 'PLATFORM' },
  { id: 'safety', label: 'Emergency / Safety', icon: 'ri-shield-cross-line', section: 'SAFETY' },
  { id: 'services', label: 'Services', icon: 'ri-taxi-line', section: 'SETTINGS' },
  { id: 'pricing', label: 'Pricing', icon: 'ri-money-rupee-circle-line', section: 'SETTINGS' },
]

const AdminSidebar = ({ tab, setTab, isOpen, setIsOpen }) => {
  const navigate = useNavigate()

  const handleTabClick = (tabId) => {
    if (tabId === 'notifications') {
      navigate('/admin/notifications')
      setIsOpen(false)
      return
    }

    setTab(tabId)
    setIsOpen(false)
  }

  const renderItems = (section) =>
    TAB_CONFIG
      .filter((item) => item.section === section)
      .map((item) => {
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

  return (
    <>
      <aside
        className={`admin-sidebar fixed left-0 top-0 z-30 flex h-screen w-[260px] flex-col bg-[#0B1B2B] text-white shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="border-b border-white/10 px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFB21C] text-xl text-[#0B1B2B] shadow-lg shadow-[#FFB21C]/20">
              <i className="ri-road-map-line" />
            </div>

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

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">

          {/* Main */}
          <div className="mb-6">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Main
            </p>

            <div className="space-y-1.5">
              {renderItems('MAIN')}
            </div>
          </div>

          {/* Platform */}
          <div className="mb-6">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Platform
            </p>

            <div className="space-y-1.5">
              {renderItems('PLATFORM')}
            </div>
          </div>

          {/* Safety */}
          <div className="mb-6">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Safety
            </p>

            <div className="space-y-1.5">
              {renderItems('SAFETY')}
            </div>
          </div>

          {/* Settings */}
          <div>
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Settings
            </p>

            <div className="space-y-1.5">
              {renderItems('SETTINGS')}
            </div>
          </div>
        </nav>

        {/* Bottom */}
        <div className="space-y-2 border-t border-white/10 px-3 py-4">

          <button
            type="button"
            onClick={() => setTab('pricing')}
            className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <i className="ri-settings-2-line text-base" />
            <span>Settings</span>
          </button>

          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <i className="ri-question-line text-base" />
            <span>Help</span>
          </button>

          <div className="mt-3 border-t border-white/10 pt-3">
            <div className="rounded-lg bg-white/5 px-2 py-2">
              <div className="flex items-center gap-2.5">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-[#FFB21C]/20 text-xs font-bold text-[#FFB21C]">
                  SA
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-white">
                    Super Admin
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Operations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-[#071522]/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default AdminSidebar
