import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'

const LANGUAGES = [
  {
    value: 'en',
    name: 'English',
    nativeName: 'English',
  },
  {
    value: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
  },
  {
    value: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
  },
]

const AdminLanguage = () => {
  const navigate = useNavigate()

  const [selectedLanguage, setSelectedLanguage] = useState(
    () => localStorage.getItem('adminLanguage') || 'en'
  )
  const [saved, setSaved] = useState(false)

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

  const handleSave = () => {
    localStorage.setItem('adminLanguage', selectedLanguage)
    setSaved(true)

    window.setTimeout(() => {
      setSaved(false)
    }, 2500)
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
              onClick={() =>
                navigate('/admin/dashboard', {
                  state: { tab: 'settings' },
                })
              }
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
                Language
              </h1>

              <p className="mt-1 text-sm text-[#718096]">
                Select your preferred language for the Admin Panel.
              </p>
            </div>
          </div>
        </div>

        {/* LANGUAGE CARD */}
        <section className="w-full max-w-3xl overflow-hidden rounded-2xl border border-[#E6EBF2] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.05)]">

          <div className="border-b border-[#E6EBF2] bg-[#F7F9FC] px-5 py-5 sm:px-6">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#0B1B2B] text-white">
                <i className="ri-global-line text-xl" />
              </div>

              <div>
                <h2 className="text-base font-bold text-[#152238] sm:text-lg">
                  Preferred Language
                </h2>

                <p className="mt-0.5 text-sm text-[#718096]">
                  Choose the language you want to use.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-5 sm:p-6">

            {LANGUAGES.map((language) => {
              const selected = selectedLanguage === language.value

              return (
                <button
                  key={language.value}
                  type="button"
                  onClick={() => setSelectedLanguage(language.value)}
                  className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                    selected
                      ? 'border-[#FFA726] bg-[#FFF8ED]'
                      : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                      selected
                        ? 'bg-[#FFA726] text-[#0B1B2B]'
                        : 'bg-[#F1F5F9] text-[#64748B]'
                    }`}
                  >
                    <i className="ri-global-line text-lg" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#152238]">
                      {language.name}
                    </p>

                    <p className="mt-0.5 text-sm text-[#718096]">
                      {language.nativeName}
                    </p>
                  </div>

                  <span
                    className={`grid h-5 w-5 place-items-center rounded-full border ${
                      selected
                        ? 'border-[#FFA726] bg-[#FFA726]'
                        : 'border-[#CBD5E1] bg-white'
                    }`}
                  >
                    {selected && (
                      <i className="ri-check-line text-sm font-bold text-[#0B1B2B]" />
                    )}
                  </span>
                </button>
              )
            })}

            {/* SUCCESS MESSAGE */}
            {saved && (
              <div className="flex items-center gap-2 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-sm font-semibold text-[#15803D]">
                <i className="ri-checkbox-circle-line text-lg" />
                Language preference saved successfully.
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex flex-col-reverse gap-2 border-t border-[#E6EBF2] pt-5 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  navigate('/admin/dashboard', {
                    state: { tab: 'settings' },
                  })
                }
                className="h-11 rounded-xl border border-[#CBD5E1] bg-white px-5 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FAFC]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="h-11 rounded-xl bg-[#FFA726] px-5 text-sm font-bold text-[#0B1B2B] shadow-[0_5px_12px_rgba(255,167,38,0.16)] transition hover:bg-[#FFB74D]"
              >
                Save Changes
              </button>

            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  )
}

export default AdminLanguage