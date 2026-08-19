import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiClient } from '../services/http'
import { formatApiError } from '../utils/apiError'
import { isAdminRoleToken } from '../utils/jwtPayload'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    setError('')
    try {
      setLoading(true)
      const payload = {
        email: String(email || '').trim().toLowerCase(),
        password: String(password || '').trim(),
      }
      const { data } = await apiClient.post('/admin/login', payload)
      const token = data?.token
      if (!token) {
        setError('Invalid response from server')
        return
      }
      if (!isAdminRoleToken(token)) {
        setError('Access denied — admin role required')
        return
      }
      localStorage.setItem('adminToken', token)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(formatApiError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh min-h-screen items-center justify-center bg-[#071A2B] p-5 font-sans text-white sm:p-8">
      <main className="w-full max-w-[420px] rounded-[28px] border border-[#294057] bg-[#071A2B] px-5 py-10 shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:px-9 sm:py-12">
        <div className="mx-auto mb-10 flex flex-col items-center text-center">
          <div className="grid h-[76px] w-[76px] place-items-center overflow-hidden rounded-2xl border-2 border-[#FFB000] bg-[#071A2B] p-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.2)]">
            <img src="/icons/logo.jpg" alt="RideEasy" className="h-full w-full rounded-xl object-cover" />
          </div>
          <h1 className="mt-5 text-[28px] font-bold tracking-tight text-white">RideEasy Admin</h1>
        </div>

        <form onSubmit={submitHandler} className="space-y-5" autoComplete="off">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#CBD5E1]">Email address</label>
            <input
              type="email"
              name="rideeasy-admin-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              className="h-12 w-full rounded-xl border border-[#294057] bg-[#14283D] px-4 text-base text-white outline-none placeholder:text-[#CBD5E1]/60 focus:border-[#FFB000] focus:ring-2 focus:ring-[#FFB000]/20"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[#CBD5E1]">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="rideeasy-admin-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
                className="h-12 w-full rounded-xl border border-[#294057] bg-[#14283D] px-4 pr-12 text-base text-white outline-none placeholder:text-[#CBD5E1]/60 focus:border-[#FFB000] focus:ring-2 focus:ring-[#FFB000]/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute inset-y-0 right-0 grid w-12 place-items-center text-lg text-[#CBD5E1] hover:text-white"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} />
              </button>
            </div>
          </div>
          {error && <p className="rounded-xl border border-[#EF4444]/50 bg-[#EF4444]/10 px-3 py-2.5 text-sm text-[#FECACA]">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-12 w-full rounded-xl bg-[#FFB000] text-base font-bold text-[#111827] shadow-sm transition-colors hover:bg-[#FFC34D] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#CBD5E1]">
          <i className="ri-shield-check-line text-base text-[#FFB000]" />
          <span>Secure admin access</span>
        </div>

        <Link to="/" className="mt-7 block text-center text-xs font-medium text-[#CBD5E1]/70 transition-colors hover:text-white">Back to home</Link>
      </main>
    </div>
  )
}

export default AdminLogin
