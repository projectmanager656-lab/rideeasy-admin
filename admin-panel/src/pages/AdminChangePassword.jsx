import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi } from '../services/adminApi'

export default function AdminChangePassword () {
  const navigate = useNavigate()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.')
      return
    }

    setLoading(true)

    try {
      await adminApi.changePassword(currentPassword, newPassword)

      setMessage('Password changed successfully.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Unable to change password.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-full bg-white p-4 sm:p-6">
      <div className="mx-auto max-w-2xl">
        <button
          type="button"
          onClick={() => navigate('/admin/dashboard', { state: { tab: 'settings' } })}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900"
        >
          <i className="ri-arrow-left-line" />
          Back to Settings
        </button>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <i className="ri-lock-password-line text-xl" />
            </div>

            <h1 className="text-xl font-semibold text-neutral-900">
              Change Password
            </h1>

            <p className="mt-1 text-sm text-neutral-500">
              Update your admin account password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-neutral-700">
                Current Password
              </span>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                placeholder="Enter current password"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-neutral-700">
                New Password
              </span>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                placeholder="Enter new password"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-neutral-700">
                Confirm New Password
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                placeholder="Confirm new password"
              />
            </label>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Changing Password…' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
