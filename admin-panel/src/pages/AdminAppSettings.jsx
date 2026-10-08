import React, { useEffect, useState } from 'react'
import { useAdminLanguage } from '../context/AdminLanguageContext'
import { useNavigate } from 'react-router-dom'
import { adminApi } from '../services/adminApi'

const defaultSettings = {
  maintenanceMode: false,
  rideBookingEnabled: true,
  driverRegistrationEnabled: true,
}

export default function AdminAppSettings () {
  const { t } = useAdminLanguage()
  const navigate = useNavigate()

  const [settings, setSettings] = useState(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadSettings = async () => {
      try {
        const result = await adminApi.getAppSettings()
        if (!active) return

        const loaded = result?.settings || result || {}
        setSettings({
          maintenanceMode: Boolean(loaded.maintenanceMode),
          rideBookingEnabled:
            loaded.rideBookingEnabled !== false,
          driverRegistrationEnabled:
            loaded.driverRegistrationEnabled !== false,
        })
      } catch (err) {
        if (!active) return
        setError(
          err?.response?.data?.message ||
          err?.message ||
          'Unable to load app settings.'
        )
      } finally {
        if (active) setLoading(false)
      }
    }

    loadSettings()

    return () => {
      active = false
    }
  }, [])

  const toggleSetting = (key) => {
    setMessage('')
    setError('')

    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }))
  }

  const handleSave = async () => {
    setMessage('')
    setError('')
    setSaving(true)

    try {
      const result = await adminApi.updateAppSettings(settings)

      const saved = result?.settings || result || {}
      setSettings({
        maintenanceMode: Boolean(saved.maintenanceMode),
        rideBookingEnabled: saved.rideBookingEnabled !== false,
        driverRegistrationEnabled:
          saved.driverRegistrationEnabled !== false,
      })

      setMessage('App settings saved successfully.')
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        t.unableToSaveAppSettings
      )
    } finally {
      setSaving(false)
    }
  }

  const rows = [
    {
      key: 'maintenanceMode',
      title: t.maintenanceMode,
      description: t.maintenanceModeDescription,
    },
    {
      key: 'rideBookingEnabled',
      title: t.rideBooking,
      description: t.rideBookingDescription,
    },
    {
      key: 'driverRegistrationEnabled',
      title: t.driverRegistration,
      description: t.driverRegistrationDescription,
    },
  ]

  return (
    <div className="min-h-full bg-white p-4 sm:p-6">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => navigate('/admin/dashboard', { state: { tab: 'settings' } })}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900"
        >
          <i className="ri-arrow-left-line" />
          {t.backToSettings}
        </button>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <i className="ri-settings-3-line text-xl" />
            </div>

            <h1 className="text-xl font-semibold text-neutral-900">
              {t.appSettingsTitle}
            </h1>

            <p className="mt-1 text-sm text-neutral-500">
              {t.managePlatformConfiguration}
            </p>
          </div>

          {loading ? (
            <div className="py-10 text-center text-sm text-neutral-500">
              {t.loadingSettings}
            </div>
          ) : (
            <>
              <div className="divide-y divide-neutral-200 rounded-xl border border-neutral-200">
                {rows.map((row) => {
                  const enabled = settings[row.key]

                  return (
                    <div
                      key={row.key}
                      className="flex items-center justify-between gap-4 p-4 sm:p-5"
                    >
                      <div>
                        <h2 className="text-sm font-semibold text-neutral-900">
                          {row.title}
                        </h2>
                        <p className="mt-1 text-sm text-neutral-500">
                          {row.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={enabled}
                        onClick={() => toggleSetting(row.key)}
                        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                          enabled ? 'bg-orange-500' : 'bg-neutral-300'
                        }`}
                      >
                        <span
                          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                            enabled ? 'left-6' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                  )
                })}
              </div>

              {error && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {message && (
                <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {message}
                </div>
              )}

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="mt-6 w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? t.savingSettings : t.saveSettings}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
