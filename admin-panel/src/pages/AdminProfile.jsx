import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'

const AdminProfile = () => {
  const navigate = useNavigate()

  const [name, setName] = useState('Super Admin')
  const [email, setEmail] = useState('admin@rideeasyride.com')
  const [phone, setPhone] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSave = (event) => {
    event.preventDefault()

    setSaved(true)

    window.setTimeout(() => {
      setSaved(false)
    }, 2500)
  }

  const handleTabChange = (nextTab) => {
    const routes = {
      analytics: '/admin/dashboard',
      users: '/admin/users',
      drivers: '/admin/drivers',
      vehicles: '/admin/vehicles',
      verification: '/admin/verification',
      rides: '/admin/rides',
      'live-operations': '/admin/live-operations',
      finance: '/admin/finance',
      payments: '/admin/payments',
      sos: '/admin/sos',
      support: '/admin/support',
      reports: '/admin/reports',
      roles: '/admin/roles',
      services: '/admin/services',
      pricing: '/admin/pricing',
      settings: '/admin/settings',
      notifications: '/admin/notifications',
      safety: '/admin/safety',
    }

    navigate(routes[nextTab] || '/admin/dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminRole')

    navigate('/admin', {
      replace: true,
    })
  }

  return (
    <AdminLayout
      tab="settings"
      setTab={handleTabChange}
      onRefresh={() => {}}
      onLogout={handleLogout}
      emergencyAlerts={[]}
    >
      <div className="space-y-5 pb-6 sm:space-y-6">

        {/* PAGE HEADER */}
        <div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/admin/settings')}
              className="grid h-9 w-9 place-items-center rounded-xl border border-[#D9E0E8] bg-white text-[#475569] transition hover:bg-[#F7F9FC]"
              aria-label="Back to settings"
            >
              <i className="ri-arrow-left-line text-lg" />
            </button>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#718096]">
                Admin / Settings
              </p>

              <h1 className="mt-1 text-[28px] font-bold tracking-[-0.04em] text-[#152238] sm:text-[32px]">
                Profile Settings
              </h1>

              <p className="mt-1 text-sm text-[#718096]">
                Manage your administrator profile.
              </p>
            </div>
          </div>
        </div>

        {/* PROFILE CARD */}
        <section className="w-full max-w-3xl overflow-hidden rounded-2xl border border-[#E6EBF2] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.05)]">

          {/* PROFILE SUMMARY */}
          <div className="border-b border-[#E6EBF2] bg-[#F7F9FC] px-5 py-5 sm:px-6">
            <div className="flex items-center gap-4">

              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#0B1B2B] text-base font-bold text-white">
                SA
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-bold text-[#152238] sm:text-lg">
                  Super Admin
                </h2>

                <p className="mt-0.5 text-sm text-[#718096]">
                  Administration
                </p>
              </div>

            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSave}
            className="space-y-5 p-5 sm:p-6"
          >

            {/* FULL NAME */}
            <div>
              <label
                htmlFor="admin-profile-name"
                className="mb-2 block text-sm font-semibold text-[#334155]"
              >
                Full Name
              </label>

              <input
                id="admin-profile-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-11 w-full rounded-xl border border-[#CBD5E1] bg-white px-4 text-sm text-[#152238] outline-none transition focus:border-[#FFA726] focus:ring-2 focus:ring-[#FFA726]/20"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label
                htmlFor="admin-profile-email"
                className="mb-2 block text-sm font-semibold text-[#334155]"
              >
                Email Address
              </label>

              <input
                id="admin-profile-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 w-full rounded-xl border border-[#CBD5E1] bg-white px-4 text-sm text-[#152238] outline-none transition focus:border-[#FFA726] focus:ring-2 focus:ring-[#FFA726]/20"
              />
            </div>

            {/* PHONE */}
            <div>
              <label
                htmlFor="admin-profile-phone"
                className="mb-2 block text-sm font-semibold text-[#334155]"
              >
                Phone Number
              </label>

              <input
                id="admin-profile-phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="h-11 w-full rounded-xl border border-[#CBD5E1] bg-white px-4 text-sm text-[#152238] outline-none placeholder:text-[#94A3B8] transition focus:border-[#FFA726] focus:ring-2 focus:ring-[#FFA726]/20"
              />
            </div>

            {/* ROLE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#334155]">
                Admin Role
              </label>

              <div className="flex min-h-11 items-center rounded-xl border border-[#E6EBF2] bg-[#F7F9FC] px-4">
                <span className="text-sm font-semibold text-[#475569]">
                  Super Admin
                </span>

                <span className="ml-auto rounded-full bg-[#EAF4FF] px-2.5 py-1 text-xs font-semibold text-[#2563EB]">
                  Administration
                </span>
              </div>
            </div>

            {/* SUCCESS MESSAGE */}
            {saved && (
              <div className="flex items-center gap-2 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-sm font-semibold text-[#15803D]">
                <i className="ri-checkbox-circle-line text-lg" />
                Profile changes saved successfully.
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex flex-col-reverse gap-2 border-t border-[#E6EBF2] pt-5 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => navigate('/admin/settings')}
                className="h-11 rounded-xl border border-[#CBD5E1] bg-white px-5 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FAFC]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="h-11 rounded-xl bg-[#FFA726] px-5 text-sm font-bold text-[#0B1B2B] shadow-[0_5px_12px_rgba(255,167,38,0.16)] transition hover:bg-[#FFB74D] active:translate-y-px"
              >
                Save Changes
              </button>

            </div>

          </form>
        </section>
      </div>
    </AdminLayout>
  )
}

export default AdminProfile