import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/home', label: 'Book', icon: 'ri-map-pin-line' },
  { to: '/riding', label: 'Live', icon: 'ri-roadster-line' },
  { to: '/history', label: 'Trips', icon: 'ri-history-line' },
  { to: '/profile', label: 'Profile', icon: 'ri-user-3-line' },
]

const Sidebar = () => {
  const location = useLocation()
  const hidden = ['/', '/login', '/signup', '/user/logout'].includes(location.pathname)

  if (hidden) return null

  return (
    <aside className="hidden w-64 shrink-0 border-r border-zinc-800 bg-zinc-950/95 p-4 md:flex md:flex-col">
      <div className="mb-8 flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/80 px-3 py-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/15 text-lg text-emerald-400">
          <i className="ri-taxi-line" />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-400">RideEasy</p>
          <p className="text-sm font-semibold text-white">Driver app</p>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`
            }
          >
            <i className={`${icon} text-base`} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-zinc-800 bg-zinc-900/80 p-3 text-sm text-zinc-300">
        <p className="font-semibold text-white">Quick access</p>
        <p className="mt-1 text-xs text-zinc-400">Keep your rides and profile in one place.</p>
      </div>
    </aside>
  )
}

export default Sidebar
