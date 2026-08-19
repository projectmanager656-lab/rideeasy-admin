import React from 'react'

const items = [
  { id: 'analytics', label: 'Home', icon: 'ri-home-5-line' },
  { id: 'users', label: 'Users', icon: 'ri-user-3-line' },
  { id: 'drivers', label: 'Drivers', icon: 'ri-taxi-line' },
  { id: 'rides', label: 'Bookings', icon: 'ri-calendar-check-line' },
  { id: 'payments', label: 'Payments', icon: 'ri-bank-card-line' },
]

const AdminMobileNav = ({ tab, setTab }) => (
  <nav
    aria-label="Admin navigation"
    className="fixed inset-x-0 bottom-0 z-30 border-t border-[#E6EBF2] bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-1.5 shadow-[0_-8px_24px_rgba(7,26,43,0.08)] backdrop-blur lg:hidden"
  >
    <div className="mx-auto flex h-[62px] max-w-lg items-center justify-around">
      {items.map((item) => {
        const active = tab === item.id
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1 text-[10px] font-semibold transition-colors ${
              active ? 'text-[#F5A623]' : 'text-[#718096]'
            }`}
            aria-current={active ? 'page' : undefined}
          >
            <span className={`grid h-7 w-10 place-items-center rounded-lg text-lg ${active ? 'bg-[#FFF4DF]' : ''}`}>
              <i className={item.icon} />
            </span>
            <span className="truncate">{item.label}</span>
          </button>
        )
      })}
    </div>
  </nav>
)

export default AdminMobileNav
