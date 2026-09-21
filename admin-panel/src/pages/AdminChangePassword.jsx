import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi } from '../services/adminApi'

const AdminChangePassword = () => {
  const navigate = useNavigate()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')


  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess('')

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all password fields.')
      return
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation password do not match.')
      return
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from your current password.')
      return
    }

    setLoading(true)

    try {
      await adminApi.changePassword(currentPassword, newPassword)

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setSuccess('Password changed successfully.')
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          'Unable to change password. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
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
                Change Password
              </h1>

              <p className="mt-1 text-sm text-[#718096]">
                Update your administrator account password.
              </p>
            </div>
          </div>
        </div>

        {/* PASSWORD CARD */}
        <section className="w-full max-w-3xl overflow-hidden rounded-2xl border border-[#E6EBF2] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.05)]">

          <div className="border-b border-[#E6EBF2] bg-[#F7F9FC] px-5 py-5 sm:px-6">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#0B1B2B] text-white">
                <i className="ri-lock-password-line text-xl" />
              </div>

              <div>
                <h2 className="text-base font-bold text-[#152238] sm:text-lg">
                  Password Security
                </h2>

                <p className="mt-0.5 text-sm text-[#718096]">
                  Choose a strong password with at least 6 characters.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 p-5 sm:p-6"
          >

            {/* CURRENT PASSWORD */}
            <div>
              <label
                htmlFor="admin-current-password"
                className="mb-2 block text-sm font-semibold text-[#334155]"
              >
                Current Password
              </label>

              <div className="relative">
                <input
                  id="admin-current-password"
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  autoComplete="current-password"
                  className="h-11 w-full rounded-xl border border-[#CBD5E1] bg-white px-4 pr-11 text-sm text-[#152238] outline-none transition focus:border-[#FFA726] focus:ring-2 focus:ring-[#FFA726]/20"
                />

                <button
                  type="button"
                  onClick={() => setShowCurrent((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#718096] hover:text-[#334155]"
                  aria-label={showCurrent ? 'Hide current password' : 'Show current password'}
                >
                  <i className={showCurrent ? 'ri-eye-off-line' : 'ri-eye-line'} />
                </button>
              </div>
            </div>

            {/* NEW PASSWORD */}
            <div>
              <label
                htmlFor="admin-new-password"
                className="mb-2 block text-sm font-semibold text-[#334155]"
              >
                New Password
              </label>

              <div className="relative">
                <input
                  id="admin-new-password"
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  autoComplete="new-password"
                  className="h-11 w-full rounded-xl border border-[#CBD5E1] bg-white px-4 pr-11 text-sm text-[#152238] outline-none transition focus:border-[#FFA726] focus:ring-2 focus:ring-[#FFA726]/20"
                />

                <button
                  type="button"
                  onClick={() => setShowNew((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#718096] hover:text-[#334155]"
                  aria-label={showNew ? 'Hide new password' : 'Show new password'}
                >
                  <i className={showNew ? 'ri-eye-off-line' : 'ri-eye-line'} />
                </button>
              </div>

              <p className="mt-2 text-xs text-[#718096]">
                Minimum 6 characters.
              </p>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label
                htmlFor="admin-confirm-password"
                className="mb-2 block text-sm font-semibold text-[#334155]"
              >
                Confirm New Password
              </label>

              <div className="relative">
                <input
                  id="admin-confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  className="h-11 w-full rounded-xl border border-[#CBD5E1] bg-white px-4 pr-11 text-sm text-[#152238] outline-none transition focus:border-[#FFA726] focus:ring-2 focus:ring-[#FFA726]/20"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#718096] hover:text-[#334155]"
                  aria-label={showConfirm ? 'Hide confirmation password' : 'Show confirmation password'}
                >
                  <i className={showConfirm ? 'ri-eye-off-line' : 'ri-eye-line'} />
                </button>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm font-semibold text-[#B91C1C]">
                <i className="ri-error-warning-line text-lg" />
                {error}
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="flex items-center gap-2 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-sm font-semibold text-[#15803D]">
                <i className="ri-checkbox-circle-line text-lg" />
                {success}
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
                type="submit"
                disabled={loading}
                className="h-11 rounded-xl bg-[#FFA726] px-5 text-sm font-bold text-[#0B1B2B] shadow-[0_5px_12px_rgba(255,167,38,0.16)] transition hover:bg-[#FFB74D] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>

            </div>
          </form>
        </section>
      </div>
  )
}

export default AdminChangePassword