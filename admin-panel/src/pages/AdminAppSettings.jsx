import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { adminApi } from '../services/adminApi'

const AdminAppSettings = () => {
  const navigate = useNavigate()

  const [settings, setSettings] = useState({
    maintenanceMode: false,
    rideBookingEnabled: true,
    driverRegistrationEnabled: true,
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadSettings = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await adminApi.getAppSettings()
      const data = response?.settings || response?.data?.settings || response

      if (data) {
        setSettings({
          maintenanceMode: Boolean(data.maintenanceMode),
          rideBookingEnabled: data.rideBookingEnabled !== false,
          driverRegistrationEnabled:
            data.driverRegistrationEnabled !== false,
        })
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          'Unable to load app settings.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

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

  const handleToggle = (key) => {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }))

    setSuccess('')
    setError('')
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      await adminApi.updateAppSettings(settings)

      setSuccess('App settings updated successfully.')
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          'Unable to update app settings.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout
      tab="settings"
      setTab={handleTabChange}
      onRefresh={loadSettings}
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
                App Settings
              </h1>

              <p className="mt-1 text-sm text-[#718096]">
                Control important RideEasy application settings.
              </p>
            </div>
          </div>
        </div>

        {/* SETTINGS CARD */}
        <section className="w-full max-w-3xl overflow-hidden rounded-2xl border border-[#E6EBF2] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.05)]">

          <div className="border-b border-[#E6EBF2] bg-[#F7F9FC] px-5 py-5 sm:px-6">
            <h2 className="text-base font-bold text-[#152238] sm:text-lg">
              Application Controls
            </h2>

            <p className="mt-1 text-sm text-[#718096]">
              Changes affect the RideEasy application after they are saved.
            </p>
          </div>

          {loading ? (
            <div className="p-6">
              <div className="flex items-center gap-3 text-sm font-semibold text-[#718096]">
                <i className="ri-loader-4-line animate-spin text-lg" />
                Loading app settings...
              </div>
            </div>
          ) : (
            <div className="divide-y divide-[#E6EBF2]">

              {/* MAINTENANCE MODE */}
              <SettingRow
                title="Maintenance Mode"
                description="Temporarily place the application into maintenance mode."
                checked={settings.maintenanceMode}
                onChange={() => handleToggle('maintenanceMode')}
                danger
              />

              {/* RIDE BOOKING */}
              <SettingRow
                title="Ride Booking"
                description="Allow users to create new ride bookings."
                checked={settings.rideBookingEnabled}
                onChange={() => handleToggle('rideBookingEnabled')}
              />

              {/* DRIVER REGISTRATION */}
              <SettingRow
                title="Driver Registration"
                description="Allow new drivers to register with RideEasy."
                checked={settings.driverRegistrationEnabled}
                onChange={() => handleToggle('driverRegistrationEnabled')}
              />

            </div>
          )}

          {/* MESSAGES */}
          {(error || success) && (
            <div className="px-5 pb-0 pt-5 sm:px-6">
              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm font-semibold text-[#B91C1C]">
                  <i className="ri-error-warning-line text-lg" />
                  {error}
                </div>
              )}

              {success && !error && (
                <div className="flex items-center gap-2 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-sm font-semibold text-[#15803D]">
                  <i className="ri-checkbox-circle-line text-lg" />
                  {success}
                </div>
              )}
            </div>
          )}

          {/* ACTIONS */}
          {!loading && (
            <div className="flex flex-col-reverse gap-2 border-t border-[#E6EBF2] p-5 sm:flex-row sm:justify-end sm:p-6">

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
                disabled={saving}
                className="h-11 rounded-xl bg-[#FFA726] px-5 text-sm font-bold text-[#0B1B2B] shadow-[0_5px_12px_rgba(255,167,38,0.16)] transition hover:bg-[#FFB74D] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>

            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  )
}

const SettingRow = ({
  title,
  description,
  checked,
  onChange,
  danger = false,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-6">
      <div className="min-w-0">
        <h3
          className={`text-sm font-bold ${
            danger ? 'text-[#B91C1C]' : 'text-[#152238]'
          }`}
        >
          {title}
        </h3>

        <p className="mt-1 max-w-xl text-sm leading-5 text-[#718096]">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          checked ? 'bg-[#FFA726]' : 'bg-[#CBD5E1]'
        }`}
        aria-label={`${title}: ${checked ? 'enabled' : 'disabled'}`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            checked ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </div>
  )
}

export default AdminAppSettings